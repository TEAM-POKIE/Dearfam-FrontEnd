import { useState } from "react";
import { BasicButton } from "../components/BasicButton";
import { PageControl } from "../components/PageControl";
import { BasicInputBox } from "../components/ui/section1/BasicInputBox";
import { BasicDropDown } from "../components/ui/section1/BasicDropDown";

export function FirstMakePage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [familyName, setFamilyName] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [isNameValid, setIsNameValid] = useState(true);

  const roleOptions = ["아빠", "엄마", "딸", "아들"];

  const getFamilyText = () => {
    if (!familyName) return "가족 이름을 입력해주세요";
    return `${familyName}님이 ${selectedRole || '선택된 역할'}의 방장입니다.\n가족 내에서 ${familyName}님의 역할을 선택해주세요.`;
  };

  const nextStep = () => {
    if (currentStep === 1 && familyName.length > 10) {
      setIsNameValid(false);
      return;
    }
    setIsNameValid(true);
    setCurrentStep((prev) => prev + 1);
  };

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
  };

  return (
    <div className="flex justify-center items-center h-app bg-bg-1">
      <div className="mobile-container flex flex-col items-center relative">
        <div className="mt-[20px]">
          <PageControl currentStep={currentStep} totalSteps={2} />
        </div>

        {/** Step 1: 가족 이름 작성 **/}
        {currentStep === 1 && (
          <>
            <div className="flex flex-col w-[350px] px-[10px] mx-[20px] mt-[30px]">
              <h2 className="text-h3 mb-[10px]">가족 이름 작성</h2>
              <div>
                <p className="text-body2 text-gray-3">우리 가족의 이름을 작성해주세요.</p>
                <p className="text-body2 text-gray-3">ex. (유기농 패밀리)</p>
              </div>
            </div>

            <div className="mx-[20px] mt-[5.56rem]">
              <BasicInputBox
                placeholder="가족의 이름을 작성해주세요"
                value={familyName}
                onChange={(e) => setFamilyName(e.target.value)}
              />
              {!isNameValid && (
                <p className="text-red-500 mt-2">가족명은 10자 이내로 작성해주세요.</p>
              )}
            </div>
          </>
        )}

        {/** Step 2: 가족 구성도 선택 **/}
        {currentStep === 2 && (
          <>
            <div className="flex flex-col w-[350px] px-[10px] mx-[20px] mt-[1.87rem]">
              <h2 className="text-h3 mb-[0.62rem]">가족 구성도</h2>
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

          </>
        )}

        {/* 다음 버튼 */}
        <div className="absolute bottom-[3.5rem] w-full flex justify-center">
          <div className="mx-[1.25rem]">
            <BasicButton
              text="다음"
              color={currentStep === 1 ? (familyName ? "main_1" : "gray_3") : (selectedRole ? "main_1" : "gray_3")}
              size={350}
              onClick={nextStep}
              disabled={currentStep === 1 ? !familyName : !selectedRole}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
