import iconImage from "../../../assets/image/style_icon_profile.svg";
import etcIcon from "../../../assets/image/section2/icon_etc.svg";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/shadcn/dropdown-menu";
import { useDeleteMemoryPost } from "@/data/api/memory-post/Memory";
import { useNavigate } from "react-router-dom";
import { useToastStore } from "@/context/store/toastStore";
import { useEffect } from "react";

interface EventHeaderProps {
  data: string;
  postId: number;
}

export const EventHeader = ({ data, postId }: EventHeaderProps) => {
  const {
    mutate: deletePost,
    isSuccess,
    isError,
    isPending,
  } = useDeleteMemoryPost();
  const { showToast } = useToastStore();
  const navigate = useNavigate();

  // 삭제 상태 관리
  useEffect(() => {
    if (isSuccess) {
      showToast("게시글이 성공적으로 삭제되었습니다.", "success");
      // 즉시 이전 페이지로 이동
      navigate(-1);
    } else if (isError) {
      showToast("게시글 삭제에 실패했습니다. 다시 시도해주세요.", "error");
    }
  }, [isSuccess, isError, navigate, showToast]);
  return (
    <div className="flex items-center justify-between w-full px-[1.25rem] py-[0.62rem] h-[3.125rem] ">
      <div className="flex items-center gap-[0.62rem] ">
        <img
          src={iconImage}
          alt="프로필"
          className="w-[1.875rem] h-[1.875rem]"
        />
        <div className="text-body1 text-gray-2">{data}</div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="inline-flex items-center justify-center p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 outline-none focus:outline-none focus-visible:outline-none focus:ring-0 touch-manipulation"
            aria-label="더보기 메뉴"
          >
            <img
              src={etcIcon}
              alt="더보기"
              className="w-[1rem] h-[1rem] pointer-events-none"
            />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="z-50 min-w-[7.25rem] "
          align="end"
          sideOffset={2}
        >
          <DropdownMenuItem
            className={`cursor-pointer ${
              isPending ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={() => !isPending && deletePost(postId)}
            disabled={isPending}
          >
            {isPending ? "삭제 중..." : "삭제하기"}
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => navigate(`/write/edit/${postId}`)}
          >
            수정하기
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
