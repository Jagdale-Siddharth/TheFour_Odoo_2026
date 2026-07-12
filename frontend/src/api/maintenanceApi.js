import axiosClient from "./axiosClient";

const maintenanceApi = {
  list: (params) => axiosClient.get("/maintenance", { params }),
  getOne: (id) => axiosClient.get(`/maintenance/${id}`),
  create: (data) => axiosClient.post("/maintenance", data),
  update: (id, data) => axiosClient.put(`/maintenance/${id}`, data),
  complete: (id, data) => axiosClient.put(`/maintenance/${id}/complete`, data),
  remove: (id) => axiosClient.delete(`/maintenance/${id}`),
};

export default maintenanceApi;
