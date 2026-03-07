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