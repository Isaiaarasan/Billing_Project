import API from "./api";

const login = async (email, password) => {
  const response = await API.post("/auth/login", { email, password });

  // Store only token in localStorage
  if (response.data.token) {
    localStorage.setItem("token", response.data.token);
  }
  return response.data;
};

const register = async (name, email, password, role) => {
  // role is optional, defaults to 'employee' on backend
  const response = await API.post("/auth/register", {
    name,
    email,
    password,
    role,
  });

  // You might auto-login or redirect to login after registration
  return response.data;
};

const logout = () => {
  localStorage.removeItem("token");
};

const authService = {
  login,
  register,
  logout,
};

export default authService;
