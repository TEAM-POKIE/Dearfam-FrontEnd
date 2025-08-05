import { SemiHeader } from "@/components/SemiHeader";
import { PictureToVideoMain } from "./video/PictureToVideoMain";

export const PictureToVideo = () => {
  return (
    <div className="h-[100vh] flex flex-col ">
      <SemiHeader title="사진을 동영상으로 !" exit={false} />
      <PictureToVideoMain
        content="사진을 동영상으로 만들 수 있어요. 
        가족의 추억이 담긴 사진에 
        생동감을 더해보세요! 
        변경할 사진을 선택해주세요."
      />
    </div>
  );
};
