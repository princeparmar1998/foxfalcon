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
  getOrderById: (id: string) => api.get(`/api/orders/${id}`).then((res) => res.data),
  getAddresses: () => api.get("/api/user/addresses").then((res) => res.data),
  updateProfile: (data: any) => api.put("/api/user/profile", data).then((res) => res.data),
  createAddress: (data: any) => api.post("/api/user/addresses", data).then((res) => res.data),
  deleteAddress: (id: string) => api.delete(`/api/user/addresses?id=${id}`).then((res) => res.data),
  getLoyalty: () => api.get("/api/user/loyalty").then((res) => res.data),
};

export const checkoutApi = {
  createSession: (data: any) => api.post("/api/checkout", data).then((res) => res.data),
};

export const reviewsApi = {
  getByProductId: (productId: string) => api.get(`/api/products/${productId}/reviews`).then((res) => res.data),
  create: (productId: string, data: { rating: number; comment: string }) => api.post(`/api/products/${productId}/reviews`, data).then((res) => res.data),
  update: (productId: string, data: { rating: number; comment: string }) => api.put(`/api/products/${productId}/reviews`, data).then((res) => res.data),
  delete: (productId: string) => api.delete(`/api/products/${productId}/reviews`).then((res) => res.data),
};

export const adminApi = {
  uploadProductImage: (formData: FormData) =>
    api.post("/api/admin/products/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }).then((res) => res.data),
  getProducts: (trash?: boolean) => api.get("/api/admin/products", { params: { ...(trash && { trash: true }) } }).then((res) => res.data),
  createProduct: (data: any) => api.post("/api/admin/products", data).then((res) => res.data),
  updateProduct: (id: string, data: any) => api.patch(`/api/admin/products/${id}`, data).then((res) => res.data),
  deleteProduct: (id: string) => api.delete(`/api/admin/products/${id}`).then((res) => res.data),
  restoreProduct: (id: string) => api.post(`/api/admin/products/${id}/restore`).then((res) => res.data),
  getStats: () => api.get("/api/admin/stats").then((res) => res.data),
  getOrders: () => api.get("/api/admin/orders").then((res) => res.data),
  updateOrderStatus: (id: string, status: string) =>
    api.patch(`/api/admin/orders/${id}`, { status }).then((res) => res.data),
  getCustomers: () => api.get("/api/admin/customers").then((res) => res.data),
  getReviews: () => api.get("/api/admin/reviews").then((res) => res.data),
  deleteReview: (id: string) => api.delete(`/api/admin/reviews?id=${id}`).then((res) => res.data),
  deleteOrders: (orderIds: string[]) =>
    api.delete("/api/admin/orders", { data: { orderIds } }).then((res) => res.data),
};

export const aiApi = {
  getSettings: () => api.get("/api/admin/ai/settings").then((res) => res.data),
  saveSettings: (settings: any) => api.post("/api/admin/ai/settings", settings).then((res) => res.data),
  getTasks: () => api.get("/api/admin/ai/tasks").then((res) => res.data),
  createTask: (instruction: string) => api.post("/api/admin/ai/tasks", { instruction }).then((res) => res.data),
  approveTask: (taskId: string) => api.post("/api/admin/ai/tasks", { action: "approve", taskId }).then((res) => res.data),
  rejectTask: (taskId: string, feedback: string) => api.post("/api/admin/ai/tasks", { action: "reject", taskId, feedback }).then((res) => res.data),
  getMemory: () => api.get("/api/admin/ai/workspace").then((res) => res.data),
  addMemory: (category: string, content: string, tags: string[]) => api.post("/api/admin/ai/workspace", { category, content, tags }).then((res) => res.data),
  generateTags: (formData: FormData) => api.post("/api/admin/ai/tags-generator", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  }).then((res) => res.data),
  getTrendingHashtags: () => api.get("/api/admin/ai/trending-hashtags").then((res) => res.data),
  saveFinalizedTags: (data: any) => api.post("/api/admin/ai/tags-generator/save", data).then((res) => res.data),
  getSavedTagHistory: () => api.get("/api/admin/ai/tags-generator/history").then((res) => res.data),
  updateFinalizedTags: (data: any) => api.put("/api/admin/ai/tags-generator", data).then((res) => res.data),
  deleteFinalizedTags: (id: string) => api.delete(`/api/admin/ai/tags-generator?id=${id}`).then((res) => res.data),
};

