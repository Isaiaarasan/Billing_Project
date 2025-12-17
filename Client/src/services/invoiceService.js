import API from "./api";

const createInvoice = async (invoiceData) => {
  const response = await API.post("/invoices", invoiceData);
  return response.data;
};

const getMyInvoices = async () => {
  const response = await API.get("/invoices/my");
  return response.data;
};

const getAllInvoices = async () => {
  const response = await API.get("/invoices/all");
  return response.data;
};

const invoiceService = {
  createInvoice,
  getMyInvoices,
  getAllInvoices,
};

export default invoiceService;
