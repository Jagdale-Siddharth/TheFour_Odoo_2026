import axiosClient from "./axiosClient";

const driverApi = {
  list: (params) => axiosClient.get("/drivers", { params }),
  getOne: (id) => axiosClient.get(`/drivers/${id}`),
  create: (data) => axiosClient.post("/drivers", data),
  update: (id, data) => axiosClient.put(`/drivers/${id}`, data),
  remove: (id) => axiosClient.delete(`/drivers/${id}`),
};

export default driverApi;
