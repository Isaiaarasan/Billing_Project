import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useShop } from "../../context/ShopContext";
import { useAuth } from "../../context/AuthContext";
import { ChevronLeft, Package, Edit, Trash2, Plus } from "lucide-react";
import Input from "../../components/Input";
import Button from "../../components/Button";

const ManageProducts = () => {
  const navigate = useNavigate();
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    loading: shopLoading,
  } = useShop();
  const { isAdmin } = useAuth();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!name || !price) return;
    setLoading(true);

    try {
      await addProduct({ name, price: Number(price) });
      setName("");
      setPrice("");
    } catch (error) {
      console.error("Failed to add product:", error);
      alert("Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
    setEditName(product.name);
    setEditPrice(product.price);
  };

  const handleUpdate = async () => {
    if (!editName || !editPrice) return;
    setLoading(true);

    try {
      await updateProduct(editingId, {
        name: editName,
        price: Number(editPrice),
      });
      setEditingId(null);
      setEditName("");
      setEditPrice("");
    } catch (error) {
      console.error("Failed to update product:", error);
      alert("Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    try {
      await deleteProduct(id);
    } catch (error) {
      console.error("Failed to delete product:", error);
      alert("Failed to delete product");
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditPrice("");
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
        <h1 className="font-bold text-lg flex items-center gap-2">
          <Package size={20} />
          Product Management
        </h1>
      </div>

      <div className="p-4 max-w-4xl mx-auto space-y-6">
        {/* Add Product Form - Admin Only */}
        {isAdmin && (
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 space-y-4">
            <h2 className="font-semibold text-gray-800 flex items-center gap-2">
              <Plus size={18} />
              {editingId ? "Edit Product" : "Add New Product"}
            </h2>

            {editingId ? (
              <div className="space-y-4">
                <Input
                  label="Product Name"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
                <Input
                  label="Price"
                  type="number"
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                />
                <div className="flex gap-2">
                  <Button onClick={handleUpdate} loading={loading}>
                    Update Product
                  </Button>
                  <Button onClick={cancelEdit} variant="secondary">
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <Input
                  label="Product Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <Input
                  label="Price"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
                <Button onClick={handleAdd} loading={loading}>
                  Add Product
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Products List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-5 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800">
              Product List ({products.length})
            </h2>
          </div>

          {shopLoading ? (
            <div className="p-8 text-center text-gray-500">
              Loading products...
            </div>
          ) : products.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Package size={48} className="mx-auto mb-4 opacity-20" />
              <p>No products available</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="p-4 flex items-center justify-between hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Added by: {product.addedBy?.name || "Unknown"}
                    </p>
                    <p className="text-xs text-gray-400">
                      Created:{" "}
                      {new Date(product.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-lg text-green-600">
                      ₹{product.price}
                    </span>
                    {isAdmin && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageProducts;
