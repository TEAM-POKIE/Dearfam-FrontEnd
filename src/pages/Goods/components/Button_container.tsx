import LogoImage from "../../../assets/image/section5/dearfam_logo_goods.svg";

export const ButtonContainer = ({
  title,
  content,
}: {
  title: string;
  content: string;
}) => {
  return (
    <div className="w-[21.875rem] h-[5.625rem] flex justify-between items-center bg-bg-2 p-[1.25rem] rounded-[1.25rem] ">
      <div className="">
        <div className="text-h5 text-gray-2">{title}</div>
        <div className="text-caption1 text-gray-4 whitespace-pre-line">
          {content}
        </div>
      </div>
      <img src={LogoImage} alt="logo" />
    </div>
  );
};
