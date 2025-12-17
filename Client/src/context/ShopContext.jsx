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

  useEffect(() => {
    if (isAuthenticated) {
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

  const fetchAllInvoices = async () => {
    try {
      const data = await invoiceService.getAllInvoices();
      // We can reuse the same 'invoices' state or create a new 'allInvoices' state.
      // Since AdminHistory page will likely use this, reusing 'setInvoices' 
      // might affect other views if they rely on "my invoices".
      // However, for Simplicity, let's return the data directly or create a new state if needed.
      // But wait, the user wants a separate Admin History page.
      // Let's return the data so the component can manage it, OR add a new state 'adminInvoices'.
      return data;
    } catch (error) {
      console.error("Failed to fetch all invoices:", error);
      return [];
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
        fetchAllInvoices,
        fetchProducts,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => useContext(ShopContext);
