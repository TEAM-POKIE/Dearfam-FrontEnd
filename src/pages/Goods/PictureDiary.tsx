import { SemiHeader } from "@/components/SemiHeader";
import { DiaryMain } from "./diary/DiaryMain";

export const PictureDiary = () => {
  return (
    <div className="h-[100vh] flex flex-col ">
      <SemiHeader title="그림일기 제작" exit={false} />
      <DiaryMain
        content="우리가족의 이야기를
        그림 일기로 만들 수 있어요.
        
        동심으로 돌아가 바라보는
        가족의 이야기가 궁금하지 않나요?

        1개의 게시글로
        한권의 그림일기를 만들 수 있어요!
        "
      />
    </div>
  );
};
