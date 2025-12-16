import React, { createContext, useContext, useState, useEffect } from "react";
import productService from "../services/productService";
import invoiceService from "../services/invoiceService";
import { useAuth } from "./AuthContext";

const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [products, setProducts] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch products from API when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const fetchProducts = async () => {
        try {
          const data = await productService.getProducts();
          setProducts(data);
        } catch (error) {
          console.error("Failed to fetch products:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchProducts();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const addProduct = async (product) => {
    try {
      const newProduct = await productService.createProduct(product);
      setProducts((prev) => [newProduct, ...prev]);
    } catch (error) {
      console.error("Failed to add product:", error);
      throw error;
    }
  };

  const updateProduct = async (id, productData) => {
    try {
      const updatedProduct = await productService.updateProduct(
        id,
        productData
      );
      setProducts((prev) =>
        prev.map((p) => (p._id === id ? updatedProduct : p))
      );
    } catch (error) {
      console.error("Failed to update product:", error);
      throw error;
    }
  };

  const deleteProduct = async (id) => {
    try {
      await productService.deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (error) {
      console.error("Failed to delete product:", error);
      throw error;
    }
  };

  const addInvoice = async (invoice) => {
    try {
      const newInvoice = await invoiceService.createInvoice(invoice);
      setInvoices((prev) => [newInvoice, ...prev]);
    } catch (error) {
      console.error("Failed to create invoice:", error);
      throw error;
    }
  };

  const fetchInvoices = async () => {
    try {
      const data = await invoiceService.getMyInvoices();
      setInvoices(data);
    } catch (error) {
      console.error("Failed to fetch invoices:", error);
    }
  };

  return (
    <ShopContext.Provider
      value={{
        products,
        invoices,
        loading,
        addProduct,
        updateProduct,
        deleteProduct,
        addInvoice,
        fetchInvoices,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => useContext(ShopContext);
