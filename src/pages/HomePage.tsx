import * as React from "react";
import { BasicAlert } from "../components/ui/section1/BasicAlert";
import { BasicInputBox } from "../components/ui/section1/BasicInputBox";
import { BasicDropDown } from "../components/ui/section1/BasicDropDown";
export function HomePage() {
  // 팝업 표시 여부를 관리하는 상태 추가
  const [isPopupOpen, setIsPopupOpen] = React.useState(false);

  // 팝업 열기/닫기 함수

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-main-1 mb-6 ">홈</h1>
      <div className="flex flex-col items-center justify-center gap-4">
        <BasicInputBox placeholder="text" />
        <BasicAlert message="텍스트를 입력해주세요" />
        <BasicDropDown value="value" />
      </div>
    </div>
  );
}
