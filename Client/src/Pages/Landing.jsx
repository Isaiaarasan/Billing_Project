import React, { useState } from "react";
import { Plus, Trash2, History, ChevronLeft, Save } from "lucide-react";

// --- Reusable UI Components ---

const Card = ({ title, children, className = "" }) => (
  <div
    className={`bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-4 ${className}`}
  >
    {title && <h3 className="font-semibold text-gray-800 mb-3">{title}</h3>}
    {children}
  </div>
);

const Input = ({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  className = "",
}) => (
  <div className={`flex flex-col mb-3 ${className}`}>
    {label && (
      <label className="text-xs text-gray-500 font-medium mb-1">{label}</label>
    )}
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
    />
  </div>
);

const Button = ({
  children,
  onClick,
  variant = "primary",
  isLoading = false,
}) => {
  const baseStyle =
    "w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all";
  const styles = {
    primary: "bg-blue-500 text-white hover:bg-blue-600 active:scale-95",
    secondary: "bg-blue-50 text-blue-600 hover:bg-blue-100 active:scale-95",
    ghost: "bg-transparent text-gray-500 hover:bg-gray-50",
  };

  return (
    <button
      onClick={onClick}
      className={`${baseStyle} ${styles[variant]}`}
      disabled={isLoading}
    >
      {isLoading ? "Saving..." : children}
    </button>
  );
};

// --- Main Application Component ---

