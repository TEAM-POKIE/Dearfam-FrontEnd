import * as React from "react";
import { BasicButton } from "../../components/BasicButton";
import { BasicInputBox } from "../../components/ui/section1/BasicInputBox";
import { BasicAlert } from "../../components/ui/section1/BasicAlert";
import { BasicPopup } from "../../components/BasicPopup";
import { useNavigate } from "react-router-dom";

export function LinkInPage() {
  const [link, setLink] = React.useState("");
  const [showPopup, setShowPopup] = React.useState(false);
  const navigate = useNavigate();
  const isValid = link.includes("링크"); // 임시로 "링크" 텍스트 포함 여부로만 판단 중

  // 임시 테스트용 데이터 (추후 백엔드 API 연동 시 대체 예정)
  const userName = "${유저}"; // 현재 접속한 사용자 이름
  const managerName = "${방장}"; // 가족 페이지 생성한 방장 이름
  const familyName = "${가족이름}"; // 임시 샘플 데이터

  const handleNext = () => {
    if (isValid) {
      setShowPopup(true);
    }
  };

  const handleJoin = () => {
    navigate("/MakeConfirmPage", {
      state: { fromLink: true, familyName: familyName, managerName },
    });
  };

  return (
    <div className="flex justify-center items-center h-app bg-bg-1 select-none">
      <div className="mobile-container flex flex-col items-center relative">
        <div className="flex flex-col w-[350px] px-[10px] mx-[20px] mt-[6.25rem]">
          <h2 className="text-h3 mb-[0.63rem]">링크로 가족 페이지 입장</h2>
          <div>
            <p className="text-body2 text-gray-3">방장에게 링크를 공유받아,</p>
            <p className="text-body2 text-gray-3">가족 페이지에 입장해보세요</p>
          </div>
        </div>

        <div className="mx-[20px] mt-[5.56rem]">
          <BasicInputBox
            placeholder="링크를 작성해주세요"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
          <div className="h-[3.75rem] flex items-center justify-center">
            {!isValid && link && (
              <BasicAlert message="올바르지 않은 참여 링크 입니다." />
            )}
          </div>
        </div>

        {/* 버튼 */}
        <div className="w-full flex justify-center mt-[17.06rem]">
          <div className="mx-[1.25rem]">
            <BasicButton
              text="입장하기"
              color={isValid ? "main_1" : "gray_3"}
              size={350}
              onClick={handleNext}
              disabled={!isValid}
              textStyle="text-h4"
            />
          </div>
        </div>

        {/* 확인 팝업 */}
        <BasicPopup
          isOpen={showPopup}
          onClose={() => setShowPopup(false)}
          title={`${managerName}님의\n${familyName}에 입장하시겠습니까?`}
          content={`참여를 원하는 가족 페이지인지\n다시 한번 확인해주세요.`}
          buttonText="입장하기"
          onButtonClick={handleJoin}
        />
      </div>
    </div>
  );
}
