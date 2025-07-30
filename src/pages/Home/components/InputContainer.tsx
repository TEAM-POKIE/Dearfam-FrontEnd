import IconSend from "../../../assets/image/section2/icon_send.svg";
import { Input } from "@/components/ui/shadcn/input";
import { usePostMemoryComment } from "@/data/api/memory-post/memory";
import { useState } from "react";

export const InputContainer = ({ postId }: { postId: number }) => {
  const { mutate: postMemoryComment, isPending } = usePostMemoryComment();
  const [comment, setComment] = useState("");

  const handleSend = () => {
    if (!comment.trim()) return; // 빈 문자열 방지
    postMemoryComment(
      { postId, content: comment.trim() },
      {
        onSuccess: () => {
          // 입력 초기화
          setComment("");
          // 쿼리 무효화는 usePostMemoryComment onSuccess 내부에서 이미 처리됨
        },
      }
    );
  };

  return (
    <div className="flex items-center bg-gray-7 py-[0.8125rem] px-[0.625rem] h-[4.125rem] gap-[0.62rem] w-full max-w-[24.375rem] m-auto">
      <Input
        className="flex-1"
        onChange={(e) => {
          setComment(e.target.value);
        }}
        value={comment}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleSend();
          }
        }}
        placeholder="댓글을 입력하세요"
        disabled={isPending}
      />

      <img
        src={IconSend}
        alt="전송"
        className={`w-[1.875rem] cursor-pointer ${
          isPending ? "opacity-50" : ""
        }`}
        onClick={handleSend}
      />
    </div>
  );
};
