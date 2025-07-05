import { useState } from "react";
import { BasicButton } from "../../components/BasicButton";
import { useNavigate } from "react-router-dom";
import dearfamLogo from "../../assets/image/dearfam_logo_icon.svg";

export function KakaoInPage() {
    const [isValid, setIsValid] = useState(true);
    const navigate = useNavigate();
    // 임시 테스트용 데이터 (추후 백엔드 API 연동 시 대체 예정)
    const userName = "${유저}";  // 현재 접속한 사용자 이름
    const managerName = "${방장}";  // 가족 페이지 생성한 방장 이름
    const familyName = "${가족이름}";  // 임시 샘플 데이터

    const handleJoin = () => {
        setIsValid(true);
        // TODO: 참여 코드 검증 로직 구현
        navigate('/MakeConfirmPage', { state: { fromKakao: true, familyName, managerName } });
    };

    return (
        <div className="flex justify-center items-center h-app bg-bg-1 select-none">
            <div className="mobile-container flex flex-col items-center relative">
                <div className="flex flex-col w-[350px] px-[10px] mx-[20px] mt-[6.25rem]">
                    <h2 className="text-h3 mb-[0.63rem]">{`${familyName}에 참여하시겠습니까?`}</h2>
                    <div>
                        <p className="text-body2 text-gray-3">
                            참여를 원하는 가족 페이지가 아니라면, 방장 {managerName}님에게 받은 참여 코드가 맞는지 확인해 주세요.
                        </p>
                    </div>
                </div>

                <div className="mx-[20px] mt-[7.62rem] flex justify-center">
                    <img src={dearfamLogo} alt="Dearfam Logo" className="w-[200px]" />
                </div>

                {!isValid && (
                    <p className="text-body3 text-red-500 text-center mt-2">유효하지 않은 참여 코드입니다.</p>
                )}

                {/* 참여하기 버튼 */}
                <div className="w-full flex justify-center mt-[8.22rem]">
                    <div className="mx-[1.25rem]">
                        <BasicButton
                            text="참여하기"
                            color="main_1"
                            size={350}
                            onClick={handleJoin}
                            textStyle="text-h4"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

