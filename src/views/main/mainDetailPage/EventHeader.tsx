import iconImage from "../../../assets/image/style_icon_profile.svg";
import etcIcon from "../../../assets/image/section2/icon_etc.svg";
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
      <img src={etcIcon} alt="설정" />
    </div>
  );
};
