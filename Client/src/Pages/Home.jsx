import React from "react";
import { useShop } from "../context/ShopContext";
import { Plus, FileText, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => {
  const { invoices } = useShop();

  return (
    <div className="p-4 max-w-lg mx-auto pb-24">
      <div className="flex justify-between items-center mb-6 mt-2">
        <h1 className="text-2xl font-bold text-gray-800">Invoices</h1>
        <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
          Total: {invoices.length}
        </div>
      </div>

      {invoices.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <FileText size={48} className="mx-auto mb-4 opacity-20" />
          <p>No invoices yet.</p>
          <p className="text-sm">Start by creating one!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {invoices.map((inv) => (
            <div
              key={inv.id}
              className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center"
            >
              <div>
                <p className="font-bold text-gray-800">
                  {inv.customerName || "Unknown Customer"}
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                  <Calendar size={12} />
                  {new Date(inv.date).toLocaleDateString()}
                </div>
              </div>
              <div className="text-right">
                <span className="block font-bold text-lg text-gray-900">
                  ₹{inv.total}
                </span>
                <span className="inline-block px-2 py-0.5 bg-green-100 text-green-700 text-[10px] rounded-md font-bold uppercase">
                  Paid
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Floating Action Button */}
      <Link
        to="/create-invoice"
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg shadow-blue-300 hover:scale-105 transition-transform"
      >
        <Plus size={24} />
      </Link>
    </div>
  );
};

export default Home;
