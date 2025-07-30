import { CommentContent } from "../components/CommentContent";
import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";

import {
  useDeleteMemoryComment,
  useGetMemoryComment,
} from "@/data/api/memory-post/memory";
import { useEffect, useRef } from "react";

interface Comment {
  commentId?: number;
  content?: string;
  commentText?: string;
  commentWriterName?: string;
  userName?: string;
}

export function CommentContainer({ postId }: { postId: number }) {
  const queryClient = useQueryClient();
  const { data: commentData, isLoading, error } = useGetMemoryComment(postId);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { mutate: deleteComment } = useDeleteMemoryComment();
  // 댓글이 업데이트될 때마다 최하단으로 스크롤
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [commentData]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-[1.25rem] p-[1.25rem]">
        <div className="text-gray-500">댓글을 불러오는 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-[1.25rem] p-[1.25rem]">
        <div className="text-red-500">댓글을 불러오는데 실패했습니다.</div>
      </div>
    );
  }

  // 댓글 데이터가 없거나 빈 배열인 경우
  if (!commentData?.data || commentData.data.length === 0) {
    return (
      <div className="flex flex-col gap-[1.25rem] p-[1.25rem]">
        <div className="text-gray-500">아직 댓글이 없습니다.</div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="flex flex-col gap-[1.25rem] p-[1.25rem] overflow-y-auto max-h-[500px] " // ← max-height는 필요에 따라 조절
    >
      {commentData.data.map((comment: Comment, index: number) => (
        <CommentContent
          key={comment.commentId || index}
          commentText={comment.content || comment.commentText || ""}
          userName={comment.commentWriterName || comment.userName || "익명"}
          onDelete={() => {
            deleteComment({
              postId,
              commentId: comment.commentId!,
            });
            queryClient.invalidateQueries({
              queryKey: ["memory-post", "comment", postId],
            });
          }}
        />
      ))}
    </div>
  );
}
