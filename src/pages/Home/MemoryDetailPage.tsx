import { InputContainer } from "./components/InputContainer";
import { CommentContainer } from "./MainDetailPage/CommentContainer";
import { DetailContent } from "./MainDetailPage/DetailContent";
import { EventHeader } from "./MainDetailPage/EventHeader";
import { SemiHeader } from "@/components/SemiHeader";
import { ImageSlider } from "./MainDetailPage/ImageSlider";
import { useParams } from "react-router-dom";
import { useGetMemoryDetail } from "@/data/api/memory-post/memory";
import { DetailHeader } from "./MainDetailPage/DetailHeader";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { userAPI } from "@/hooks/api/useUserAPI";

export function MemoryDetailPage() {
  const { postId } = useParams();
  const queryClient = useQueryClient();

  // postId 디버깅
  console.log(`🔍 URL params:`, useParams());
  console.log(`🔍 postId 값:`, postId, typeof postId);
  console.log(`🔍 현재 URL:`, window.location.pathname);

  const { data: memoryDetail, isLoading } = useGetMemoryDetail(
    postId ? Number(postId) : null
  );

  const [userNickname, setUserNickname] = useState<string | null>(null);
  const [isUserLoading, setIsUserLoading] = useState(false);

  console.log(
    `📄 MemoryDetailPage 렌더링: postId=${postId}, isLoading=${isLoading}, liked=${memoryDetail?.data?.liked}`
  );

  // 컴포넌트 마운트 시 해당 게시물의 최신 데이터 가져오기
  useEffect(() => {
    console.log(`🔄 MemoryDetailPage 마운트: postId=${postId}`);
    if (postId) {
      queryClient.invalidateQueries({
        queryKey: ["memory-post", "detail", Number(postId)],
      });
    }
  }, [postId, queryClient]);

  // 사용자 닉네임 가져오기
  useEffect(() => {
    const fetchUserData = async () => {
      if (memoryDetail?.data?.writerId) {
        setIsUserLoading(true);
        try {
          const user = await userAPI.getUserById(
            memoryDetail.data.writerId.toString()
          );
          setUserNickname(user.data?.userNickname || "");
        } catch (error) {
          console.error("사용자 정보 가져오기 실패:", error);
          setUserNickname("사용자");
        } finally {
          setIsUserLoading(false);
        }
      }
    };
    fetchUserData();
  }, [memoryDetail?.data?.writerId]);

  // 데이터 변화 추적
  useEffect(() => {
    if (memoryDetail?.data) {
      console.log(
        `📊 MemoryDetailPage 데이터 업데이트: postId=${postId}, liked=${memoryDetail.data.liked}, title=${memoryDetail.data.title}`
      );
    }
  }, [memoryDetail, postId]);

  // postId가 없으면 에러 표시
  if (!postId) {
    return (
      <div className="min-h-screen flex flex-col w-full items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-4">잘못된 접근입니다</h2>
          <p className="text-gray-600">게시물 ID를 찾을 수 없습니다.</p>
          <p className="text-sm text-gray-400 mt-2">
            현재 URL: {window.location.pathname}
          </p>
        </div>
      </div>
    );
  }

  // 전체 로딩 상태 (게시물 데이터 + 사용자 데이터)
  const isOverallLoading =
    isLoading || isUserLoading || !memoryDetail?.data || !userNickname;

  if (isOverallLoading) {
    console.log(
      `⏳ MemoryDetailPage 로딩 중: postId=${postId}, isLoading=${isLoading}, isUserLoading=${isUserLoading}, userNickname=${userNickname}`
    );
    return (
      <div className="min-h-screen flex flex-col w-full bg-bg-1">
        <div className="flex-1 pb-[4.125rem] overflow-y-auto">
          {/* 헤더 스켈레톤 */}
          <div className="flex items-center justify-between w-full px-[1.25rem] py-[0.62rem] h-[3.125rem]">
            <div className="w-[1.875rem] h-[1.875rem] bg-gray-300 rounded animate-pulse"></div>
            <div className="w-[6.25rem] h-[1.25rem] bg-gray-300 rounded animate-pulse"></div>
            <div className="w-[1.875rem] h-[1.875rem] bg-gray-300 rounded animate-pulse"></div>
          </div>

          {/* 사용자 정보 스켈레톤 */}
          <div className="flex items-center justify-between w-full px-[1.25rem] py-[0.62rem]">
            <div className="flex items-center gap-[0.62rem]">
              <div className="w-[1.875rem] h-[1.875rem] rounded-full bg-gray-300 animate-pulse"></div>
              <div className="w-[4.375rem] h-[1.25rem] bg-gray-300 rounded animate-pulse"></div>
            </div>
            <div className="w-[1.875rem] h-[1.875rem] bg-gray-300 rounded animate-pulse"></div>
          </div>

          {/* 이미지 스켈레톤 */}
          <div className="w-full h-[24.375rem] bg-gray-300 animate-pulse"></div>

          {/* 좋아요 버튼 스켈레톤 */}
          <div className="px-[1.25rem] py-[0.62rem]">
            <div className="w-[1.875rem] h-[1.875rem] bg-gray-300 rounded animate-pulse"></div>
          </div>

          {/* 댓글 섹션 스켈레톤 */}
          <div className="border-t-[0.0625rem] border-gray-3">
            <div className="px-[1.25rem] py-[0.62rem]">
              <div className="flex items-start gap-[0.62rem]">
                <div className="w-[1.875rem] h-[1.875rem] rounded-full bg-gray-300 animate-pulse flex-shrink-0"></div>
                <div className="flex-1">
                  <div className="w-[4.375rem] h-[1rem] mb-[0.31rem] bg-gray-300 rounded animate-pulse"></div>
                  <div className="w-[6.25rem] h-[1.25rem] bg-gray-300 rounded animate-pulse"></div>
                </div>
                <div className="w-[1.875rem] h-[1.875rem] bg-gray-300 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        {/* 입력 컨테이너 스켈레톤 */}
        <div className="fixed left-0 right-0 bottom-0 w-full sm:w-[24.375rem] m-auto z-10">
          <div className="flex items-center bg-gray-7 py-[0.8125rem] px-[0.625rem] h-[4.125rem] gap-[0.62rem] w-full max-w-[24.375rem] m-auto">
            <div className="w-[1.875rem] h-[1.875rem] rounded-full bg-gray-300 animate-pulse flex-shrink-0"></div>
            <div className="flex-1 h-[2.5rem] rounded-[1.25rem] bg-gray-300 animate-pulse"></div>
            <div className="w-[1.875rem] h-[1.875rem] rounded-full bg-gray-300 animate-pulse flex-shrink-0"></div>
          </div>
        </div>
      </div>
    );
  }

  console.log(
    `✅ MemoryDetailPage 렌더링 완료: postId=${postId}, liked=${memoryDetail.data.liked}, userNickname=${userNickname}`
  );

  return (
    <div className="min-h-screen flex flex-col w-full">
      <div className="flex-1 pb-[4.125rem] overflow-y-auto">
        <SemiHeader title={memoryDetail.data.title} exit={false} />
        <EventHeader data={userNickname} postId={Number(postId)} />
        <ImageSlider data={memoryDetail.data} />
        <DetailHeader
          postId={Number(postId)}
          liked={memoryDetail.data.liked}
          participantFamilyMember={memoryDetail.data.participantFamilyMember}
        />
        <DetailContent data={memoryDetail.data.content} />
        <div className="border-t-[0.0625rem] border-gray-3">
          <CommentContainer postId={Number(postId)} />
        </div>
      </div>

      <div className="fixed left-0 right-0 bottom-0 w-full sm:w-[24.375rem] m-auto z-10">
        <InputContainer postId={Number(postId)} />
      </div>
    </div>
  );
}
