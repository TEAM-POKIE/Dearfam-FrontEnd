import { InputContainer } from "./components/InputContainer";
import { CommentContainer } from "./MainDetailPage/CommentContainer";
import { DetailContent } from "./MainDetailPage/DetailContent";
import { EventHeader } from "./MainDetailPage/EventHeader";
import { SemiHeader } from "@/components/SemiHeader";
import { ImageSlider } from "./MainDetailPage/ImageSlider";
import { useParams } from "react-router-dom";
import { useGetMemoryDetail } from "@/data/api/memory-post/memory";
import { DetailHeader } from "./MainDetailPage/DetailHeader";
import { Skeleton } from "@/components/ui/shadcn/skeleton";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

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

  if (isLoading || !memoryDetail?.data) {
    console.log(`⏳ MemoryDetailPage 로딩 중: postId=${postId}`);
    return (
      <div className="min-h-screen flex flex-col w-full">
        <div className="flex-1 pb-[4.125rem] overflow-y-auto">
          <SemiHeader title="로딩중..." exit={false} />
          <Skeleton className="w-full h-[3.125rem]" />
          <Skeleton className="w-full h-[24.375rem]" />
          <Skeleton className="w-full h-[200px] mt-4 px-5" />
        </div>
      </div>
    );
  }

  console.log(
    `✅ MemoryDetailPage 렌더링 완료: postId=${postId}, liked=${memoryDetail.data.liked}`
  );

  return (
    <div className="min-h-screen flex flex-col w-full">
      <div className="flex-1 pb-[4.125rem] overflow-y-auto">
        <SemiHeader title={memoryDetail.data.title} exit={false} />
        <EventHeader
          data={memoryDetail.data.writerId}
          postId={Number(postId)}
        />
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
