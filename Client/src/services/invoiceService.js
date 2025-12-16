import API from "./api";

const createInvoice = async (invoiceData) => {
  const response = await API.post("/invoices", invoiceData);
  return response.data;
};

const getMyInvoices = async () => {
  const response = await API.get("/invoices/my");
  return response.data;
};

const invoiceService = {
  createInvoice,
  getMyInvoices,
};

export default invoiceService;
