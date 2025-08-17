import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, ChevronRight, Camera } from "lucide-react";
import profileIcon from "@/assets/image/style_icon_profile.svg";
import { useState, useEffect, useRef } from "react";
import BasicPopup from "@/components/BasicPopup";
import { useAuthStore } from "@/context/store/authStore";
import { useCurrentUser, useUpdateProfileImage } from "@/hooks/api/useUserAPI";
import { useFamilyMembers } from "@/hooks/api/useFamilyAPI";
import { useToastStore } from "@/context/store/toastStore";
import { useQueryClient } from "@tanstack/react-query";
import { SemiHeader } from "@/components/SemiHeader";

// ArrowLeft 및 ChevronRight는 추후 Component로 정의해야함

export function SettingPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { logout, setUser } = useAuthStore();
  const queryClient = useQueryClient();
  const { showToast } = useToastStore();
  const [isLogoutPopupOpen, setIsLogoutPopupOpen] = useState(false);
  const [isWithdrawPopupOpen, setIsWithdrawPopupOpen] = useState(false);

  // 파일 입력을 위한 ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 최신 사용자 정보 가져오기 (설정 페이지에서는 항상 최신 정보 필요)
  const { data: userData, isLoading: userLoading } = useCurrentUser(true);
  const { data: familyData, isLoading: familyLoading } = useFamilyMembers(true);

  // 프로필 이미지 업로드 훅
  const updateProfileImageMutation = useUpdateProfileImage();

  // 사용자 정보 추출
  const userNickname = userData?.data?.userNickname || "사용자";
  const userFamilyRole = userData?.data?.userFamilyRole || "";
  const familyName = familyData?.data?.familyName || "가족";

  // 프로필 이미지 URL - 기본 이미지 대체 로직
  const profileImageUrl = userData?.data?.profileImage || profileIcon;

  // 역할 한글 매핑
  const roleMapping = {
    FATHER: "아빠",
    MOTHER: "엄마",
    SON: "아들",
    DAUGHTER: "딸",
  };

  const koreanRole =
    roleMapping[userFamilyRole as keyof typeof roleMapping] || userFamilyRole;

  // URL 파라미터 확인하여 토스트 메시지 표시
  useEffect(() => {
    const message = searchParams.get("message");
    if (message === "nickname-changed") {
      showToast("닉네임 변경이 완료되었어요!", "success");

      // URL에서 파라미터 제거
      navigate("/setting", { replace: true });
    }
  }, [searchParams, navigate, showToast]);

  // 프로필 이미지 업로드 핸들러
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 파일 크기 검증 (5MB 제한)
    if (file.size > 5 * 1024 * 1024) {
      showToast("이미지 크기는 5MB 이하여야 합니다.", "error");
      return;
    }

    // 파일 타입 검증
    if (!file.type.startsWith("image/")) {
      showToast("이미지 파일만 업로드 가능합니다.", "error");
      return;
    }

    try {
      // 훅을 사용한 이미지 업로드
      const result = await updateProfileImageMutation.mutateAsync(file);

      // 사용자 정보 업데이트 (Zustand 스토어)
      if (userData?.data && result.data?.profileImageUrl) {
        const updatedUser = {
          ...userData.data,
          profileImage: result.data.profileImageUrl,
        };
        setUser(updatedUser);
      }

      // 성공 메시지 표시
      showToast("프로필 이미지가 변경되었습니다!", "success");
    } catch (error) {
      console.error("이미지 업로드 실패:", error);
      showToast("이미지 업로드에 실패했습니다. 다시 시도해주세요.", "error");
    } finally {
      // 파일 입력 초기화
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // 카메라 버튼 클릭 핸들러
  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const handleLogout = () => {
    // 로그아웃 처리 로직
    console.log("로그아웃 처리");
    // 로컬 스토리지에서 토큰 제거
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    // TanStack Query 캐시 정리
    queryClient.clear();

    // Zustand store에서 로그아웃
    logout();

    setIsLogoutPopupOpen(false);

    // 로그아웃 후 로그인 페이지로 이동 (토스트 메시지와 함께)
    navigate("/LoginPage?message=logout-success");
  };

  const handleWithdraw = () => {
    // 회원탈퇴 처리 로직
    console.log("회원탈퇴 처리");

    // 로컬 스토리지에서 토큰 제거
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    // TanStack Query 캐시 정리
    queryClient.clear();

    // Zustand store에서 로그아웃
    logout();

    setIsWithdrawPopupOpen(false);

    // 탈퇴 후 로그인 페이지로 이동
    navigate("/LoginPage");
  };

  return (
    <div className="flex flex-col  overflow-hidden">
      <SemiHeader title="설정" exit={true} onBackClick={() => navigate(-1)} />
      <div className="flex flex-col items-center overflow-hidden">
        {/* 프로필 섹션 */}
        <div className="w-full py-[1.88rem]">
          <div className="mx-5 flex items-center">
            <div className="relative">
              <div className="w-[72px] h-[72px] rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                <img
                  src={profileImageUrl}
                  alt="프로필 이미지"
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                className={`absolute bottom-0 right-0 bg-gray-500 rounded-full p-1 hover:bg-gray-600 transition-colors ${
                  updateProfileImageMutation.isPending
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer"
                }`}
                onClick={handleCameraClick}
                disabled={updateProfileImageMutation.isPending}
              >
                <Camera size={16} color="#FFFFFF" />
              </button>
            </div>
            <div className="ml-4 flex flex-col items-start">
              {userLoading || familyLoading ? (
                <p className="text-body2 font-normal">로딩 중...</p>
              ) : (
                <>
                  <p className="text-body2 font-normal">
                    '{familyName}'의 {koreanRole}
                  </p>
                  <div className="flex items-center">
                    <span className="text-h4 font-bold">{userNickname}</span>
                    <span className="text-body2 font-normal">님</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* 숨겨진 파일 입력 */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          style={{ display: "none" }}
        />

        {/* 계정 설정 섹션 */}
        <div className="w-full border-t border-[#828282] border-t-[0.0625rem]">
          <div className="px-6 py-5 text-body4 text-gray-3">계정 설정</div>

          <div className="w-full my-[0.66rem]">
            <button
              className="w-full px-6 h-[1.75rem] flex justify-between items-center"
              onClick={() => navigate("/setting/name-change")}
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
          <div className="px-6 py-5 text-body4 text-gray-3">도움</div>

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
            서비스 재이용시,
            <br />
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
