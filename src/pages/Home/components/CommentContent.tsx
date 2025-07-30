import profileIcon from "../../../assets/image/style_icon_profile.svg";
import etcIcon from "../../../assets/image/section2/icon_etc.svg";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/shadcn/dropdown-menu";

interface CommentContentProps {
  userName: string;
  commentText: string;
  profileImage?: string;
  onOptionsClick?: () => void;
  onDelete?: () => void;
}

export function CommentContent({
  userName,
  commentText,
  profileImage,
  onDelete,
}: CommentContentProps) {
  return (
    <div className="flex items-start gap-[0.31rem] w-full">
      {/* 프로필 이미지 */}
      <div className="shrink-0">
        {profileImage ? (
          <img
            src={profileImage}
            alt={`${userName}의 프로필`}
            className="w-[1.5rem] h-[1.5rem] object-cover rounded-full"
          />
        ) : (
          <img
            src={profileIcon}
            alt="프로필 아이콘"
            className="w-[1.5rem] h-[1.5rem]"
          />
        )}
      </div>

      {/* 사용자 정보 및 댓글 */}
      <div className="flex flex-col flex-1 min-w-0">
        <div className="text-semi_h text-gray-2 leading-none mb-[0.31rem] ">
          {userName}
        </div>
        <div className="text-body4 text-gray-2 leading-none break-words">
          {commentText}
        </div>
      </div>

      {/* 더보기 아이콘 */}
      <div className="shrink-0"></div>
      <DropdownMenu>
        <div className="outline-none ring-0 focus:outline-none focus-visible:outline-none focus:ring-0">
          <DropdownMenuTrigger>
            <img
              src={etcIcon}
              alt="더보기"
              className="w-[1rem] h-[1rem] hover:outline-none focus:outline-none focus-visible:outline-none"
            />
          </DropdownMenuTrigger>
        </div>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onDelete}>삭제하기</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
