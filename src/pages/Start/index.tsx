import dearfamLogo from "@/assets/image/dearfam_logo_icon.svg";
import { BasicButton } from "@/components/BasicButton";
import { useNavigate } from "react-router-dom";

export function StartPage() {
  const navigate = useNavigate();

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
        </div>
      </div>
    </div>
  );
}
