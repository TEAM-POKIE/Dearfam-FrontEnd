import { SemiHeader } from "@/components/SemiHeader";
import { Paper } from "@/pages/Write/components/Paper";
import { AddPicture } from "./components/AddPicture";
import BasicButton from "@/components/BasicButton";

export function WritePage() {
  return (
    <div className=" bg-bg-1 pb-[1.88rem]  ">
      <SemiHeader title="게시글 작성" exit={false} />
      <Paper />
      <AddPicture />

      <div className="w-full flex justify-center items-center mt-[3rem] ">
        <BasicButton
          text="작성하기"
          size={350}
          color="bg-bg-3"
          textStyle="text_body2"
        />
      </div>
    </div>
  );
}
