import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BasicButton } from "@/components/BasicButton";
import { BasicDropDown } from "@/components/ui/section1/BasicDropDown";
import { BasicPopup } from "@/components/BasicPopup";

interface LocationState {
  familyName?: string;
  fromLink?: boolean;
  fromKakao?: boolean;
}

export function MakeConfirmPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { familyName, fromLink, fromKakao } = location.state as LocationState;
  const [selectedRole, setSelectedRole] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  // 임시 테스트용 데이터 (추후 백엔드 API 연동 시 대체 예정)
  const userName = "${유저}";  // 현재 접속한 사용자 이름
  const managerName = "${방장}";  // 가족 페이지 생성한 방장 이름
  const sampleFamilyName = "${가족이름}";  // 임시 샘플 데이터

  const roleOptions = ["아빠", "엄마", "딸", "아들"];

  const getFamilyText = () => {
    if (fromLink || fromKakao) {
      return `${managerName}님이 만든 ${familyName || sampleFamilyName}에 참여합니다.\n가족 내에서 ${userName}님의 역할을 선택해주세요.`;
    }
    return `${userName}님이 ${familyName || sampleFamilyName}의 방장입니다.\n가족 내에서 ${userName}님의 역할을 선택해주세요.`;
  };

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
  };

  const handleNext = () => {
    setShowPopup(true);
  };

  const handleConfirm = () => {
    // TODO: 최종 확인 후 다음 단계로 이동하는 로직 구현
    console.log('Confirmed:', { userName, familyName: familyName || sampleFamilyName, selectedRole });
  };

  return (
    <div className="flex justify-center items-center h-app bg-bg-1 select-none">
      <div className="mobile-container flex flex-col items-center relative">
        <div className="flex flex-col w-[350px] px-[10px] mx-[20px] mt-[6.25rem]">
          <h2 className="text-h3 mb-[0.63rem]">가족 구성도</h2>
          <div>
            <p className="text-body2 text-gray-3 whitespace-pre-line">{getFamilyText()}</p>
          </div>
        </div>

        <div className="mx-[20px] mt-[5.56rem] flex flex-col gap-[1.25rem]">
          {roleOptions.map((role) => (
            <BasicDropDown
              key={role}
              options={[role]}
              value={selectedRole === role ? role : ""}
              onChange={() => handleRoleSelect(role)}
              placeholder={role}
            />
          ))}
        </div>

        {/* 다음 버튼 */}
        <div className="w-full flex justify-center mt-[8.22rem]">
          <div className="mx-[1.25rem]">
            <BasicButton
              text="역할 선택 완료"
              color={selectedRole ? "main_1" : "gray_3"}
              size={350}
              onClick={handleNext}
              disabled={!selectedRole}
              textStyle="text-h4"
            />
          </div>
        </div>

        {/* 확인 팝업 */}
        <BasicPopup
          isOpen={showPopup}
          onClose={() => setShowPopup(false)}
          title={`${familyName || sampleFamilyName}의 ${selectedRole}으로서\n가족 페이지에 참여하시겠습니까?`}
          content={`가족 안에서의 역할을\n다시 한번 확인해주세요.`}
          buttonText="선택 완료"
          onButtonClick={handleConfirm}
        />
      </div>
    </div>
  );
} 