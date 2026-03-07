import API from "../../api/axios";

export const loginUser = async (data) => {
  const res = await API.post("/auth/login", data);
  return res.data.data;
};

export const getProfile = async () => {
  const res = await API.get("/auth/me");
  return res.data.data;
};

export const setPassword = async (data) => {
  const res = await API.post("/auth/set-password", data);
  return res.data;
};