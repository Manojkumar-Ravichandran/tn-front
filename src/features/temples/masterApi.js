import API from "../../api/axios";

/**
 * Master Data Fetchers
 * The backend returns: { success: true, data: { masters: [...], totalCount: X } }
 */

export const getDistricts = async () => {
  const res = await API.get("/masters/district");
  return res.data.data?.masters || [];
};

export const getDeities = async () => {
  const res = await API.get("/masters/deity");
  return res.data.data?.masters || [];
};

export const getFestivals = async () => {
  const res = await API.get("/masters/festival");
  return res.data.data?.masters || [];
};

/**
 * Generic Master Data API
 */
export const getMasters = async (type) => {
  const res = await API.get(`/masters/${type}`);
  return res.data.data?.masters || [];
};

export const createMaster = async (type, name) => {
  const res = await API.post("/masters", { type, name });
  return res.data;
};

export const updateMaster = async (type, id, name) => {
  const res = await API.put(`/masters/${type}/${id}`, { name });
  return res.data;
};

export const deleteMaster = async (type, id) => {
  const res = await API.delete(`/masters/${type}/${id}`);
  return res.data;
};