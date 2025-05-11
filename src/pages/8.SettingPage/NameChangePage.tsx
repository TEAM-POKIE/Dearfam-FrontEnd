import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { BasicInputBox } from "../../components/ui/section1/BasicInputBox";
import BasicButton from "../../components/BasicButton";
import { BasicAlert } from "../../components/ui/section1/BasicAlert";
import BasicPopup from "../../components/BasicPopup";

export function NameChangePage() {
    const navigate = useNavigate();
    const [nickname, setNickname] = useState("");
    const [isValid, setIsValid] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [isWithdrawPopupOpen, setIsWithdrawPopupOpen] = useState(false);

    // 닉네임 변경 처리
    const handleNameChange = () => {
        if (!nickname.trim()) {
            setIsValid(false);
            setErrorMessage("닉네임을 입력해주세요.");
            return;
        }

        if (nickname.length < 2) {
            setIsValid(false);
            setErrorMessage("닉네임은 2자 이상이어야 합니다.");
            return;
        }
        
        if (nickname.length > 5) {
            setIsValid(false);
            setErrorMessage("닉네임은 5자 이내여야 합니다.");
            return;
        }
        
        // 한글, 영문, 숫자만 허용하는 정규식
        const nameRegex = /^[가-힣a-zA-Z0-9]+$/;
        if (!nameRegex.test(nickname)) {
            setIsValid(false);
            setErrorMessage("닉네임은 한글, 영문, 숫자만 사용 가능합니다.");
            return;
        }
        
        // 닉네임 변경 성공 시 팝업 표시
        setIsWithdrawPopupOpen(true);
    };

    // 닉네임 변경 완료 후 처리
    const handleChangeComplete = () => {
        setIsWithdrawPopupOpen(false);
        navigate(-1); // 이전 페이지로 돌아가기
    };

    // 닉네임 입력값 변경 핸들러
    const handleNicknameChange = (value: string) => {
        setNickname(value);
        
        if (!value.trim()) {
            setIsValid(false);
            setErrorMessage("닉네임을 입력해주세요.");
            return;
        }

        if (value.length < 2) {
            setIsValid(false);
            setErrorMessage("닉네임은 2자 이상이어야 합니다.");
            return;
        }
        
        if (value.length > 5) {
            setIsValid(false);
            setErrorMessage("닉네임은 5자 이내여야 합니다.");
            return;
        }
        
        // 한글, 영문, 숫자만 허용하는 정규식
        const nameRegex = /^[가-힣a-zA-Z0-9]+$/;
        if (!nameRegex.test(value)) {
            setIsValid(false);
            setErrorMessage("닉네임은 한글, 영문, 숫자만 사용 가능합니다.");
            return;
        }
        
        setIsValid(true);
        setErrorMessage("");
    };

    return (
        <div className="flex justify-center items-center h-app bg-bg-1">
            <div className="mobile-container flex flex-col items-center overflow-hidden relative">
                {/* 헤더 */}
                <div className="w-full flex items-center justify-center relative py-4">
                    <button 
                        className="absolute left-4" 
                        onClick={() => navigate(-1)}
                    >
                        <ArrowLeft size={24} color="#000000" />
                    </button>
                    <h1 className="text-h4 font-bold">닉네임 변경</h1>
                </div>

                {/* 입력 폼 */}
                <div className="w-full flex flex-col items-center px-6 mt-10">
                    <div className="w-full">
                        <BasicInputBox 
                            placeholder="새로운 닉네임" 
                            fullWidth
                            value={nickname}
                            onValueChange={handleNicknameChange}
                        />
                        <p className="text-body3 text-gray-3 mt-2 text-center">
                            닉네임은 <span className="text-alert">5자 이내의 한글, 영문, 숫자 조합</span>으로<br />
                            설정할 수 있습니다.
                        </p>
                        {!isValid && (
                            <div className="mt-2">
                                <BasicAlert message={errorMessage} />
                            </div>
                        )}
                    </div>
                </div>
                
                {/* 버튼 */}
                <div className="absolute bottom-[3.5rem] w-full flex justify-center">
                    <div className="mx-[1.25rem]">
                        <BasicButton 
                            text="닉네임 변경하기" 
                            color={isValid && nickname.trim() ? "main_1" : "gray_3"}
                            size={350}
                            onClick={handleNameChange}
                            disabled={!isValid || !nickname.trim()}
                            textStyle="text-h4"
                        />
                    </div>
                </div>
                
                {/* 닉네임 변경 완료 팝업 */}
                <BasicPopup
                    isOpen={isWithdrawPopupOpen}
                    onClose={() => setIsWithdrawPopupOpen(false)}
                    title="닉네임 변경 완료"
                    content={
                        <div className="text-center text-body3 text-gray-3">
                            닉네임이 성공적으로 변경되었습니다.
                        </div>
                    }
                    buttonText="확인"
                    onButtonClick={handleChangeComplete}
                />
            </div>
        </div>
    );
}
