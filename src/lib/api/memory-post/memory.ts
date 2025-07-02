import axios from '../axiosInstance';

export type MemoryPost = {
  postId: number;
  memoryDate: string;
};

export type MemoryGroupByYear = {
  year: number;
  posts: MemoryPost[];
};

export type GetAllMemoryPostsResponse = {
  code: number;
  message: string;
  data: MemoryGroupByYear[];
};
export const getAllMemoryPostsByTimeOrder = async (): Promise<GetAllMemoryPostsResponse> => {
  const res = await axios.get('/memory-post/time-order');
  return res.data;
};