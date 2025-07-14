import HeartIcon from "../../../assets/image/section2/icon_hearrt_active.svg";
import ProfileIcon from "../../../assets/image/style_icon_profile.svg";

export const DetailContentHeader = () => {
  return (
    <div className="flex justify-between px-[1.25rem] h-[2.5rem] items-center">
      <img src={HeartIcon} alt="하트" className="w-[1.5rem]" />
      <div className="flex gap-[0.62rem]">
        <img src={ProfileIcon} alt="프로필 아이콘" className="w-[1.5rem]" />
        <img src={ProfileIcon} alt="프로필 아이콘" className="w-[1.5rem]" />
        <img src={ProfileIcon} alt="프로필 아이콘" className="w-[1.5rem]" />
      </div>
    </div>
  );
};
