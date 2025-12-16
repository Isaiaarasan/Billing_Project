import React, { createContext, useContext, useState, useEffect } from "react";

const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
  // Load from localStorage or default to empty
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem("products");
    return saved
      ? JSON.parse(saved)
      : [
          { id: 1, name: "ENGINE oil", price: 100 },
          { id: 2, name: "Stove", price: 667 },
          { id: 3, name: "500", price: 100 },
        ];
  });

  const [invoices, setInvoices] = useState(() => {
    const saved = localStorage.getItem("invoices");
    return saved ? JSON.parse(saved) : [];
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
    localStorage.setItem("invoices", JSON.stringify(invoices));
  }, [products, invoices]);

  const addProduct = (product) => {
    setProducts((prev) => [product, ...prev]);
  };

  const addInvoice = (invoice) => {
    setInvoices((prev) => [invoice, ...prev]);
  };

  return (
    <ShopContext.Provider
      value={{ products, invoices, addProduct, addInvoice }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => useContext(ShopContext);
