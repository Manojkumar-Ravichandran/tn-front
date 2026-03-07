import API from "../../api/axios";

export const getContributorRequests = async () => {
    const res = await API.get("/contributors");
    return res.data.data;
};

export const approveContributorRequest = async (id) => {
    const res = await API.patch(`/contributors/${id}/approve`);
    return res.data.data;
};

// Assuming reject might be needed or implemented similarly
export const rejectContributorRequest = async (id) => {
    // If there is no specific reject endpoint yet, we might use a general update or wait for backend
    // For now, let's keep it based on what was shown
    const res = await API.delete(`/contributors/${id}`);
    return res.data.data;
};
