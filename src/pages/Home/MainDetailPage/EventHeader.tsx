import iconImage from "../../../assets/image/style_icon_profile.svg";
import etcIcon from "../../../assets/image/section2/icon_etc.svg";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/shadcn/dropdown-menu";
import { useDeleteMemoryPost } from "@/data/api/memory-post/memory";

interface EventHeaderProps {
  data: number;
  postId: number;
}

export const EventHeader = ({ data, postId }: EventHeaderProps) => {
  const { mutate: deletePost } = useDeleteMemoryPost();
  return (
    <div className="flex items-center justify-between w-full px-[1.25rem] py-[0.62rem] h-[3.125rem] ">
      <div className="flex items-center gap-[0.62rem] ">
        <img
          src={iconImage}
          alt="프로필"
          className="w-[1.875rem] h-[1.875rem]"
        />
        <div>{data}</div>
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
            className="cursor-pointer"
            onClick={() => deletePost(postId)}
          >
            삭제하기
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            수정하기
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
