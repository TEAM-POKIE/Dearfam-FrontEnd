import LogoImage from "@/assets/image/section5/dearfam_logo_goods.svg";
import BasicButton from "@/components/BasicButton";

export const PictureToVideoMain = ({ content }: { content: string }) => {
  return (
    <div className="flex flex-col  items-center justify-between h-full pb-[3.44rem]">
      <div className="flex flex-col items-center">
        <img
          src={LogoImage}
          alt="logo"
          className="w-[9.375rem] mt-[6.88rem] mb-[2.5rem]"
        />
        <div className=" text-center text-body2 text-gray-3 whitespace-pre-line px-[2.81rem]">
          {content}
        </div>
      </div>

      <BasicButton
        className=""
        text="사진 업로드하기"
        color="main_2_80"
        size={350}
        onClick={() => {
          console.log("사진 선택하기");
        }}
      />
    </div>
  );
};
