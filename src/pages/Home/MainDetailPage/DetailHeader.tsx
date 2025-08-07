import heartActive from "../../../assets/image/section2/icon_hearrt_active.svg";
import heartDefault from "../../../assets/image/section2/icon_hearrt_default.svg";
import { useQueryClient } from "@tanstack/react-query";
import defaultProfile from "../../../assets/image/style_icon_profile.svg";
import { usePutLiked } from "@/data/api/memory-post/Memory";
import { useState, useEffect } from "react";

interface FamilyMember {
  familyMemberId: number;
  familyMemberNickname: string;
  familyMemberProfileImage: string | null;
  familyMemberRole: string;
}

interface DetailHeaderProps {
  postId: number;
  liked: boolean;
  participantFamilyMember?: FamilyMember[];
}

export const DetailHeader = ({
  postId,
  liked,
  participantFamilyMember = [],
}: DetailHeaderProps) => {
  const queryClient = useQueryClient();
  const { mutate: putLiked } = usePutLiked();
  const [isLiked, setIsLiked] = useState(liked);

  // 컴포넌트 마운트 시 로깅
  useEffect(() => {
    console.log(
      `🔄 DetailHeader 마운트: postId=${postId}, 초기 liked=${liked}`
    );
    return () => {
      console.log(`🔄 DetailHeader 언마운트: postId=${postId}`);
    };
  }, [postId, liked]);

  useEffect(() => {
    console.log(
      `📝 DetailHeader props 변경: postId=${postId}, liked=${liked} -> isLiked=${isLiked}`
    );
    console.log("참여자 프로필", participantFamilyMember);
    setIsLiked(liked);
  }, [liked, postId]);

  const handleLike = () => {
    console.log(
      `❤️ 하트 클릭: postId=${postId}, 현재 isLiked=${isLiked} -> ${!isLiked}`
    );

    // 이전 상태 저장
    const previousLikedState = isLiked;

    // 낙관적 업데이트: 즉시 UI 상태 변경
    setIsLiked(!isLiked);

    // API 호출
    putLiked(postId, {
      onSuccess: (data) => {
        console.log(`✅ 좋아요 API 성공: postId=${postId}, 서버 응답:`, data);

        // 서버 응답에서 liked 상태가 있다면 그것을 사용
        if (data && typeof data.liked === "boolean") {
          console.log(`🔄 서버에서 받은 liked 상태로 업데이트: ${data.liked}`);
          setIsLiked(data.liked);
        }

        // 캐시 무효화는 여전히 수행
        queryClient.invalidateQueries({
          queryKey: ["memory-post", "detail", postId],
        });
        queryClient.invalidateQueries({
          queryKey: ["memory-post", "recent"],
        });
        queryClient.invalidateQueries({
          queryKey: ["memory-post", "time-order"],
        });

        // 강제 refetch는 서버 응답에 liked가 없을 때만 수행
        if (!data || typeof data.liked !== "boolean") {
          setTimeout(() => {
            queryClient.refetchQueries({
              queryKey: ["memory-post", "detail", postId],
            });
          }, 100);
        }
      },
      onError: (error) => {
        console.log(
          `❌ 좋아요 API 실패: postId=${postId}, 상태 롤백: ${previousLikedState}`,
          error
        );
        // 실패 시 상태 롤백
        setIsLiked(previousLikedState);
        console.error("좋아요 처리 실패 - 상태가 롤백되었습니다.");
      },
    });
  };

  return (
    <div className="px-[1.25rem] flex justify-between items-center h-[2.5rem]">
      <img
        src={isLiked ? heartActive : heartDefault}
        alt="heart"
        onClick={(e) => {
          e.stopPropagation();
          handleLike();
        }}
        className="cursor-pointer w-6 h-6"
      />
      <div className="flex items-center gap-2">
        {participantFamilyMember.map((member) => (
          <img
            key={member.familyMemberId}
            src={member.familyMemberProfileImage || defaultProfile}
            alt={member.familyMemberNickname}
            className="w-6 h-6 rounded-full"
          />
        ))}
        {participantFamilyMember.length > 0 && (
          <div className={`flex gap-[0.5rem] `}>
            {Array.from({ length: participantFamilyMember.length || 0 }).map(
              (_, index) => (
                <img
                  key={index}
                  className={`w-6 h-6 rounded-full`}
                  src={
                    participantFamilyMember[index].familyMemberProfileImage ||
                    defaultProfile
                  }
                  alt="프로필 아이콘"
                />
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};
