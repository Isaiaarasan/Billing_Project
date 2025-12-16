import API from "./api";

const getEmployeeStats = async () => {
  const response = await API.get("/admin/stats");
  return response.data;
};

const getAllInvoices = async () => {
  const response = await API.get("/admin/all-invoices");
  return response.data;
};

const getAllUsers = async () => {
  const response = await API.get("/admin/users");
  return response.data;
};

const createUser = async (userData) => {
  const response = await API.post("/admin/users", userData);
  return response.data;
};

const updateUser = async (id, userData) => {
  const response = await API.put(`/admin/users/${id}`, userData);
  return response.data;
};

const deleteUser = async (id) => {
  const response = await API.delete(`/admin/users/${id}`);
  return response.data;
};

const adminService = {
  getEmployeeStats,
  getAllInvoices,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
};

export default adminService;
