import { http, HttpResponse } from "msw";
// Mock 데이터 생성 함수들
const createMockMemoryPost = (overrides) => {
    const baseDate = new Date();
    const randomDays = Math.floor(Math.random() * 365);
    baseDate.setDate(baseDate.getDate() - randomDays);
    return {
        postId: Math.floor(Math.random() * 10000) + 1000,
        title: `추억 ${Math.floor(Math.random() * 100)}`,
        content: "가족과 함께한 소중한 추억입니다.",
        images: [
            `https://picsum.photos/300/200?random=${Math.floor(Math.random() * 1000)}`,
        ],
        commentCount: Math.floor(Math.random() * 10),
        memoryDate: baseDate.toISOString().split("T")[0],
        participants: [
            { familyMemberId: 2001, nickname: "엄마" },
            { familyMemberId: 2002, nickname: "아빠" },
            { familyMemberId: 2003, nickname: "나" },
        ],
        liked: Math.random() > 0.5,
        likeCount: Math.floor(Math.random() * 20),
        createdAt: baseDate.toISOString(),
        updatedAt: baseDate.toISOString(),
        ...overrides,
    };
};
// 추억게시글 생성 - POST /memory-post
const createMemoryPost = http.post("/api/v1/memory-post", async ({ request }) => {
    const formData = await request.formData();
    const title = formData.get("title");
    const content = formData.get("content");
    const newPost = createMockMemoryPost({ title, content });
    const response = {
        code: 201,
        message: "게시글이 성공적으로 생성되었습니다.",
        data: newPost,
    };
    return HttpResponse.json(response, { status: 201 });
});
// 최근 게시글 최근 순으로 10개 조회 - GET /memory-post/recent
const getRecentPosts = http.get("/api/v1/memory-post/recent", ({ request }) => {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const recentPosts = [
        createMockMemoryPost({
            postId: 1001,
            title: "가족 여행 추억",
            content: "오늘 가족들과 함께 여행을 다녀왔습니다. 정말 즐거운 시간이었어요!",
            memoryDate: "2025-01-15",
            liked: true,
            likeCount: 12,
            commentCount: 5,
            images: ["https://picsum.photos/300/200?random=101"],
        }),
        createMockMemoryPost({
            postId: 1002,
            title: "생일 축하 파티",
            content: "할머니 생신을 축하하며 온 가족이 모였습니다.",
            memoryDate: "2025-01-10",
            liked: false,
            likeCount: 8,
            commentCount: 3,
            images: [], // 이미지 없음
        }),
        createMockMemoryPost({
            postId: 1003,
            title: "신년 가족 모임",
            content: "새해를 맞아 온 가족이 모여 덕담을 나누었습니다.",
            memoryDate: "2025-01-01",
            liked: true,
            likeCount: 15,
            commentCount: 7,
            images: ["https://picsum.photos/300/200?random=103"],
        }),
        createMockMemoryPost({
            postId: 1004,
            title: "크리스마스 선물",
            content: "아이들을 위한 크리스마스 선물을 준비했습니다.",
            memoryDate: "2024-12-25",
            liked: false,
            likeCount: 6,
            commentCount: 2,
            images: [], // 이미지 없음
        }),
        createMockMemoryPost({
            postId: 1005,
            title: "가족 산책",
            content: "날씨가 좋아서 가족들과 공원에서 산책했습니다.",
            memoryDate: "2024-12-20",
            liked: true,
            likeCount: 9,
            commentCount: 4,
            images: ["https://picsum.photos/300/200?random=105"],
        }),
    ].slice(0, limit);
    const response = {
        code: 200,
        message: "최근 게시글 조회가 완료되었습니다.",
        data: recentPosts,
    };
    return HttpResponse.json(response);
});
// 전체 게시글 시간 순서 별 조회 - GET /memory-post/time-order
const getPostsByTimeOrder = http.get("/api/v1/memory-post/time-order", ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "20");
    const order = url.searchParams.get("order") || "desc"; // desc: 최신순, asc: 오래된순
    const allPosts = Array.from({ length: 20 }, (_, index) => {
        const baseDate = new Date();
        if (order === "desc") {
            baseDate.setDate(baseDate.getDate() - index);
        }
        else {
            baseDate.setDate(baseDate.getDate() + index);
        }
        return createMockMemoryPost({
            postId: 2000 + index,
            memoryDate: baseDate.toISOString().split("T")[0],
            createdAt: baseDate.toISOString(),
            updatedAt: baseDate.toISOString(),
        });
    });
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedPosts = allPosts.slice(startIndex, endIndex);
    const response = {
        code: 200,
        message: "게시글 목록 조회가 완료되었습니다.",
        data: {
            posts: paginatedPosts,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(allPosts.length / limit),
                totalCount: allPosts.length,
                hasNext: endIndex < allPosts.length,
                hasPrev: page > 1,
            },
        },
    };
    return HttpResponse.json(response);
});
// ID를 통한 게시글 단일 조회 - GET /memory-post/{postId}
const getMemoryPostById = http.get("/api/v1/memory-post/:postId", ({ params }) => {
    const { postId } = params;
    const post = createMockMemoryPost({ postId: parseInt(postId) });
    const response = {
        code: 200,
        message: "게시글 조회가 완료되었습니다.",
        data: post,
    };
    return HttpResponse.json(response);
});
// 게시글 참여 가족 리스트 조회 - GET /memory-post/{postid}/family-members
const getPostFamilyMembers = http.get("/api/v1/memory-post/:postId/family-members", () => {
    const familyMembers = [
        {
            familyMemberId: "fm001",
            user: {
                userId: "user001",
                nickname: "엄마",
                email: "mom@family.com",
                role: "엄마",
                createdAt: "2024-01-01T00:00:00Z",
                updatedAt: "2024-01-01T00:00:00Z",
            },
            role: "엄마",
            joinedAt: "2024-01-01T00:00:00Z",
        },
        {
            familyMemberId: "fm002",
            user: {
                userId: "user002",
                nickname: "아빠",
                email: "dad@family.com",
                role: "아빠",
                createdAt: "2024-01-01T00:00:00Z",
                updatedAt: "2024-01-01T00:00:00Z",
            },
            role: "아빠",
            joinedAt: "2024-01-01T00:00:00Z",
        },
    ];
    const response = {
        code: 200,
        message: "게시글 참여 가족 리스트 조회가 완료되었습니다.",
        data: familyMembers,
    };
    return HttpResponse.json(response);
});
// 추억게시글 수정 - PUT /memory-post/{postId}
const updateMemoryPost = http.put("/api/v1/memory-post/:postId", async ({ params, request }) => {
    const { postId } = params;
    const formData = await request.formData();
    const title = formData.get("title");
    const content = formData.get("content");
    const updatedPost = createMockMemoryPost({
        postId: parseInt(postId),
        title,
        content,
        updatedAt: new Date().toISOString(),
    });
    const response = {
        code: 200,
        message: "게시글이 성공적으로 수정되었습니다.",
        data: updatedPost,
    };
    return HttpResponse.json(response);
});
// 추억게시글 삭제 - DELETE /memory-post/{postId}
const deleteMemoryPost = http.delete("/api/v1/memory-post/:postId", ({ params }) => {
    const { postId } = params;
    const response = {
        code: 200,
        message: "게시글이 성공적으로 삭제되었습니다.",
        data: { deletedPostId: postId },
    };
    return HttpResponse.json(response);
});
export const memoryPostHandlers = [
    createMemoryPost,
    getRecentPosts,
    getPostsByTimeOrder,
    getMemoryPostById,
    getPostFamilyMembers,
    updateMemoryPost,
    deleteMemoryPost,
];
