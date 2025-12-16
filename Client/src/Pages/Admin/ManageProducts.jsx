import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useShop } from "../../context/ShopContext";
import { ChevronLeft, Package } from "lucide-react";
import Input from "../../components/Input";
import Button from "../../components/Button";

const ManageProducts = () => {
  const navigate = useNavigate();
  const { products, addProduct } = useShop();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdd = () => {
    if (!name || !price) return;
    setLoading(true);

    // Simulate API delay
    setTimeout(() => {
      addProduct({ id: Date.now(), name, price: Number(price) });
      setName("");
      setPrice("");
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white px-4 py-3 shadow-sm flex items-center gap-3 sticky top-0 z-10">
        <button
          onClick={() => navigate(-1)}
          className="p-1 hover:bg-gray-100 rounded-full"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="font-bold text-lg">Manage Products</h1>
      </div>

      <div className="p-4 max-w-lg mx-auto space-y-6">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 space-y-4">
          <h2 className="font-semibold text-gray-800">Add New Product</h2>
          <Input
            label="Product Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            label="Default Price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <Button onClick={handleAdd} disabled={loading}>
            {loading ? "Saving..." : "Add Product"}
          </Button>
        </div>

        <div>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 ml-1">
            Inventory
          </h3>
          <div className="space-y-2">
            {products.map((p) => (
              <div
                key={p.id}
                className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-500">
                    <Package size={18} />
                  </div>
                  <span className="font-medium text-gray-700">{p.name}</span>
                </div>
                <span className="font-bold text-gray-900">₹{p.price}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageProducts;
