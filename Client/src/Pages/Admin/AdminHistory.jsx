import React, { useState, useEffect } from "react";
import { useShop } from "../../context/ShopContext";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, Search, Printer, Download, FileText, Calendar, DollarSign, User } from "lucide-react";
import { printInvoice } from "../../utils/printInvoice";

const AdminHistory = () => {
    const navigate = useNavigate();
    const { fetchAllInvoices } = useShop();
    const [allInvoices, setAllInvoices] = useState([]);
    const [filteredInvoices, setFilteredInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        const data = await fetchAllInvoices();
        if (data) {
            setAllInvoices(data);
            setFilteredInvoices(data);
        }
        setLoading(false);
    };

    // Handle Search
    useEffect(() => {
        if (!searchTerm) {
            setFilteredInvoices(allInvoices);
        } else {
            const lowerSearch = searchTerm.toLowerCase();
            const filtered = allInvoices.filter(inv =>
                inv.customerName?.toLowerCase().includes(lowerSearch) ||
                inv._id?.toLowerCase().includes(lowerSearch) ||
                inv.customerMobile?.includes(searchTerm)
            );
            setFilteredInvoices(filtered);
        }
    }, [searchTerm, allInvoices]);

    return (
        <div className="min-h-screen bg-slate-100/50">
            {/* Header */}
            <div className="bg-white px-6 py-4 shadow-md border-b border-slate-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link
                            to="/admin/dashboard"
                            className="p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors"
                        >
                            <ChevronLeft size={24} />
                        </Link>
                        <h1 className="font-bold text-xl text-slate-900 flex items-center gap-2">
                            <FileText size={24} className="text-purple-600" />
                            Detailed Sales History
                        </h1>
                    </div>
                </div>
            </div>

            <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">

                {/* Search Bar */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by Customer Name, ID, or Mobile..."
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="text-sm text-slate-500 font-medium bg-slate-100 px-4 py-2 rounded-lg">
                        Total Records: <span className="text-slate-900 font-bold">{filteredInvoices.length}</span>
                    </div>
                </div>

                {/* Invoices List */}
                <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 overflow-hidden">
                    {loading ? (
                        <div className="p-12 text-center text-slate-500">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
                            <p>Loading sales history...</p>
                        </div>
                    ) : filteredInvoices.length === 0 ? (
                        <div className="p-16 text-center text-slate-400">
                            <FileText size={48} className="mx-auto mb-4 opacity-20" />
                            <p className="text-lg font-medium">No sales records found.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/80 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                        <th className="p-5">Invoice Details</th>
                                        <th className="p-5">Customer</th>
                                        <th className="p-5 text-center">Items</th>
                                        <th className="p-5 text-center">Total</th>
                                        <th className="p-5 text-center">Date</th>
                                        <th className="p-5 text-center">Billed By</th>
                                        <th className="p-5 text-right">Download</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredInvoices.map((invoice) => (
                                        <tr key={invoice._id} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="p-5">
                                                <p className="font-bold text-slate-900 text-sm font-mono" title={invoice._id}>
                                                    #{invoice._id.slice(-6).toUpperCase()}
                                                </p>
                                                <span className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${invoice.paymentMode === 'Cash' ? 'bg-green-100 text-green-700' :
                                                        invoice.paymentMode === 'Card' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                                                    }`}>
                                                    {invoice.paymentMode || 'Cash'}
                                                </span>
                                            </td>
                                            <td className="p-5">
                                                <div className="flex items-center gap-2">
                                                    <User size={16} className="text-slate-400" />
                                                    <div>
                                                        <p className="font-bold text-slate-800 text-sm">{invoice.customerName}</p>
                                                        <p className="text-xs text-slate-500">{invoice.customerMobile || 'N/A'}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-5 text-center">
                                                <span className="bg-slate-100 text-slate-600 py-1 px-3 rounded-full text-xs font-bold">
                                                    {invoice.items.length}
                                                </span>
                                            </td>
                                            <td className="p-5 text-center font-bold text-slate-900">
                                                ₹{invoice.totalAmount.toLocaleString()}
                                            </td>
                                            <td className="p-5 text-center text-sm text-slate-500">
                                                <div className="flex flex-col items-center">
                                                    <span className="font-medium text-slate-700">{new Date(invoice.createdAt).toLocaleDateString()}</span>
                                                    <span className="text-xs">{new Date(invoice.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                </div>
                                            </td>
                                            <td className="p-5 text-center">
                                                <span className="text-xs font-medium text-slate-500 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                                                    {invoice.createdBy?.name || "System"}
                                                </span>
                                            </td>
                                            <td className="p-5 text-right">
                                                <button
                                                    onClick={() => printInvoice(invoice)}
                                                    className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors border border-transparent hover:border-indigo-100"
                                                    title="Download/Print Invoice"
                                                >
                                                    <Download size={20} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminHistory;
