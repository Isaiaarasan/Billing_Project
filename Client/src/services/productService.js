import API from "./api";

const getProducts = async () => {
  const response = await API.get("/products");
  return response.data;
};

const createProduct = async (productData) => {
  const response = await API.post("/products", productData);
  return response.data;
};

const updateProduct = async (id, productData) => {
  const response = await API.put(`/products/${id}`, productData);
  return response.data;
};

const deleteProduct = async (id) => {
  const response = await API.delete(`/products/${id}`);
  return response.data;
};

const productService = {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};

export default productService;
