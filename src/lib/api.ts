import axios from "axios";

// Configure default base Axios instance
const api = axios.create({
  baseURL: "",
  headers: {
    "Content-Type": "application/json",
  },
});

export const productsApi = {
  getAll: (categoryId?: string, isFeatured?: boolean) =>
    api.get("/api/products", {
      params: {
        ...(categoryId && { categoryId }),
        ...(isFeatured !== undefined && { isFeatured }),
      },
    }).then((res) => res.data),
  getById: (id: string) => api.get(`/api/products/${id}`).then((res) => res.data),
};

export const authApi = {
  register: (data: any) => api.post("/api/register", data).then((res) => res.data),
};

export const userApi = {
  getOrders: (all?: boolean) => api.get("/api/user/orders", { params: { ...(all && { all: true }) } }).then((res) => res.data),
  getAddresses: () => api.get("/api/user/addresses").then((res) => res.data),
  updateProfile: (data: any) => api.put("/api/user/profile", data).then((res) => res.data),
  createAddress: (data: any) => api.post("/api/user/addresses", data).then((res) => res.data),
  deleteAddress: (id: string) => api.delete(`/api/user/addresses?id=${id}`).then((res) => res.data),
};

export const checkoutApi = {
  createSession: (data: any) => api.post("/api/checkout", data).then((res) => res.data),
};

export const adminApi = {
  uploadProductImage: (formData: FormData) =>
    api.post("/api/admin/products/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }).then((res) => res.data),
  getProducts: () => api.get("/api/admin/products").then((res) => res.data),
  createProduct: (data: any) => api.post("/api/admin/products", data).then((res) => res.data),
  deleteProduct: (id: string) => api.delete(`/api/admin/products/${id}`).then((res) => res.data),
  getStats: () => api.get("/api/admin/stats").then((res) => res.data),
  getOrders: () => api.get("/api/admin/orders").then((res) => res.data),
  updateOrderStatus: (id: string, status: string) =>
    api.patch(`/api/admin/orders/${id}`, { status }).then((res) => res.data),
  getCustomers: () => api.get("/api/admin/customers").then((res) => res.data),
};
