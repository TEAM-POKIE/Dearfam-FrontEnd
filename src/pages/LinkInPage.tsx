import * as React from "react";
import { BasicButton } from "../components/BasicButton";
import { PageControl } from "../components/PageControl";
import { BasicInputBox } from "../components/ui/section1/BasicInputBox";
import { BasicAlert } from "../components/ui/section1/BasicAlert";
import { BasicDropDown } from "../components/ui/section1/BasicDropDown";

export function LinkInPage() {
  const [currentStep, setCurrentStep] = React.useState(1);
  const [link, setLink] = React.useState("");
  const [selectedRole, setSelectedRole] = React.useState("");
  const isValid = link.includes("링크"); // 링크가 포함된 경우에만 유효

  const roleOptions = ["아빠", "엄마", "딸", "아들"];

  const handleNext = () => {
    if (isValid) {
      setCurrentStep((prev) => prev + 1);
    }
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

        {currentStep === 1 && (
          <>
            <div className="flex flex-col w-[350px] px-[10px] mx-[20px] mt-[30px]">
              <h2 className="text-h3 mb-[10px]">링크로 가족 페이지 입장</h2>
              <div>
                <p className="text-body2 text-gray-3">방장에게 링크를 공유받아 가족 페이지에 참여해보세요</p>
              </div>
            </div>

            <div className="relative mx-[20px] mt-[5.56rem]">
              <BasicInputBox
                placeholder="링크를 작성해주세요"
                value={link}
                onChange={(e) => setLink(e.target.value)}
              />
              <div className="mt-[1.25rem]"> {/* Alert를 위한 공간 */}
                {!isValid && link && (
                  <BasicAlert message="올바르지 않은 참여 링크 입니다." />
                )}
              </div>
            </div>
          </>
        )}

        {currentStep === 2 && (
          <>
            <div className="flex flex-col w-[350px] px-[10px] mx-[20px] mt-[1.87rem]">
              <h2 className="text-h3 mb-[0.62rem]">가족 구성도</h2>
              <div>
                <p className="text-body2 text-gray-3">가족 구성원 중 본인의 역할을 선택해주세요</p>
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
            
            {/* 마지막 드롭다운과 버튼 사이 간격 */}
            <div className="h-[7.75rem]"></div>
          </>
        )}

        {/* 버튼 */}
        <div className="absolute bottom-[3.5rem] w-full flex justify-center">
          <div className="mx-[1.25rem]">
            <BasicButton
              text="입장하기"
              color={currentStep === 1 ? (isValid ? "main_1" : "gray_3") : (selectedRole ? "main_1" : "gray_3")}
              size={350}
              onClick={currentStep === 1 ? handleNext : () => {}}
              disabled={currentStep === 1 ? !isValid : !selectedRole}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
