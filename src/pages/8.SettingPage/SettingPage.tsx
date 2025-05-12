import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronRight, Camera } from "lucide-react";
import profileIcon from "../../assets/image/style_icon_profile.svg";
import { useState } from "react";
import BasicPopup from "../../components/BasicPopup";

// ArrowLeft 및 ChevronRight는 추후 Component로 정의해야함

export function SettingPage() {
    const navigate = useNavigate();
    const [isLogoutPopupOpen, setIsLogoutPopupOpen] = useState(false);
    const [isWithdrawPopupOpen, setIsWithdrawPopupOpen] = useState(false);

    const handleLogout = () => {
        // 로그아웃 처리 로직
        console.log("로그아웃 처리");
        setIsLogoutPopupOpen(false);
        // 로그아웃 후 메인 페이지로 이동
        navigate('/');
    };

    const handleWithdraw = () => {
        // 회원탈퇴 처리 로직
        console.log("회원탈퇴 처리");
        setIsWithdrawPopupOpen(false);
        // 탈퇴 후 메인 페이지로 이동
        navigate('/');
    };

    return (
    <div className="flex justify-center items-center h-app bg-bg-1">
        <div className="mobile-container flex flex-col items-center overflow-hidden">
        {/* 헤더 */}
        <div className="w-full flex items-center justify-center relative py-4">
            <button 
                className="absolute left-4" 
                onClick={() => navigate(-1)}
            >
                <ArrowLeft size={24} color="#000000" />
            </button>
            <h1 className="text-h4 font-bold">설정</h1>
        </div>

        {/* 프로필 섹션 */}
        <div className="w-full py-6">
            <div className="mx-5 flex items-center">
                <div className="relative">
                    <div className="w-[72px] h-[72px] rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                        <img 
                            src={profileIcon} 
                            alt="프로필 이미지" 
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="absolute bottom-0 right-0 bg-gray-500 rounded-full p-1">
                        <Camera size={16} color="#FFFFFF" />
                    </div>
                </div>
                <div className="ml-4 flex flex-col items-start">
                    <p className="text-body2 font-normal">'유기농 가족'의 딸</p>
                    <div className="flex items-center">
                        <span className="text-h4 font-bold">홍동생</span>
                        <span className="text-body2 font-normal">님</span>
                    </div>
                </div>
            </div>
        </div>

        {/* 계정 설정 섹션 */}
        <div className="w-full border-t border-[#828282] border-t-[0.0625rem]">
            <div className="px-6 py-5 text-body4 text-gray-3">
                계정 설정
            </div>
            
            <div className="w-full my-[0.66rem]">
                <button 
                    className="w-full px-6 h-[1.75rem] flex justify-between items-center"
                    onClick={() => navigate('/NameChangePage')}
                >
                    <span className="text-body4 text-black">닉네임 변경</span>
                    <ChevronRight width="1.75rem" height="1.75rem" color="#828282" />
                </button>
            </div>
            
            <div className="w-full my-[0.66rem]">
                <button 
                    className="w-full px-6 h-[1.75rem] flex justify-between items-center"
                    onClick={() => setIsLogoutPopupOpen(true)}
                >
                    <span className="text-body4 text-black">로그아웃</span>
                    <ChevronRight width="1.75rem" height="1.75rem" color="#828282" />
                </button>
            </div>
            
            <div className="w-full my-[0.66rem]">
                <button 
                    className="w-full px-6 h-[1.75rem] flex justify-between items-center"
                    onClick={() => setIsWithdrawPopupOpen(true)}
                >
                    <span className="text-body4 text-black">회원탈퇴</span>
                    <ChevronRight width="1.75rem" height="1.75rem" color="#828282" />
                </button>
            </div>
        </div>

        {/* 도움 섹션 */}
        <div className="w-full border-t border-[#828282] border-t-[0.0625rem] mt-5">
            <div className="px-6 py-5 text-body4 text-gray-3">
                도움
            </div>
            
            <div className="w-full my-[0.66rem]">
                <button className="w-full px-6 h-[1.75rem] flex justify-between items-center">
                    <span className="text-body4 text-black">서비스 이용약관</span>
                    <ChevronRight width="1.75rem" height="1.75rem" color="#828282" />
                </button>
            </div>
            
            <div className="w-full my-[0.66rem]">
                <button className="w-full px-6 h-[1.75rem] flex justify-between items-center">
                    <span className="text-body4 text-black">문의하기</span>
                    <ChevronRight width="1.75rem" height="1.75rem" color="#828282" />
                </button>
            </div>
            
            <div className="w-full my-[0.66rem]">
                <button className="w-full px-6 h-[1.75rem] flex justify-between items-center">
                    <span className="text-body4 text-black">개인정보처리방침</span>
                    <ChevronRight width="1.75rem" height="1.75rem" color="#828282" />
                </button>
            </div>
        </div>
        </div>

        {/* 로그아웃 확인 팝업 */}
        <BasicPopup
            isOpen={isLogoutPopupOpen}
            onClose={() => setIsLogoutPopupOpen(false)}
            title="로그아웃 하시겠습니까?"
            content={
                <div className="text-center text-body3 text-gray-3">
                    서비스 재이용시,<br />
                    다시 로그인 해야 합니다.
                </div>
            }
            buttonText="로그아웃"
            onButtonClick={handleLogout}
        />

        {/* 회원탈퇴 확인 팝업 */}
        <BasicPopup
            isOpen={isWithdrawPopupOpen}
            onClose={() => setIsWithdrawPopupOpen(false)}
            title="탈퇴 하시겠습니까?"
            content={
                <div className="text-center text-body3 text-gray-3">
                    탈퇴 후, 계정 및 기록 복구는 불가합니다.
                </div>
            }
            buttonText="탈퇴하기"
            onButtonClick={handleWithdraw}
        />
    </div>
    );
}