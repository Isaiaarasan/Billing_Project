import React from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";
import { ShopProvider } from "./context/ShopContext";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ShopProvider>
          <AppRoutes />
        </ShopProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
