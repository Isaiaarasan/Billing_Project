import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useShop } from "../context/ShopContext";
import { Plus, Trash2, Save, ChevronLeft } from "lucide-react";
import Input from "../components/Input";
import Button from "../components/Button";

const CreateInvoice = () => {
  const navigate = useNavigate();
  const { addInvoice, products } = useShop();

  // Form States
  const [customerName, setCustomerName] = useState("");
  const [billItems, setBillItems] = useState([]);

  // Product Entry States
  const [selectedProduct, setSelectedProduct] = useState("");
  const [qty, setQty] = useState("1");
  const [rate, setRate] = useState("");

  // Handle Product Selection (Auto-fill rate)
  const handleProductChange = (e) => {
    const name = e.target.value;
    setSelectedProduct(name);
    const found = products.find((p) => p.name === name);
    if (found) setRate(found.price);
  };

  const addItem = () => {
    if (!selectedProduct || !rate) return;
    const newItem = {
      id: Date.now(),
      name: selectedProduct,
      qty: Number(qty),
      rate: Number(rate),
      total: Number(qty) * Number(rate),
    };
    setBillItems([...billItems, newItem]);
    setSelectedProduct("");
    setQty("1");
    setRate("");
  };

  const removeItem = (id) => {
    setBillItems(billItems.filter((item) => item.id !== id));
  };

  const calculateTotal = () =>
    billItems.reduce((acc, item) => acc + item.total, 0);

  const handleSaveInvoice = () => {
    if (billItems.length === 0) return alert("Add items first!");

    const invoice = {
      id: Date.now(),
      date: new Date(),
      customerName,
      items: billItems,
      total: calculateTotal(),
    };

    addInvoice(invoice);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Navbar */}
      <div className="bg-white px-4 py-3 shadow-sm flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/")}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <ChevronLeft size={24} />
          </button>
          <h1 className="font-bold text-lg">New Invoice</h1>
        </div>
        <button
          onClick={() => navigate("/manage-products")}
          className="text-sm font-medium text-blue-600"
        >
          + Product
        </button>
      </div>

      <div className="p-4 max-w-lg mx-auto space-y-6">
        {/* Customer Section */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <Input
            label="Customer Name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Enter name"
          />
        </div>

        {/* Add Item Section */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-3">
          <h3 className="font-semibold text-gray-800">Add Item</h3>

          <div className="flex flex-col gap-3">
            {/* Product Search / Datalist */}
            <div>
              <label className="text-xs text-gray-500 font-bold uppercase ml-1 mb-1 block">
                Product
              </label>
              <input
                list="product-list"
                value={selectedProduct}
                onChange={handleProductChange}
                className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search product..."
              />
              <datalist id="product-list">
                {products.map((p) => (
                  <option key={p.id} value={p.name} />
                ))}
              </datalist>
            </div>

            <div className="flex gap-3">
              <Input
                label="Qty"
                type="number"
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                className="w-1/3"
              />
              <Input
                label="Rate"
                type="number"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                className="w-2/3"
              />
            </div>
          </div>

          <Button onClick={addItem} variant="secondary">
            <Plus size={18} /> Add to Bill
          </Button>
        </div>

        {/* Bill Summary */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-end mb-4 border-b border-gray-100 pb-2">
            <h3 className="font-semibold text-gray-700">Bill Items</h3>
            <span className="text-xl font-bold text-blue-600">
              ₹{calculateTotal()}
            </span>
          </div>

          {billItems.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-4">
              No items added
            </p>
          ) : (
            <div className="space-y-3">
              {billItems.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center bg-gray-50 p-3 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-800">{item.name}</p>
                    <p className="text-xs text-gray-500">
                      {item.qty} x ₹{item.rate}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold">₹{item.total}</span>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-400 hover:text-red-600 p-1"
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
      <div className="fixed bottom-0 w-full bg-white border-t border-gray-200 p-4">
        <div className="max-w-lg mx-auto">
          <Button onClick={handleSaveInvoice}>
            <Save size={18} /> Save Invoice
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateInvoice;
