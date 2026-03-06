import API from "../../api/axios";

export const getDistricts = async () => {
  const res = await API.get("/masters/districts");
  return res.data.data;
};

export const getDeities = async () => {
  const res = await API.get("/masters/deities");
  return res.data.data;
};

export const getFestivals = async () => {
  const res = await API.get("/masters/festivals");
  return res.data.data;
};