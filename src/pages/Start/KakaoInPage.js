import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { BasicButton } from "../../components/BasicButton";
import { useNavigate } from "react-router-dom";
import dearfamLogo from "../../assets/image/dearfam_logo_icon.svg";
export function KakaoInPage() {
    const [isValid, setIsValid] = useState(true);
    const navigate = useNavigate();
    // 임시 테스트용 데이터 (추후 백엔드 API 연동 시 대체 예정)
    const userName = "${유저}"; // 현재 접속한 사용자 이름
    const managerName = "${방장}"; // 가족 페이지 생성한 방장 이름
    const familyName = "${가족이름}"; // 임시 샘플 데이터
    const handleJoin = () => {
        setIsValid(true);
        // TODO: 참여 코드 검증 로직 구현
        navigate('/MakeConfirmPage', { state: { fromKakao: true, familyName, managerName } });
    };
    return (_jsx("div", { className: "flex justify-center items-center h-app bg-bg-1 select-none", children: _jsxs("div", { className: "mobile-container flex flex-col items-center relative", children: [_jsxs("div", { className: "flex flex-col w-[350px] px-[10px] mx-[20px] mt-[6.25rem]", children: [_jsx("h2", { className: "text-h3 mb-[0.63rem]", children: `${familyName}에 참여하시겠습니까?` }), _jsx("div", { children: _jsxs("p", { className: "text-body2 text-gray-3", children: ["\uCC38\uC5EC\uB97C \uC6D0\uD558\uB294 \uAC00\uC871 \uD398\uC774\uC9C0\uAC00 \uC544\uB2C8\uB77C\uBA74, \uBC29\uC7A5 ", managerName, "\uB2D8\uC5D0\uAC8C \uBC1B\uC740 \uCC38\uC5EC \uCF54\uB4DC\uAC00 \uB9DE\uB294\uC9C0 \uD655\uC778\uD574 \uC8FC\uC138\uC694."] }) })] }), _jsx("div", { className: "mx-[20px] mt-[7.62rem] flex justify-center", children: _jsx("img", { src: dearfamLogo, alt: "Dearfam Logo", className: "w-[200px]" }) }), !isValid && (_jsx("p", { className: "text-body3 text-red-500 text-center mt-2", children: "\uC720\uD6A8\uD558\uC9C0 \uC54A\uC740 \uCC38\uC5EC \uCF54\uB4DC\uC785\uB2C8\uB2E4." })), _jsx("div", { className: "w-full flex justify-center mt-[8.22rem]", children: _jsx("div", { className: "mx-[1.25rem]", children: _jsx(BasicButton, { text: "\uCC38\uC5EC\uD558\uAE30", color: "main_1", size: 350, onClick: handleJoin, textStyle: "text-h4" }) }) })] }) }));
}
