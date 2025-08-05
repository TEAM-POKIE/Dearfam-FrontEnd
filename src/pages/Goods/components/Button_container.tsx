import LogoImage from "../../../assets/image/section5/dearfam_logo_goods.svg";

export const ButtonContainer = ({
  title,
  content,
  onClick = () => {},
}: {
  title: string;
  content: string;
  onClick?: () => void;
}) => {
  return (
    <button
      className="w-[21.875rem] h-[5.625rem] flex justify-between items-center bg-bg-2 p-[1.25rem] rounded-[1.25rem]"
      onClick={onClick}
    >
      <div className="">
        <div className="text-start text-h5 text-gray-2">{title}</div>
        <div className="text-start text-caption1 text-gray-4 whitespace-pre-line">
          {content}
        </div>
      </div>
      <img src={LogoImage} alt="logo" />
    </button>
  );
};
