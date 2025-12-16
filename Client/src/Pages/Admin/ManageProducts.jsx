import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useShop } from "../../context/ShopContext";
import { useAuth } from "../../context/AuthContext";
import { ChevronLeft, Package, Edit, Trash2, Plus, DollarSign } from "lucide-react"; // Added DollarSign
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

    // Form states
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState("");
    const [editPrice, setEditPrice] = useState("");
    const [loading, setLoading] = useState(false);

    // --- Styling Classes ---
    const primaryColor = "text-indigo-600";
    const primaryBg = "bg-indigo-600";
    const primaryHoverBg = "hover:bg-indigo-700";
    const priceColor = "text-teal-600";

    const handleAdd = async () => {
        if (!name || !price) return alert("Please fill in both product name and price.");
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
        if (!editName || !editPrice) return alert("Please fill in both product name and price.");
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
        if (!window.confirm("Are you sure you want to delete this product? This action is irreversible."))
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
        <div className="min-h-screen bg-slate-100/50">
            {/* Header */}
            <div className="bg-white px-6 py-4 shadow-md border-b border-slate-200 sticky top-0 z-10">
                <div className="max-w-4xl mx-auto flex items-center gap-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <h1 className="font-bold text-xl text-slate-900 flex items-center gap-2">
                        <Package size={24} className={primaryColor} />
                        Product Inventory Management
                    </h1>
                </div>
            </div>

            <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-8">
                
                {/* Add/Edit Product Form - Admin Only */}
                {isAdmin && (
                    <div className="bg-white p-6 rounded-2xl shadow-xl border border-indigo-100/50">
                        <h2 className="font-bold text-lg text-slate-800 flex items-center gap-2 mb-4">
                            <Plus size={20} className={editingId ? 'text-blue-500' : primaryColor} />
                            {editingId ? "Edit Product Pricing" : "Add New Inventory Item"}
                        </h2>

                        {editingId ? (
                            <div className="space-y-4">
                                <Input
                                    label="Product Name (Read-only)"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    disabled
                                    className="bg-slate-50"
                                />
                                <Input
                                    label="New Price (₹)"
                                    type="number"
                                    placeholder="e.g., 499.99"
                                    value={editPrice}
                                    onChange={(e) => setEditPrice(e.target.value)}
                                    required
                                />
                                <div className="flex gap-3 pt-2">
                                    <Button onClick={handleUpdate} loading={loading} className={`${primaryBg} ${primaryHoverBg} text-white font-semibold py-2 px-4 rounded-xl shadow-md`}>
                                        Update Price
                                    </Button>
                                    <Button onClick={cancelEdit} className="bg-slate-300 hover:bg-slate-400 text-slate-800 font-semibold py-2 px-4 rounded-xl transition-colors">
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="md:col-span-2">
                                    <Input
                                        label="Product Name"
                                        placeholder="e.g., Premium Widget"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <Input
                                        label="Price (₹)"
                                        type="number"
                                        placeholder="0.00"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="md:col-span-3 pt-2">
                                    <Button onClick={handleAdd} loading={loading} className={`${primaryBg} ${primaryHoverBg} text-white font-semibold py-2 px-4 rounded-xl shadow-md w-full`}>
                                        <Plus size={16} /> Add Product to Inventory
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Products List */}
                <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80">
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                        <h2 className="font-bold text-xl text-slate-900 flex items-center gap-2">
                            <DollarSign size={20} className={priceColor} />
                            Current Product Price List
                        </h2>
                        <span className="text-sm font-semibold text-slate-500 bg-slate-100 py-1 px-3 rounded-full">
                            {products.length} items
                        </span>
                    </div>

                    {shopLoading ? (
                        <div className="p-8 text-center text-slate-500">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                            <p>Loading products from server...</p>
                        </div>
                    ) : products.length === 0 ? (
                        <div className="p-12 text-center text-slate-400">
                            <Package size={56} className="mx-auto mb-4 opacity-20" />
                            <p className="text-lg font-medium">No products available in the inventory.</p>
                            {isAdmin && <p className="text-sm mt-2">Use the form above to add your first product.</p>}
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {products.map((product) => (
                                <div
                                    key={product._id}
                                    className="p-4 md:p-5 flex items-center justify-between hover:bg-slate-50 transition-colors"
                                >
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-lg text-slate-900 truncate">
                                            {product.name}
                                        </h3>
                                        <p className="text-xs text-slate-500 mt-1">
                                            Added by: {product.addedBy?.name || "System"}
                                        </p>
                                        <p className="text-xs text-slate-400">
                                            Created on: {new Date(product.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    
                                    <div className="flex items-center gap-4 flex-shrink-0">
                                        <span className={`font-extrabold text-xl ${priceColor}`}>
                                            ₹{product.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </span>
                                        {isAdmin && (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleEdit(product)}
                                                    className="p-2 text-indigo-500 hover:bg-indigo-50 rounded-full transition-colors disabled:opacity-50"
                                                    title="Edit Price"
                                                    disabled={editingId === product._id}
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product._id)}
                                                    className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                                    title="Delete Product"
                                                >
                                                    <Trash2 size={18} />
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