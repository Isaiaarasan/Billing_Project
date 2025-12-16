import React, { useState, useEffect, useRef } from "react";
import { Search, X, Check } from "lucide-react";

const ProductLookup = ({ products, onSelect }) => {
    const [query, setQuery] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [filteredProducts, setFilteredProducts] = useState(products);
    const wrapperRef = useRef(null);

    useEffect(() => {
        // Filter locally
        if (!query) {
            setFilteredProducts(products);
        } else {
            const lowerQ = query.toLowerCase();
            setFilteredProducts(
                products.filter((p) => p.name.toLowerCase().includes(lowerQ))
            );
        }
    }, [query, products]);

    // Handle outside click to close dropdown
    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

    const handleSelect = (product) => {
        onSelect(product);
        setQuery(""); // Clear query or keep it? Usually clear for next item.
        setIsOpen(false);
    };

    return (
        <div ref={wrapperRef} className="relative w-full">
            <label className="text-xs text-gray-500 font-bold uppercase ml-1 mb-1 block">
                Find Product
            </label>
            <div className="relative">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                    placeholder="Search for items..."
                    className="w-full p-3 pl-10 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                />
                <Search
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                {query && (
                    <button
                        onClick={() => {
                            setQuery("");
                            setIsOpen(false);
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                        <X size={16} />
                    </button>
                )}
            </div>

            {isOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white rounded-xl shadow-xl border border-gray-100 max-h-60 overflow-y-auto">
                    {filteredProducts.length === 0 ? (
                        <div className="p-4 text-center text-gray-500 text-sm">
                            No products found.
                        </div>
                    ) : (
                        <ul className="py-2">
                            {filteredProducts.map((product) => (
                                <li
                                    key={product._id}
                                    onClick={() => handleSelect(product)}
                                    className="px-4 py-3 hover:bg-blue-50 cursor-pointer flex justify-between items-center group transition-colors border-b border-gray-50 last:border-0"
                                >
                                    <div>
                                        <span className="font-medium text-gray-800 block">
                                            {product.name}
                                        </span>
                                        <span className="text-xs text-gray-400">Item ID: {product._id.slice(-4)}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md group-hover:bg-blue-100 transition-colors">
                                            ₹{product.price}
                                        </span>
                                        <Check size={16} className="text-transparent group-hover:text-blue-500" />
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
};

export default ProductLookup;