export default function InvoiceApp() {
  const [activeScreen, setActiveScreen] = useState("create-bill"); // 'create-bill' or 'add-product'

  // State for Create Bill
  const [billItems, setBillItems] = useState([]);
  const [customerName, setCustomerName] = useState("");

  // State for Product Form
  const [productName, setProductName] = useState("");
  const [qty, setQty] = useState("1");
  const [rate, setRate] = useState("");

  // State for Labour Form
  const [labourName, setLabourName] = useState("");
  const [labourCost, setLabourCost] = useState("");

  // State for "Add New Product" Screen (Database simulation)
  const [newProdName, setNewProdName] = useState("");
  const [newProdPrice, setNewProdPrice] = useState("");
  const [isSavingProduct, setIsSavingProduct] = useState(false);
  const [recentProducts, setRecentProducts] = useState([
    { id: 1, name: "500", price: 100 },
    { id: 2, name: "ENGINE oil", price: 100 },
    { id: 3, name: "Stove", price: 667 },
  ]);

  // --- Actions ---

  const addItemToBill = () => {
    if (!productName || !rate) return;
    const newItem = {
      id: Date.now(),
      type: "product",
      name: productName,
      qty: parseInt(qty) || 1,
      rate: parseFloat(rate) || 0,
      total: (parseInt(qty) || 1) * (parseFloat(rate) || 0),
    };
    setBillItems([...billItems, newItem]);
    // Reset fields
    setProductName("");
    setQty("1");
    setRate("");
  };

  const addLabourToBill = () => {
    if (!labourName || !labourCost) return;
    const newItem = {
      id: Date.now(),
      type: "labour",
      name: labourName,
      qty: 1, // Labour is usually singular or fixed cost
      rate: parseFloat(labourCost),
      total: parseFloat(labourCost),
    };
    setBillItems([...billItems, newItem]);
    setLabourName("");
    setLabourCost("");
  };

  const removeItem = (id) => {
    setBillItems(billItems.filter((item) => item.id !== id));
  };

  const calculateTotal = () => {
    return billItems.reduce((sum, item) => sum + item.total, 0).toFixed(2);
  };

  const saveNewProduct = () => {
    if (!newProdName || !newProdPrice) return;
    setIsSavingProduct(true);

    // Simulate API Delay
    setTimeout(() => {
      const newProduct = {
        id: Date.now(),
        name: newProdName,
        price: parseFloat(newProdPrice),
      };
      setRecentProducts([newProduct, ...recentProducts]);
      setNewProdName("");
      setNewProdPrice("");
      setIsSavingProduct(false);
      alert("Product added successfully!");
    }, 1000);
  };

  // --- Screens ---

  const CreateBillScreen = () => (
    <div className="bg-gray-100 min-h-screen pb-20">
      {/* Header */}
      <div className="bg-white p-4 sticky top-0 z-10 shadow-sm flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">New Invoice</h1>
        <button
          onClick={() => setActiveScreen("add-product")}
          className="text-blue-600 font-medium text-sm"
        >
          Manage Products
        </button>
      </div>

      <div className="p-4 max-w-md mx-auto">
        {/* Add Products Card */}
        <Card title="Add Products">
          <Input
            label="Product Name"
            placeholder="Search or enter product..."
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />
          <div className="flex gap-4">
            <Input
              label="Quantity"
              type="number"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              className="w-1/3"
            />
            <Input
              label="Rate (₹)"
              type="number"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              className="w-2/3"
            />
          </div>
          <Button onClick={addItemToBill}>
            <Plus size={18} /> Add Item
          </Button>
        </Card>

        {/* Labour Charges Card */}
        <Card title="Labour Charges">
          <div className="flex gap-4">
            <Input
              placeholder="e.g. Oil Change"
              value={labourName}
              onChange={(e) => setLabourName(e.target.value)}
              className="w-2/3"
            />
            <Input
              placeholder="0.00"
              type="number"
              value={labourCost}
              onChange={(e) => setLabourCost(e.target.value)}
              className="w-1/3"
            />
          </div>
          <Button variant="secondary" onClick={addLabourToBill}>
            <Plus size={18} /> Add Labour
          </Button>
        </Card>

        {/* Bill Items List */}
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-800">
              Bill Items ({billItems.length})
            </h3>
            <span className="text-blue-600 font-bold">
              Total: ₹{calculateTotal()}
            </span>
          </div>

          {billItems.length === 0 ? (
            <div className="text-center text-gray-400 py-6 text-sm">
              No items added yet
            </div>
          ) : (
            <div className="space-y-3">
              {billItems.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100"
                >
                  <div>
                    <p className="font-bold text-gray-800">{item.name}</p>
                    <p className="text-xs text-gray-500">
                      {item.type === "product"
                        ? `Qty: ${item.qty} x ₹${item.rate}`
                        : "Labour Charge"}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-gray-700">
                      ₹{item.total.toFixed(2)}
                    </span>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-400 hover:text-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Customer Info */}
        <Card title="Customer Information">
          <Input
            label="Customer Name"
            placeholder="Enter name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />
        </Card>
      </div>
    </div>
  );

  const AddProductScreen = () => (
    <div className="bg-gray-100 min-h-screen">
      <div className="bg-white p-4 sticky top-0 z-10 shadow-sm flex items-center gap-2">
        <button
          onClick={() => setActiveScreen("create-bill")}
          className="text-gray-600"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-bold text-gray-800">Add New Product</h1>
      </div>

      <div className="p-4 max-w-md mx-auto">
        <Card>
          <Input
            label="Product Name"
            value={newProdName}
            onChange={(e) => setNewProdName(e.target.value)}
          />
          <Input
            label="Default Price (INR)"
            type="number"
            value={newProdPrice}
            onChange={(e) => setNewProdPrice(e.target.value)}
          />
          <Button onClick={saveNewProduct} isLoading={isSavingProduct}>
            <Plus size={18} /> Add Product
          </Button>
        </Card>

        <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-3 mt-6">
          Recently Added Products
        </h3>

        <div className="space-y-2">
          {recentProducts.map((prod) => (
            <div
              key={prod.id}
              className="bg-white p-4 rounded-lg shadow-sm flex justify-between items-center"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                  <Save size={14} />
                </div>
                <span className="font-medium text-gray-700">{prod.name}</span>
              </div>
              <span className="font-bold text-gray-800">₹{prod.price}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {activeScreen === "create-bill" ? (
        <CreateBillScreen />
      ) : (
        <AddProductScreen />
      )}
    </div>
  );
}
