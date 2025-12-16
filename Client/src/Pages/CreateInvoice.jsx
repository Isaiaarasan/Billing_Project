import React, { useState, useEffect } from "react";
import { useShop } from "../context/ShopContext";
import { Plus, Save, Trash2, ShoppingCart, ChevronLeft, RefreshCw, Smartphone, User, FileText, CreditCard } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";
import ProductLookup from "../components/ProductLookup";

const CreateInvoice = () => {
  const { addInvoice, products, fetchProducts } = useShop();
  const [customerName, setCustomerName] = useState("");
  const [customerEqual, setCustomerMobile] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [billItems, setBillItems] = useState([]);

  // Item inputs
  const [selectedProduct, setSelectedProduct] = useState("");
  const [qty, setQty] = useState("1");
  const [rate, setRate] = useState("");

  const navigate = useNavigate();
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
    if (!selectedProduct || !rate) return alert("Please select a product and ensure rate is set.");

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

  const handleSave = async () => {
    if (!customerName || billItems.length === 0) {
      return alert("Please fill customer details and add at least one item.");
    }

    setIsSaving(true);
    const invoice = {
      id: Date.now(),
      customerName,
      items: billItems,
      totalAmount: finalTotal,
      createdAt: new Date().toISOString(),
    };

    try {
      await addInvoice(invoice);
      navigate("/dashboard");
    } catch (error) {
      alert("Failed to save invoice. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative">

      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-100/50 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md px-6 py-4 border-b border-slate-200 sticky top-0 z-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/dashboard")} className="p-2 -ml-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-900">New Invoice</h1>
            <p className="text-xs text-slate-500">Create and manage billing</p>
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

      {/* Main Content: Split Layout */}
      <div className="flex-1 max-w-7xl mx-auto w-full p-4 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* LEFT: Editor Area (Customer + Items) */}
        <div className="lg:col-span-7 space-y-6">

          {/* Section 1: Customer Details */}
          <div className="glass-panel p-6 rounded-2xl">
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
              />
              <Input
                label="Mobile Number"
                placeholder="Ex: 9876543210"
                value={customerEqual}
                onChange={(e) => setCustomerMobile(e.target.value)}
              />
            </div>
          </div>

          {/* Section 2: Add Items */}
          <div className="glass-panel p-6 rounded-2xl relative overflow-visible z-20">
            <div className="flex items-center gap-2 mb-6 text-slate-800">
              <ShoppingCart size={20} className="text-indigo-600" />
              <h2 className="font-bold text-lg">Add Products</h2>
            </div>

            <div className="space-y-4">
              <ProductLookup products={products} onSelect={handleProductSelect} />

              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-8 sm:col-span-9">
                  <Input
                    label="Product Name"
                    placeholder="Select or type..."
                    value={selectedProduct}
                    onChange={(e) => setSelectedProduct(e.target.value)}
                    disabled // Encourage using lookup, but technically can be enabled if we want free text
                    className="bg-slate-50"
                  />
                </div>
                <div className="col-span-4 sm:col-span-3">
                  <Input
                    label="Rate (₹)"
                    type="number"
                    placeholder="0.00"
                    value={rate}
                    onChange={(e) => setRate(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-end gap-4">
                <div className="w-24">
                  <Input
                    label="Qty"
                    type="number"
                    min="1"
                    value={qty}
                    onChange={(e) => setQty(e.target.value)}
                  />
                </div>
                <button
                  onClick={addItem}
                  className="flex-1 bg-slate-900 text-white h-[42px] rounded-lg font-medium hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus size={18} /> Add to Bill
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT: Invoice Preview / Summary */}
        <div className="lg:col-span-5 flex flex-col h-full">
          <div className="glass-panel rounded-2xl shadow-xl border border-slate-200 flex flex-col h-full sticky top-24">

            {/* Bill Header */}
            <div className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-slate-100 rounded-t-2xl">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Payable</p>
                  <h2 className="text-4xl font-extrabold text-slate-900 mt-1">₹{finalTotal.toLocaleString()}</h2>
                </div>
                <div className="bg-white p-2 rounded-lg shadow-sm">
                  <FileText size={24} className="text-indigo-600" />
                </div>
              </div>
            </div>

            {/* Bill Items List */}
            <div className="flex-1 overflow-y-auto p-2 max-h-[400px] lg:max-h-[500px]">
              {billItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-400 py-12">
                  <ShoppingCart size={48} className="opacity-20 mb-4" />
                  <p className="text-sm">Cart is empty</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {billItems.map((item) => (
                    <div key={item.id} className="group flex justify-between items-center p-3 hover:bg-slate-50 rounded-xl transition-all border border-transparent hover:border-slate-100">
                      <div className="flex-1">
                        <p className="font-semibold text-slate-800">{item.name}</p>
                        <p className="text-xs text-slate-500">{item.qty} x ₹{item.rate}</p>
                      </div>
                      <div className="text-right flex items-center gap-4">
                        <span className="font-bold text-slate-900">₹{item.total}</span>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-slate-300 hover:text-red-500 transition-colors p-1"
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
            <div className="p-6 border-t border-slate-100 bg-white rounded-b-2xl">
              <div className="flex gap-3 mb-4 text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1"><CreditCard size={14} /> Cash</span>
                <span className="flex items-center gap-1"><Smartphone size={14} /> UPI</span>
              </div>
              <button
                onClick={handleSave}
                disabled={isSaving || billItems.length === 0}
                className="w-full btn-primary py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-xl shadow-indigo-500/20 disabled:opacity-50 disabled:shadow-none"
              >
                {isSaving ? "Processing..." : "Generate Invoice"} <Save size={20} />
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default CreateInvoice;
