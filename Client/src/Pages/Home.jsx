import React, { useEffect } from "react";
import { useShop } from "../context/ShopContext";
import { useAuth } from "../context/AuthContext";
import { Plus, FileText, Calendar, LogOut } from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => {
  const { invoices, fetchInvoices } = useShop();
  const { logout, user } = useAuth();

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      {/* Header */}
      <div className="bg-white shadow-sm px-6 py-4 sticky top-0 z-10 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-gray-900">My Invoices</h1>
          <p className="text-xs text-gray-500">Welcome, {user?.name || 'Employee'}</p>
        </div>
        <button
          onClick={logout}
          className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full transition-colors"
          title="Logout"
        >
          <LogOut size={18} />
        </button>
      </div>

      <div className="p-4 max-w-lg mx-auto">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-gray-500 font-medium uppercase tracking-wide">Recent Activity</span>
          <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
            {invoices.length} Total
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
                key={inv._id}
                className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center"
              >
                <div>
                  <p className="font-bold text-gray-800">
                    {inv.customerName || "Unknown Customer"}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                    <Calendar size={12} />
                    {new Date(inv.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-right">
                  <span className="block font-bold text-lg text-gray-900">
                    ₹{inv.totalAmount}
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
    </div>
  );
};

export default Home;
