import { useState } from "react";
import { BasicButton } from "../../components/BasicButton";
import { BasicInputBox } from "../../components/ui/section1/BasicInputBox";
import { useNavigate } from "react-router-dom";
import { BasicAlert } from "../../components/ui/section1/BasicAlert";
import { BasicPopup } from "../../components/BasicPopup";
import { BasicToast } from "../../components/BasicToast";
import { useCreateFamily } from "../../hooks/api/useFamilyAPI";
import { AxiosError } from "axios";

export function FirstMakePage() {
  const [familyName, setFamilyName] = useState("");
  const [isNameValid, setIsNameValid] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [nameConflictError, setNameConflictError] = useState("");
  const navigate = useNavigate();

  const createFamilyMutation = useCreateFamily();

  const handleNext = () => {
    if (familyName.length > 10) {
      setIsNameValid(false);
      return;
    }
    setIsNameValid(true);
    setNameConflictError(""); // 기존 에러 메시지 초기화
    setShowPopup(true);
  };

  const handleConfirm = async () => {
    try {
      console.log('🔍 가족 생성 시작:', familyName);
      
      const result = await createFamilyMutation.mutateAsync({ familyName: familyName });
      
      console.log('✅ 가족 생성 성공:', result);
      
      // 성공 시 역할 선택 페이지로 이동
      navigate('/MakeConfirmPage', { state: { familyName } });
      
    } catch (error) {
      console.error('❌ 가족 생성 실패:', error);
      
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        
        switch (status) {
          case 400:
            // 잘못된 요청 - 토스트 메시지
            setToastMessage('잘못된 요청입니다.\n입력 정보를 확인해주세요.');
            setShowToast(true);
            setTimeout(() => {
              setShowToast(false);
            }, 5000);
            setShowPopup(false);
            break;
          case 409:
            // 가족 이름 중복 - 빨간 글씨로 표시
            setNameConflictError('이미 존재하는 가족 이름입니다. 다른 이름을 사용해주세요.');
            setShowPopup(false);
            break;
          case 404:
            // 사용자 없음 - LoginPage로 리다이렉트
            console.log('   → 사용자 정보 없음 - 로그인 페이지로 이동');
            navigate('/LoginPage?error=user-not-found', { replace: true });
            break;
          case 500:
            // 서버 오류 - 토스트 메시지
            setToastMessage('서버 오류가 발생했습니다.\n잠시 후 다시 시도해주세요.');
            setShowToast(true);
            setTimeout(() => {
              setShowToast(false);
            }, 5000);
            setShowPopup(false);
            break;
          default:
            // 기타 에러 - 토스트 메시지
            setToastMessage('가족 생성에 실패했습니다.\n다시 시도해주세요.');
            setShowToast(true);
            setTimeout(() => {
              setShowToast(false);
            }, 5000);
            setShowPopup(false);
        }
      } else {
        // 기타 에러 - 토스트 메시지
        setToastMessage('가족 생성에 실패했습니다.\n다시 시도해주세요.');
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
        }, 5000);
        setShowPopup(false);
      }
    }
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
            onChange={(e) => {
              setFamilyName(e.target.value);
              // 입력 시 에러 메시지 초기화
              if (nameConflictError) {
                setNameConflictError("");
              }
            }}
          />
          <div className="h-[3.75rem] flex items-center justify-center">
            {!isNameValid && (
              <BasicAlert message="가족명은 10자 이내로 작성해주세요." />
            )}
            {nameConflictError && (
              <BasicAlert message={nameConflictError} />
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
              disabled={!familyName || createFamilyMutation.isPending}
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
          buttonText={createFamilyMutation.isPending ? "생성 중..." : "만들기"}
          onButtonClick={handleConfirm}
          disabled={createFamilyMutation.isPending}
        />

        {/* 토스트 메시지 */}
        {showToast && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
            <BasicToast message={toastMessage} />
          </div>
        )}
      </div>
    </div>
  );
}
