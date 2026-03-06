import API from "../../api/axios";

export const getMyTemples = async () => {

  const res = await API.get("/temples/my-temples");

  return res.data.data.temples;

};

export const getAdminTemples = async () => {

  const res = await API.get("/temples/admin-temples");

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