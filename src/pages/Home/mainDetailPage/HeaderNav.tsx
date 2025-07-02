import backButton from "../../../assets/image/backbutton.svg";
import { useNavigate } from "react-router-dom";
export const HeaderNav = () => {
  const navigate = useNavigate();
  const backClick = () => {
    navigate("/");
  };
  return (
    <div className="h-[3.125rem] relative flex items-center py-[0.81rem] pl-[0.625rem]">
      <img
        src={backButton}
        alt="뒤로가기"
        onClick={backClick}
        className="w-[1.5rem]"
      />
      <div className="absolute left-1/2 transform -translate-x-1/2 text-h4 text-gray-2">
        eventTitle
      </div>
    </div>
  );
};
