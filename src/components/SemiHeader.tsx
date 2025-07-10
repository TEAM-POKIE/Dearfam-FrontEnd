import { useNavigate } from "react-router-dom";
import backButtonIcon from "../assets/image/icon_backbutton_24.svg";
import exitIcon from "../assets/image/icon_exit_24.svg";

export const SemiHeader = (props: { title: string; exit: boolean }) => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleExitClick = () => {
    navigate("/");
  };

  return (
    <>
      <div className="w-full h-[3.125rem] bg-bg-1 relative flex items-center px-[0.625rem]">
        <button onClick={handleBackClick} className="z-10">
          <img src={backButtonIcon} alt="뒤로가기" />
        </button>
        <h1 className="absolute left-1/2 transform -translate-x-1/2 text-gray-2 text-h4">
          {props.title}
        </h1>
        <button onClick={handleExitClick} className="ml-auto z-10">
          {props.exit && <img src={exitIcon} alt="나가기" />}
        </button>
      </div>
    </>
  );
};
