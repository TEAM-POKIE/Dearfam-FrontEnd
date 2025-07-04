import { useState } from "react";
import { BasicButton } from "../../components/BasicButton";
import { BasicInputBox } from "../../components/ui/section1/BasicInputBox";
import { useNavigate } from "react-router-dom";
import { BasicAlert } from "../../components/ui/section1/BasicAlert";
import { BasicPopup } from "../../components/BasicPopup";

export function FirstMakePage() {
  const [familyName, setFamilyName] = useState("");
  const [isNameValid, setIsNameValid] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const handleNext = () => {
    if (familyName.length > 10) {
      setIsNameValid(false);
      return;
    }
    setIsNameValid(true);
    setShowPopup(true);
  };

  const handleConfirm = () => {
    // 가족 이름을 state로 전달하면서 MakeConfirmPage로 이동
    navigate('/MakeConfirmPage', { state: { familyName } });
  };

  return (
    <div className="flex justify-center items-center h-app bg-bg-1 select-none">
      <div className="mobile-container flex flex-col items-center relative">
        <div className="flex flex-col w-[350px] px-[10px] mx-[20px] mt-[6.25rem]">
          <h2 className="text-h3 mb-[0.63rem]">가족 이름 작성</h2>
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
          <div className="h-[3.75rem] flex items-center justify-center">
            {!isNameValid && (
              <BasicAlert message="가족명은 10자 이내로 작성해주세요." />
            )}
          </div>
        </div>

        {/* 다음 버튼 */}
        <div className="w-full flex justify-center mt-[17.06rem]">
          <div className="mx-[1.25rem]">
            <BasicButton
              text="다음"
              color={familyName ? "main_1" : "gray_3"}
              size={350}
              onClick={handleNext}
              disabled={!familyName}
              textStyle="text-h4"
            />
          </div>
        </div>

        {/* 확인 팝업 */}
        <BasicPopup
          isOpen={showPopup}
          onClose={() => setShowPopup(false)}
          title="가족 생성"
          content={`${familyName}의 방장으로서\n가족 페이지를 만드시겠습니까?`}
          buttonText="만들기"
          onButtonClick={handleConfirm}
        />
      </div>
    </div>
  );
}
