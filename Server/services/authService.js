import API from "./api";

const login = async (email, password) => {
  const response = await API.post("/auth/login", { email, password });

  // Store user data (including token) in localStorage upon successful login
  if (response.data.token) {
    localStorage.setItem("user", JSON.stringify(response.data));
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
  localStorage.removeItem("user");
};

const authService = {
  login,
  register,
  logout,
};

export default authService;
