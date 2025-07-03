import axios from "../axiosInstance";

export type MemoryPost = {
  postId: number;
  memoryDate: string;
};

export type RecentMemoryPost = {
  postId: number;
  title: string;
  content: string;
  commentCount: number;
  memoryDate: string;
  participants: {
    familyMemberId: number;
    nickname: string;
  }[];
  liked: boolean;
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

export type GetRecentMemoryPostsResponse = {
  code: number;
  message: string;
  data: RecentMemoryPost[];
};
export const getAllMemoryPostsByTimeOrder =
  async (): Promise<GetAllMemoryPostsResponse> => {
    const res = await axios.get("/memory-post/time-order");
    return res.data;
  };

export const getRecentMemoryPosts =
  async (): Promise<GetRecentMemoryPostsResponse> => {
    const res = await axios.get("/memory-post/recent");
    return res.data;
  };
