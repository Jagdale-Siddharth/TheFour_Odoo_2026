import axiosClient from "./axiosClient";

const vehicleApi = {
  list: (params) => axiosClient.get("/vehicles", { params }),
  getOne: (id) => axiosClient.get(`/vehicles/${id}`),
  create: (data) => axiosClient.post("/vehicles", data),
  update: (id, data) => axiosClient.put(`/vehicles/${id}`, data),
  retire: (id) => axiosClient.put(`/vehicles/${id}/retire`),
  remove: (id) => axiosClient.delete(`/vehicles/${id}`),
};

export default vehicleApi;
