import React, { useState, useEffect } from "react";
import { useShop } from "../context/ShopContext";
import { Plus, Save, Trash2, ShoppingCart, ChevronLeft, RefreshCw, Smartphone, User, CreditCard, DollarSign, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Input from "../components/Input";
import ProductLookup from "../components/ProductLookup";
import { printInvoice } from "../utils/printInvoice";

const CreateInvoice = () => {
    const { addInvoice, products, fetchProducts } = useShop();
    const navigate = useNavigate();

    // Customer states
    const [customerName, setCustomerName] = useState("");
    // FIX: Renamed customerEqual to customerMobile for clarity and correctness
    const [customerMobile, setCustomerMobile] = useState("");
    const [customerEmail, setCustomerEmail] = useState("");

    // Bill Item states
    const [billItems, setBillItems] = useState([]);

    // Item input states
    const [selectedProduct, setSelectedProduct] = useState("");
    const [qty, setQty] = useState("1");
    const [rate, setRate] = useState("");

    // Payment states
    const [paymentMode, setPaymentMode] = useState("Cash");
    const [amountGiven, setAmountGiven] = useState("");

    // Derived state for change
    const [change, setChange] = useState(0);

    const [isSaving, setIsSaving] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    useEffect(() => {
        // Refresh products on mount to ensure latest prices
        fetchProducts();
    }, []);

    const handleRefreshProducts = async () => {
        setIsRefreshing(true);
        await fetchProducts();
        setIsRefreshing(false);
    };

    const addItem = () => {
        if (!selectedProduct || !rate || Number(qty) <= 0) {
            return alert("Please select a product, set a valid rate, and quantity.");
        }

        const newItem = {
            id: Date.now(),
            name: selectedProduct,
            qty: Number(qty),
            rate: Number(rate),
            total: Number(qty) * Number(rate),
        };
        setBillItems([...billItems, newItem]);

        // Reset fields
        setSelectedProduct("");
        setQty("1");
        setRate("");
    };

    const removeItem = (id) => {
        setBillItems(billItems.filter((item) => item.id !== id));
    };

    const handleProductSelect = (product) => {
        setSelectedProduct(product.name);
        setRate(product.price);
    };

    const finalTotal = billItems.reduce((acc, curr) => acc + curr.total, 0);

    const formatCurrency = (amount) => {
        return amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    const handleSave = async () => {
        if (!customerName || billItems.length === 0) {
            return alert("Please fill customer details and add at least one item.");
        }

        setIsSaving(true);
        const invoice = {
            customerName,
            customerMobile,
            customerEmail,
            items: billItems,
            totalAmount: finalTotal,
            paymentMode,
            cashDetails: paymentMode === "Cash" ? { amountGiven: Number(amountGiven), change: Number(change) } : null,
            createdAt: new Date().toISOString(),
        };

        try {
            await addInvoice(invoice);
            alert("Invoice saved successfully! Now generating PDF...");
            // Automatically trigger download after save
            handleDownloadPDF(customerName, finalTotal);
        } catch (error) {
            console.error("Failed to save invoice:", error);
            alert("Failed to save invoice. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDownloadPDF = () => {
        // Construct the invoice object to match the utility's expected format
        const invoice = {
            customerName,
            customerMobile,
            customerEmail,
            items: billItems,
            totalAmount: finalTotal,
            paymentMode,
            cashDetails: paymentMode === "Cash" ? { amountGiven: Number(amountGiven), change: Number(change) } : null,
            createdAt: new Date().toISOString(),
        };
        printInvoice(invoice);
    };

    // Update Change effect
    useEffect(() => {
        if (paymentMode === "Cash" && amountGiven) {
            setChange(Number(amountGiven) - finalTotal);
        } else {
            setChange(0);
        }
    }, [amountGiven, finalTotal, paymentMode]);

    // The sticky/flex layout needs the main content wrapper to have overflow-y-auto
    return (
        <div className="h-screen bg-slate-50 flex flex-col relative overflow-hidden">

            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-100/50 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

            {/* Header: sticky top-0 */}
            <div className="bg-white/90 backdrop-blur-sm px-6 py-4 border-b border-slate-200 sticky top-0 z-50 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate("/dashboard")} className="p-2 -ml-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
                        <ChevronLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            <DollarSign size={20} className="text-indigo-600" /> New Sales Invoice
                        </h1>
                        <p className="text-xs text-slate-500">Create, bill, and manage transactions</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleRefreshProducts}
                        className={`p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-all ${isRefreshing ? 'animate-spin' : ''}`}
                        title="Refresh Product Prices"
                    >
                        <RefreshCw size={20} />
                    </button>
                </div>
            </div>

            {/* Main Content: Split Layout - Added overflow-y-auto to allow scrolling of main content area if needed */}
            <div className="flex-1 max-w-7xl mx-auto w-full p-4 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 overflow-y-auto">

                {/* LEFT: Editor Area (Customer + Items) */}
                <div className="lg:col-span-7 space-y-6 min-h-0">

                    {/* Section 1: Customer Details (Moved to top for logical flow) */}
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100/70">
                        <div className="flex items-center gap-2 mb-6 text-slate-800">
                            <User size={20} className="text-indigo-600" />
                            <h2 className="font-bold text-lg">Customer Details</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Input
                                label="Customer Name"
                                placeholder="Ex: John Doe"
                                value={customerName}
                                onChange={(e) => setCustomerName(e.target.value)}
                                required
                            />
                            <Input
                                label="Mobile Number"
                                placeholder="Ex: 9876543210"
                                // FIX: Corrected state variable name from customerEqual to customerMobile
                                value={customerMobile}
                                onChange={(e) => setCustomerMobile(e.target.value)}
                            />
                            <Input
                                label="Customer Email (Optional)"
                                placeholder="Ex: john@example.com"
                                value={customerEmail}
                                onChange={(e) => setCustomerEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Section 2: Add Items */}
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100/70 relative overflow-visible z-20">
                        <div className="flex items-center gap-2 mb-6 text-slate-800">
                            <ShoppingCart size={20} className="text-indigo-600" />
                            <h2 className="font-bold text-lg">Add Products</h2>
                        </div>

                        <div className="space-y-4">
                            <ProductLookup products={products} onSelect={handleProductSelect} />

                            <div className="grid grid-cols-12 gap-4">
                                <div className="col-span-12 sm:col-span-6">
                                    <Input
                                        label="Product Name (Selected)"
                                        placeholder="Select or type..."
                                        value={selectedProduct}
                                        onChange={(e) => setSelectedProduct(e.target.value)}
                                        disabled
                                        className="bg-slate-50"
                                    />
                                </div>
                                <div className="col-span-8 sm:col-span-4">
                                    <Input
                                        label="Rate (₹)"
                                        type="number"
                                        placeholder="0.00"
                                        value={rate}
                                        onChange={(e) => setRate(e.target.value)}
                                    />
                                </div>
                                <div className="col-span-4 sm:col-span-2">
                                    <Input
                                        label="Qty"
                                        type="number"
                                        min="1"
                                        value={qty}
                                        onChange={(e) => setQty(e.target.value)}
                                    />
                                </div>
                            </div>

                            <button
                                onClick={addItem}
                                className="w-full bg-slate-900 text-white h-[42px] rounded-xl font-semibold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 shadow-md"
                                disabled={!selectedProduct || !rate || Number(qty) <= 0}
                            >
                                <Plus size={18} /> Add to Bill
                            </button>
                        </div>
                    </div>

                </div>

                {/* RIGHT: Invoice Preview / Summary */}
                <div className="lg:col-span-5 flex flex-col min-h-0 lg:max-h-[calc(100vh-64px)] lg:sticky lg:top-8">
                    <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 flex flex-col h-full">

                        {/* Bill Header */}
                        <div className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-slate-100 rounded-t-2xl flex-shrink-0">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Payable</p>
                                    <h2 className="text-4xl font-extrabold text-slate-900 mt-1">
                                        ₹{formatCurrency(finalTotal)}
                                    </h2>
                                </div>
                                <div className="bg-white p-3 rounded-xl shadow-lg">
                                    <DollarSign size={24} className="text-indigo-600" />
                                </div>
                            </div>
                        </div>

                        {/* Bill Items List */}
                        {/* Ensure list is scrollable within its container */}
                        <div className="flex-1 overflow-y-auto p-4 min-h-0">
                            {billItems.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-slate-400 py-12">
                                    <ShoppingCart size={48} className="opacity-20 mb-4" />
                                    <p className="text-base font-medium">Add items to create the bill.</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <div className="grid grid-cols-10 text-xs font-semibold text-slate-500 pb-2 px-3 border-b border-slate-100">
                                        <span className="col-span-4">ITEM</span>
                                        <span className="col-span-2 text-center">QTY</span>
                                        <span className="col-span-2 text-right">RATE</span>
                                        <span className="col-span-2 text-right">TOTAL</span>
                                    </div>
                                    {billItems.map((item) => (
                                        <div key={item.id} className="grid grid-cols-10 items-center p-3 hover:bg-slate-50 rounded-xl transition-all">
                                            <div className="col-span-4 min-w-0 pr-2">
                                                <p className="font-medium text-slate-800 truncate">{item.name}</p>
                                            </div>
                                            <span className="col-span-2 text-center font-medium text-slate-700">{item.qty}</span>
                                            <span className="col-span-2 text-right text-slate-600 text-sm">₹{formatCurrency(item.rate)}</span>

                                            <div className="col-span-2 text-right flex items-center justify-end gap-2">
                                                <span className="font-bold text-slate-900 text-sm">₹{formatCurrency(item.total)}</span>
                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    className="text-slate-300 hover:text-red-500 transition-colors p-1"
                                                    title="Remove item"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer Actions */}
                        {/* Payment & Footer Actions */}
                        <div className="p-6 border-t border-slate-100 bg-white rounded-b-2xl flex-shrink-0 space-y-4">

                            {/* Payment Mode Selection */}
                            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                                <p className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">Payment Mode</p>
                                <div className="flex bg-white rounded-lg p-1 border border-slate-200 shadow-sm">
                                    {['Cash', 'Card', 'UPI'].map(mode => (
                                        <button
                                            key={mode}
                                            onClick={() => setPaymentMode(mode)}
                                            className={`flex-1 py-1.5 text-sm font-semibold rounded-md transition-all ${paymentMode === mode
                                                ? 'bg-indigo-600 text-white shadow-md'
                                                : 'text-slate-600 hover:bg-slate-50'
                                                }`}
                                        >
                                            {mode}
                                        </button>
                                    ))}
                                </div>

                                {/* Custom Fields for Cash */}
                                {paymentMode === 'Cash' && (
                                    <div className="mt-3 grid grid-cols-2 gap-3 animate-fade-in-down">
                                        <div>
                                            <label className="text-[10px] font-bold text-slate-400 uppercase">Received (₹)</label>
                                            <input
                                                type="number"
                                                value={amountGiven}
                                                onChange={(e) => setAmountGiven(e.target.value)}
                                                className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                                placeholder="0.00"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold text-slate-400 uppercase">Change (₹)</label>
                                            <div className={`w-full px-2 py-1 text-sm font-bold rounded-lg border ${change < 0 ? 'bg-red-50 text-red-600 border-red-200' : 'bg-green-50 text-green-600 border-green-200'}`}>
                                                {change > 0 ? `+ ${formatCurrency(change)}` : formatCurrency(change)}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-4 mb-4 text-xs text-slate-500 font-medium">
                                <span className={`flex items-center gap-1 ${paymentMode === 'Card' ? 'text-indigo-600 font-bold' : ''}`}><CreditCard size={14} /> Accepted: Card</span>
                                <span className={`flex items-center gap-1 ${paymentMode === 'UPI' ? 'text-indigo-600 font-bold' : ''}`}><Smartphone size={14} /> Accepted: UPI</span>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => handleDownloadPDF(customerName, finalTotal)}
                                    disabled={billItems.length === 0}
                                    title="Download Invoice as PDF"
                                    className="flex-1 border border-slate-300 text-slate-700 bg-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Download size={20} /> PDF
                                </button>

                                <button
                                    onClick={handleSave}
                                    disabled={isSaving || billItems.length === 0}
                                    className="flex-1 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-xl shadow-indigo-500/20 disabled:opacity-50 disabled:shadow-none bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white transition-colors"
                                >
                                    {isSaving ? "Processing..." : <span>Generate & Save <Save size={20} /></span>}
                                </button>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
};

export default CreateInvoice;