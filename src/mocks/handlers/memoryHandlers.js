import { http, HttpResponse } from "msw";
export const memoryHandlers = [
    // GET /memory-post/recent
    http.get("/memory-post/recent", () => {
        const mockData = {
            code: 200,
            message: "string",
            data: [
                {
                    postId: 1001,
                    title: "가족 여행 추억",
                    content: "오늘 가족들과 함께 여행을 다녀왔습니다. 정말 즐거운 시간이었어요!",
                    commentCount: 5,
                    memoryDate: "2025-06-26",
                    participants: [
                        {
                            familyMemberId: 2001,
                            nickname: "엄마",
                        },
                        {
                            familyMemberId: 2002,
                            nickname: "아빠",
                        },
                    ],
                    liked: true,
                },
                {
                    postId: 1002,
                    title: "생일 축하 파티",
                    content: "할머니 생신을 축하하며 온 가족이 모였습니다.",
                    commentCount: 8,
                    memoryDate: "2025-06-25",
                    participants: [
                        {
                            familyMemberId: 2003,
                            nickname: "할머니",
                        },
                        {
                            familyMemberId: 2004,
                            nickname: "삼촌",
                        },
                    ],
                    liked: false,
                },
                {
                    postId: 1002,
                    title: "생일 축하 파티",
                    content: "할머니 생신을 축하하며 온 가족이 모였습니다.",
                    commentCount: 8,
                    memoryDate: "2024-06-25",
                    participants: [
                        {
                            familyMemberId: 2003,
                            nickname: "할머니",
                        },
                        {
                            familyMemberId: 2004,
                            nickname: "삼촌",
                        },
                    ],
                    liked: false,
                },
                {
                    postId: 1002,
                    title: "생일 축하 파티",
                    content: "할머니 생신을 축하하며 온 가족이 모였습니다.",
                    commentCount: 8,
                    memoryDate: "2023-06-25",
                    participants: [
                        {
                            familyMemberId: 2003,
                            nickname: "할머니",
                        },
                        {
                            familyMemberId: 2004,
                            nickname: "삼촌",
                        },
                    ],
                    liked: false,
                },
            ],
        };
        return HttpResponse.json(mockData);
    }),
];
