import { http, HttpResponse } from "msw";
import { generateMockComment, generateMockComments, currentUser, } from "../data/mockData";
// 메모리에 댓글 저장 (실제 프로덕션에서는 데이터베이스 사용)
const commentStorage = new Map();
// 추억게시글 댓글 생성 - POST /memory-post/{postId}/comment
const createComment = http.post("/api/v1/memory-post/:postId/comment", async ({ params, request }) => {
    const { postId } = params;
    const body = (await request.json());
    const newComment = generateMockComment({
        content: body.content,
        author: currentUser,
        postId: postId,
    });
    // 기존 댓글 목록 가져오기 또는 새로 생성
    const existingComments = commentStorage.get(postId) || [];
    const updatedComments = [...existingComments, newComment];
    commentStorage.set(postId, updatedComments);
    const response = {
        success: true,
        data: newComment,
        message: "댓글이 성공적으로 생성되었습니다.",
    };
    return HttpResponse.json(response, { status: 201 });
});
// 추억게시글의 댓글 전체 조회 - GET /memory-post/{postId}/comment
const getCommentsByPostId = http.get("/api/v1/memory-post/:postId/comment", ({ params, request }) => {
    const { postId } = params;
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    // 저장된 댓글이 있으면 사용, 없으면 더미 데이터 생성
    let comments = commentStorage.get(postId);
    if (!comments) {
        comments = generateMockComments(postId, 15);
        commentStorage.set(postId, comments);
    }
    // 페이지네이션
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedComments = comments.slice(startIndex, endIndex);
    const response = {
        success: true,
        data: {
            comments: paginatedComments,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(comments.length / limit),
                totalCount: comments.length,
                hasNext: endIndex < comments.length,
                hasPrev: page > 1,
            },
        },
        message: "댓글 조회가 완료되었습니다.",
    };
    return HttpResponse.json(response);
});
// 댓글 삭제 - DELETE /memory-post/{postId}/comment/{commentId}
const deleteComment = http.delete("/api/v1/memory-post/:postId/comment/:commentId", ({ params }) => {
    const { postId, commentId } = params;
    const comments = commentStorage.get(postId);
    if (!comments) {
        const errorResponse = {
            success: false,
            message: "댓글을 찾을 수 없습니다.",
            code: "COMMENT_NOT_FOUND",
        };
        return HttpResponse.json(errorResponse, { status: 404 });
    }
    const commentIndex = comments.findIndex((comment) => comment.id === commentId);
    if (commentIndex === -1) {
        const errorResponse = {
            success: false,
            message: "댓글을 찾을 수 없습니다.",
            code: "COMMENT_NOT_FOUND",
        };
        return HttpResponse.json(errorResponse, { status: 404 });
    }
    // 댓글 삭제
    comments.splice(commentIndex, 1);
    commentStorage.set(postId, comments);
    const response = {
        success: true,
        data: { deletedCommentId: commentId },
        message: "댓글이 성공적으로 삭제되었습니다.",
    };
    return HttpResponse.json(response);
});
export const commentHandlers = [
    createComment,
    getCommentsByPostId,
    deleteComment,
];
