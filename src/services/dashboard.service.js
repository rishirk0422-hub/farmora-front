import api from "./api";

export const getSellerDashboard = () =>
  api.get("/dashboard/seller");

export const getBuyerDashboard = () =>
  api.get("/dashboard/buyer");