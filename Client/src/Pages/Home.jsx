import React, { useEffect, useState } from "react";
import { useShop } from "../context/ShopContext";
import { useAuth } from "../context/AuthContext";
import { Plus, FileText, Calendar, LogOut, ChevronLeft, Search, Filter, Download, X } from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => {
  const { invoices, fetchInvoices } = useShop();
  const { logout, user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  // Filter invoices based on search term
  const filteredInvoices = invoices.filter((inv) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      inv.customerName?.toLowerCase().includes(searchLower) ||
      inv.totalAmount?.toString().includes(searchLower) ||
      new Date(inv.createdAt).toLocaleDateString().includes(searchLower)
    );
  });

  // Download CSV Report
  const handleDownloadReport = () => {
    if (invoices.length === 0) {
      alert("No invoices to download");
      return;
    }

    // Prepare CSV data
    const headers = ["Invoice ID", "Customer Name", "Date", "Amount", "Status"];
    const rows = invoices.map((inv) => [
      inv._id,
      inv.customerName || "Unknown",
      new Date(inv.createdAt).toLocaleDateString(),
      `₹${inv.totalAmount}`,
      "Paid"
    ]);

    // Convert to CSV format
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");

    // Create blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", `invoice_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleViewDetails = (invoice) => {
    setSelectedInvoice(invoice);
  };

  const closeModal = () => {
    setSelectedInvoice(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 relative overflow-hidden">

      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-indigo-100/50 to-transparent -z-10"></div>

      {/* Header */}
      <div className="px-4 sm:px-6 py-4 glass-panel sticky top-0 z-50 border-b border-white/20 mb-6 sm:mb-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
              <ChevronLeft size={24} />
            </Link>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-slate-900">Invoice History</h1>
              <p className="text-xs text-slate-500">Manage and track all transactions</p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="flex sm:hidden items-center bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus-within:ring-2 ring-indigo-500/20 transition-all flex-1">
              <Search size={16} className="text-slate-400 mr-2" />
              <input
                placeholder="Search..."
                className="bg-transparent outline-none w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="hidden sm:flex items-center bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus-within:ring-2 ring-indigo-500/20 transition-all">
              <Search size={16} className="text-slate-400 mr-2" />
              <input
                placeholder="Search by customer or amount..."
                className="bg-transparent outline-none w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Link to="/create-invoice" className="btn-primary px-3 sm:px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 whitespace-nowrap">
              <Plus size={18} /> <span className="hidden sm:inline">New Invoice</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 max-w-7xl mx-auto">

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="glass-card p-4 sm:p-6 rounded-2xl">
            <p className="text-sm text-slate-500 font-medium mb-2">Total Invoices</p>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">{invoices.length}</h3>
          </div>
          <div className="glass-card p-4 sm:p-6 rounded-2xl">
            <p className="text-sm text-slate-500 font-medium mb-2">Revenue</p>
            <h3 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
              ₹{invoices.reduce((acc, curr) => acc + curr.totalAmount, 0).toLocaleString()}
            </h3>
          </div>
          <div className="glass-card p-4 sm:p-6 rounded-2xl flex items-center justify-between sm:col-span-2 lg:col-span-1">
            <div>
              <p className="text-sm text-slate-500 font-medium mb-2">Filtered Results</p>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">{filteredInvoices.length}</h3>
            </div>
            <div className="h-12 w-12 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600">
              <Filter size={20} />
            </div>
          </div>
        </div>

        {/* Invoice List */}
        <div className="glass-panel rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h3 className="font-bold text-base sm:text-lg text-slate-800">Recent Transactions</h3>
            <button
              onClick={handleDownloadReport}
              disabled={invoices.length === 0}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-indigo-600 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto justify-center"
            >
              <Download size={16} /> Download Report
            </button>
          </div>

          {filteredInvoices.length === 0 ? (
            <div className="text-center py-12 sm:py-20 text-slate-400 px-4">
              <FileText size={48} sm:size={64} className="mx-auto mb-4 opacity-20 text-indigo-400" />
              <h3 className="text-base sm:text-lg font-medium text-slate-600">
                {searchTerm ? "No matching invoices found" : "No invoices found"}
              </h3>
              <p className="text-sm">
                {searchTerm ? "Try a different search term" : "Create your first invoice to see it here."}
              </p>
            </div>
          ) : (
            <>
              {/* Mobile Card View */}
              <div className="block sm:hidden divide-y divide-slate-100">
                {filteredInvoices.map((inv) => (
                  <div key={inv._id} className="p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold text-slate-900">{inv.customerName || "Unknown Customer"}</p>
                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                          <Calendar size={12} />
                          {new Date(inv.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Paid
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-lg font-bold text-slate-900">₹{inv.totalAmount.toLocaleString()}</span>
                      <button
                        onClick={() => handleViewDetails(inv)}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all flex items-center gap-1 text-sm font-medium"
                      >
                        <FileText size={16} /> View
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table View */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500">
                    <tr>
                      <th className="px-6 py-4">Customer</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Amount</th>
                      <th className="px-6 py-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredInvoices.map((inv) => (
                      <tr key={inv._id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-6 py-4 font-medium text-slate-900">
                          {inv.customerName || "Unknown Customer"}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Calendar size={14} className="text-slate-400" />
                            {new Date(inv.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Paid
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right font-bold text-slate-900">
                          ₹{inv.totalAmount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => handleViewDetails(inv)}
                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                            title="View Details"
                          >
                            <FileText size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Invoice Details Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={closeModal}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 sm:p-6 border-b border-slate-200 flex justify-between items-center sticky top-0 bg-white rounded-t-2xl">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">Invoice Details</h2>
              <button onClick={closeModal} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-slate-500 uppercase mb-3">Customer Information</h3>
                <div className="bg-slate-50 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-600 text-sm">Name:</span>
                    <span className="font-semibold text-slate-900">{selectedInvoice.customerName || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 text-sm">Invoice ID:</span>
                    <span className="font-mono text-xs text-slate-700">{selectedInvoice._id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 text-sm">Date:</span>
                    <span className="text-slate-900">{new Date(selectedInvoice.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-500 uppercase mb-3">Items</h3>
                <div className="space-y-2">
                  {selectedInvoice.items && selectedInvoice.items.length > 0 ? (
                    selectedInvoice.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                        <div>
                          <p className="font-medium text-slate-900">{item.name}</p>
                          <p className="text-xs text-slate-500">{item.qty} × ₹{item.rate}</p>
                        </div>
                        <span className="font-bold text-slate-900">₹{item.total}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-500 text-sm text-center py-4">No items available</p>
                  )}
                </div>
              </div>

              <div className="border-t border-slate-200 pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-lg font-semibold text-slate-700">Total Amount:</span>
                  <span className="text-2xl font-bold text-indigo-600">₹{selectedInvoice.totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">Status:</span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Paid
                  </span>
                </div>
              </div>

              <button
                onClick={closeModal}
                className="w-full py-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
