import iconImage from "../../../assets/image/style_icon_profile.svg";
import etcIcon from "../../../assets/image/section2/icon_etc.svg";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/shadcn/dropdown-menu";
export const EventHeader = () => {
  return (
    <div className="flex items-center justify-between px-[1.25rem] h-[3.125rem] ">
      <div className="flex items-center gap-[0.62rem] ">
        <img
          src={iconImage}
          alt="프로필"
          className="w-[1.875rem] h-[1.875rem]"
        />
        <div>EventWriter</div>
      </div>
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
        <DropdownMenuContent>
          <DropdownMenuItem>삭제하기</DropdownMenuItem>
          <DropdownMenuItem>수정하기</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
