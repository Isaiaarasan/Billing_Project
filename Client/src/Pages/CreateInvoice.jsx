import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useShop } from "../context/ShopContext";
import { Plus, Trash2, Save, ChevronLeft, RefreshCw, ShoppingCart, Printer } from "lucide-react";
import Input from "../components/Input";
import Button from "../components/Button";
import ProductLookup from "../components/ProductLookup";

const CreateInvoice = () => {
  const navigate = useNavigate();
  const { addInvoice, products, fetchProducts } = useShop();

  // Form States
  const [customerName, setCustomerName] = useState("");
  const [billItems, setBillItems] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  // Product Entry States
  const [selectedProduct, setSelectedProduct] = useState(""); // Name string
  const [qty, setQty] = useState("1");
  const [rate, setRate] = useState("");

  // Refresh products on mount to ensure latest pricing
  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle Product Selection from Lookup
  const handleProductSelect = (product) => {
    setSelectedProduct(product.name);
    setRate(product.price);
  };

  const addItem = () => {
    if (!selectedProduct || !rate) return alert("Please select a product and ensure rate is set.");

    // Check if item already exists in bill (Video request: "easier")
    // Merging logic if user adds same item twice?
    // User didn't explicitly ask to merge, but it's cleaner. Let's just add new row for now to keep it simple as different rates might apply.

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

  const calculateTotal = () =>
    billItems.reduce((acc, item) => acc + item.total, 0);

  const handleSaveInvoice = async () => {
    if (billItems.length === 0) return alert("Add items first!");
    if (!customerName) return alert("Please enter customer name");

    setIsSaving(true);
    const invoice = {
      customerName,
      items: billItems,
      totalAmount: calculateTotal(),
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
    <div className="min-h-screen bg-gray-50 pb-32">
      {/* Navbar with Refresh */}
      <div className="bg-white px-4 py-3 shadow-sm flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/dashboard")}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <ChevronLeft size={24} />
          </button>
          <h1 className="font-bold text-lg">New Invoice</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchProducts}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all"
            title="Refresh Prices"
          >
            <RefreshCw size={18} />
          </button>
        </div>
      </div>

      <div className="p-4 max-w-lg mx-auto space-y-6">
        {/* Customer Section */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <Input
            label="Customer Name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Client Name or Business"
          />
        </div>

        {/* Add Item Section */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <ShoppingCart size={20} className="text-blue-600" />
            <h3 className="font-bold text-gray-800">Add Items</h3>
          </div>

          <div className="flex flex-col gap-4">
            {/* New Product Lookup Component */}
            <ProductLookup
              products={products}
              onSelect={handleProductSelect}
            />
            {/* Show selected product if manually typed or just to confirm */}
            {selectedProduct && (
              <div className="text-sm text-blue-600 font-medium px-2 -mt-2">
                Selected: <span className="font-bold">{selectedProduct}</span>
              </div>
            )}

            <div className="flex gap-3">
              <Input
                label="Qty"
                type="number"
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                className="w-1/3"
                min="1"
              />
              <Input
                label="Rate (₹)"
                type="number"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                className="w-2/3"
                placeholder="0.00"
              />
            </div>
          </div>

          <Button onClick={addItem} variant="secondary" className="w-full mt-2">
            <Plus size={18} /> Add to Bill
          </Button>
        </div>

        {/* Bill Summary */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 min-h-[200px]">
          <div className="flex justify-between items-end mb-4 border-b border-gray-100 pb-3">
            <h3 className="font-bold text-gray-700">Invoice Items</h3>
            <div className="text-right">
              <span className="text-xs text-gray-500 block uppercase font-bold">Total Payable</span>
              <span className="text-2xl font-black text-blue-600 leading-none">
                ₹{calculateTotal()}
              </span>
            </div>
          </div>

          {billItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-gray-300">
              <ShoppingBagIcon size={48} className="mb-2 opacity-50" />
              <p className="text-sm">Cart is empty</p>
            </div>
          ) : (
            <div className="space-y-3">
              {billItems.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center bg-gray-50 p-3 rounded-xl border border-gray-100"
                >
                  <div>
                    <p className="font-bold text-gray-800">{item.name}</p>
                    <p className="text-xs text-gray-500 font-mono">
                      {item.qty} x ₹{item.rate}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-gray-900">₹{item.total}</span>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 w-full bg-white border-t border-gray-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="max-w-lg mx-auto flex gap-3">
          <Button
            onClick={handleSaveInvoice}
            disabled={isSaving || billItems.length === 0}
            className="flex-1"
          >
            <Save size={18} /> {isSaving ? "Saving..." : "Save Invoice"}
          </Button>
        </div>
      </div>
    </div>
  );
};
// Helper icon for empty state
const ShoppingBagIcon = ({ size, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
)

export default CreateInvoice;
