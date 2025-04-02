import * as React from "react";
import { BasicAlert } from "../components/ui/section1/BasicAlert";
import { BasicInputBox } from "../components/ui/section1/BasicInputBox";
import { BasicDropDown } from "../components/ui/section1/BasicDropDown";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";

export function HomePage() {
  // 팝업 표시 여부를 관리하는 상태 추가
  const [isPopupOpen, setIsPopupOpen] = React.useState(false);
  const [dropdownValue, setDropdownValue] = React.useState("");
  const navigate = useNavigate();

  // 드롭다운 옵션
  const dropdownOptions = ["옵션 1", "옵션 2", "옵션 3"];

  return (
    <div className="p-8 w-full">
      <h1 className="text-main-1 mb-6">홈</h1>
      <div className="flex flex-col items-center justify-center gap-4 w-full">
        <BasicInputBox placeholder="text" />
        <BasicAlert message="텍스트를 입력해주세요" />
        <BasicDropDown 
          value={dropdownValue} 
          onChange={setDropdownValue} 
          options={dropdownOptions} 
        />
        <Button 
          variant="default"
          className="bg-blue-500 text-white"
          onClick={() => navigate('/StartPage')}
        >
          시작 페이지로 이동
        </Button>
      </div>
    </div>
  );
}
