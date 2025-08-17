import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BasicButton } from "@/components/BasicButton";
import { BasicDropDown } from "@/components/ui/section1/BasicDropDown";
import { BasicPopup } from "@/components/BasicPopup";
import { useSetFamilyRole } from "@/hooks/api/useFamilyAPI";
import { useCurrentUser } from "@/hooks/api/useUserAPI";
import { useToastStore } from "@/context/store/toastStore";
import { AxiosError } from "axios";

interface LocationState {
  familyName?: string;
  fromLink?: boolean;
  fromKakao?: boolean;
}

export function MakeConfirmPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { familyName, fromLink, fromKakao } = location.state as LocationState;
  const [selectedRole, setSelectedRole] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const { showToast } = useToastStore();

  const setFamilyRoleMutation = useSetFamilyRole();

  // TanStack Query에서 사용자 정보 가져오기
  const { data: userData } = useCurrentUser();
  const userNickname = userData?.data?.userNickname || "사용자";

  // 역할 매핑
  const roleMapping = {
    아빠: "FATHER",
    엄마: "MOTHER",
    아들: "SON",
    딸: "DAUGHTER",
  };

  // 임시 테스트용 데이터 (추후 백엔드 API 연동 시 대체 예정)
  const userName = userNickname; // TanStack Query 캐시에서 가져온 사용자 닉네임
  const managerName = userNickname; // 가족 페이지 생성한 방장 이름 (현재 사용자)
  const sampleFamilyName = "${가족이름}"; // 임시 샘플 데이터

  const roleOptions = ["아빠", "엄마", "딸", "아들"];

  const getFamilyText = () => {
    if (fromLink || fromKakao) {
      return `${managerName}님이 만든 ${
        familyName || sampleFamilyName
      }에 참여합니다.\n가족 내에서 ${userName}님의 역할을 선택해주세요.`;
    }
    return `${userName}님이 ${
      familyName || sampleFamilyName
    }의 방장입니다.\n가족 내에서 ${userName}님의 역할을 선택해주세요.`;
  };

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
  };

  const handleNext = () => {
    setShowPopup(true);
  };

  const handleConfirm = async () => {
    try {
      const familyRole = roleMapping[selectedRole as keyof typeof roleMapping];

      const result = await setFamilyRoleMutation.mutateAsync({
        familyRole: familyRole,
      });

      // 성공 시 홈 페이지로 이동
      navigate("/home", { replace: true });
    } catch (error) {
      console.error("❌ 가족 역할 설정 실패:", error);

      if (error instanceof AxiosError) {
        const status = error.response?.status;

        switch (status) {
          case 400:
            // 잘못된 요청 - 토스트 메시지
            showToast("잘못된 요청입니다.\n입력 정보를 확인해주세요.", "error");
            setShowPopup(false);
            break;
          case 404:
            // 사용자 없음 - LoginPage로 리다이렉트
            console.log("   → 사용자 정보 없음 - 로그인 페이지로 이동");
            navigate("/LoginPage?error=user-not-found", { replace: true });
            break;
          case 500:
            // 서버 오류 - 토스트 메시지
            showToast(
              "서버 오류가 발생했습니다.\n잠시 후 다시 시도해주세요.",
              "error"
            );
            setShowPopup(false);
            break;
          default:
            // 기타 에러 - 토스트 메시지
            showToast("역할 설정에 실패했습니다.\n다시 시도해주세요.", "error");
            setShowPopup(false);
        }
      } else {
        // 기타 에러 - 토스트 메시지
        showToast("역할 설정에 실패했습니다.\n다시 시도해주세요.", "error");
        setShowPopup(false);
      }
    }
  };

  return (
    <div className="mobile-container flex flex-col align-middle m-auto">
      <div className="flex flex-col min-h-screen px-[1.25rem] relative">
        <div className="flex flex-col mt-[6.25rem] w-full">
          <h2 className="text-h3 mb-[0.63rem]">가족 구성도</h2>
          <div>
            <p className="text-body2 text-gray-3 whitespace-pre-line">
              {getFamilyText()}
            </p>
          </div>
        </div>

        <div className="w-full mt-[5.56rem] flex flex-col gap-[1.25rem]">
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

        {/* 다음 버튼 */}
        <div className="w-full flex  absolute bottom-[5.63rem]">
          <BasicButton
            text="역할 선택 완료"
            color={selectedRole ? "main_1" : "bg_bg_3"}
            size={350}
            onClick={handleNext}
            disabled={!selectedRole || setFamilyRoleMutation.isPending}
            textStyle="text-h4"
          />
        </div>

        {/* 확인 팝업 */}
        <BasicPopup
          isOpen={showPopup}
          onClose={() => setShowPopup(false)}
          title={`${
            familyName || sampleFamilyName
          }의 ${selectedRole}으로서\n가족 페이지에 참여하시겠습니까?`}
          content={`가족 안에서의 역할을\n다시 한번 확인해주세요.`}
          buttonText={
            setFamilyRoleMutation.isPending ? "설정 중..." : "참여하기"
          }
          onButtonClick={handleConfirm}
          disabled={setFamilyRoleMutation.isPending}
        />
      </div>
    </div>
  );
}
