import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../Pages/Home";
import CreateInvoice from "../Pages/CreateInvoice";
import ManageProducts from "../Pages/Admin/ManageProducts";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/create-invoice" element={<CreateInvoice />} />
      <Route path="/manage-products" element={<ManageProducts />} />
    </Routes>
  );
};

export default AppRoutes;
