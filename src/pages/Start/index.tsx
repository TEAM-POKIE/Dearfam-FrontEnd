import dearfamLogo from "@/assets/image/dearfam_logo_icon.svg";
import { BasicButton } from "@/components/BasicButton";
import { BasicToast } from "@/components/BasicToast";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

export function StartPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    // URL 파라미터에서 메시지 확인
    const message = searchParams.get('message');
    console.log('🔍 StartPage URL 파라미터 확인:', message);
    
    if (message === 'no-family') {
      console.log('✅ 가족 없음 메시지 감지, toast 표시 시작');
      setToastMessage('아직 가족이 설정되지 않은 것 같아요,\n가족을 만들어 보세요!');
      setShowToast(true);
      // 5초 후 toast 숨기기
      setTimeout(() => {
        console.log('⏰ toast 자동 숨김');
        setShowToast(false);
      }, 5000);
    }
  }, [searchParams]);

  // 디버깅용: showToast 상태 변화 감지
  useEffect(() => {
    console.log('🔍 showToast 상태 변화:', showToast);
  }, [showToast]);

  const handleClearTokens = () => {
    // 디버깅용: 로컬스토리지 토큰 삭제
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    console.log('🔧 디버깅: 토큰 삭제 완료');
    
    // 토스트 메시지 표시
    setToastMessage('토큰이 삭제되었습니다.');
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const handleTestToast = () => {
    // 디버깅용: toast 테스트
    console.log('🧪 toast 테스트 시작');
    setToastMessage('토스트 테스트 메시지입니다!');
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  return (
    <div className="flex justify-center items-center h-app bg-bg-1 select-none">
      <div className="mobile-container flex flex-col items-center relative">
        {/* 이미지와 텍스트 컨테이너 */}
        <div className="flex flex-col items-center mt-[11.25rem] mb-[5rem]">
          <img src={dearfamLogo} alt="Dearfam Logo" className="w-32 h-32" />
          <div className="flex justify-center items-center w-[350px] mt-[1.88rem]">
            <div className="text-center">
              <h2 className="text-h4">만나서 반가워요!</h2>
              <h2 className="text-h4">디어팸 서비스를 이용하세요</h2>
            </div>
          </div>
        </div>

        {/* 버튼 컨테이너 */}
        <div className="w-full flex flex-col gap-4 justify-center">
          <div className="mx-[1.25rem]">
            <BasicButton 
              text="새 가족 페이지 만들기"
              color="main_2"
              size={350}
              onClick={() => navigate('/FirstMakePage')}
              textStyle="text-h4"
            />
          </div>
          <div className="mx-[1.25rem]">
            <BasicButton 
              text="기존의 가족 페이지로 참여"
              color="main_1"
              size={350}
              onClick={() => navigate('/LinkInPage')}
              textStyle="text-h4"
            />
          </div>
          {/* 디버깅용 카카오 테스트 버튼 */}
          <div className="mx-[1.25rem]">
            <BasicButton 
              text="카카오톡 링크 입장 테스트"
              color="gray_3"
              size={350}
              onClick={() => navigate('/KakaoInPage')}
              textStyle="text-h4"
            />
          </div>
          
          {/* 디버깅용 버튼들 */}
          <div className="mx-[1.25rem] flex gap-2">
            <button 
              onClick={handleTestToast}
              className="px-4 py-2 text-body3 text-blue-500 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
            >
              Toast 테스트
            </button>
            <button 
              onClick={handleClearTokens}
              className="px-4 py-2 text-body3 text-red-500 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
            >
              토큰 삭제
            </button>
          </div>
        </div>

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
