import API from "../../api/axios";

export const getMyTemples = async () => {
  const res = await API.get("/temples/my-temples");
  return res.data.data.temples;
};

export const getAdminTemples = async (status = "pending") => {
  const res = await API.get(`/temples/admin-temples${status ? `?status=${status}` : ""}`);
  return res.data.data.temples;
};

export const createTemple = async (formData) => {
  const res = await API.post("/temples", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
  return res.data.data;
};

export const getPublicTemples = async () => {
  const res = await API.get("/temples");
  return res.data.data?.temples || [];
};

export const getTemplesByDistrict = async (districtId) => {
  const res = await API.get(`/temples${districtId ? `?district=${districtId}` : ''}`);
  return res.data.data?.temples || [];
};

export const getTemplesByDeity = async (deityId) => {
  const res = await API.get(`/temples${deityId ? `?deity=${deityId}` : ''}`);
  return res.data.data?.temples || [];
};

export const getTempleBySlug = async (slug) => {
  const res = await API.get(`/temples/${slug}`);
  // Backend returns: { success: true, data: { ...templeObject } }
  return res.data.data;
};

export const approveTemple = async (id) => {
  const res = await API.patch(`/temples/${id}/approve`);
  return res.data.data;
};

export const rejectTemple = async (id, reason) => {
  const res = await API.patch(`/temples/${id}/reject`, { reason });
  return res.data.data;
};
