import axios from "../axiosInstance";
export const getAllMemoryPostsByTimeOrder = async () => {
    const res = await axios.get("/memory-post/time-order");
    return res.data;
};
export const getRecentMemoryPosts = async () => {
    const res = await axios.get("/memory-post/recent");
    return res.data;
};
