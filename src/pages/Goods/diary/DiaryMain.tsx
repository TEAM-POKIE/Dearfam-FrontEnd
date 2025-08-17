import LogoImage from "@/assets/image/section5/dearfam_logo_goods.svg";
import BasicButton from "@/components/BasicButton";
import BasicPopup from "@/components/BasicPopup";
import { useMemoryStore } from "@/context/store/memoryStore";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGetMemoryTimeOrder } from "@/data/api/memory-post/Memory";
import { TimeOrderMemoryPost } from "@/data/api/memory-post/type";

export const DiaryMain = ({ content }: { content: string }) => {
  const { totalPostCount, setTotalPostCount } = useMemoryStore();
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  // 게시물 데이터 가져오기
  const { data: timeOrderData } = useGetMemoryTimeOrder();

  // 게시물 데이터가 로드되면 전체 개수 저장
  useEffect(() => {
    if (timeOrderData?.data) {
      // 모든 년도의 게시물 개수 합산
      const totalCount = timeOrderData.data.reduce(
        (total: number, yearData: TimeOrderMemoryPost) => {
          return total + yearData.posts.length;
        },
        0
      );
      setTotalPostCount(totalCount);
    }
  }, [timeOrderData, setTotalPostCount]);
  const handlePostSelection = () => {
    if (totalPostCount < 6) {
      setShowPopup(true);
    } else {
      navigate("./select");
    }
  };
  return (
    <div className="flex flex-col  items-center justify-between h-full pb-[3.44rem]">
      <div className="flex flex-col items-center">
        <img
          src={LogoImage}
          alt="logo"
          className="w-[9.375rem] mt-[6.88rem] mb-[2.5rem]"
        />
        <div className=" text-center text-body2 text-gray-3 whitespace-pre-line px-[2.81rem]">
          {content}
        </div>
      </div>

      <BasicButton
        className=""
        text="게시글 선택하기"
        color="main_2_80"
        size={350}
        onClick={handlePostSelection}
      />

      {/* 게시글 부족 팝업 */}
      {showPopup && (
        <BasicPopup
          isOpen={showPopup}
          buttonText="게시글 더 쓰러 갈래요"
          onClose={() => setShowPopup(false)}
          onButtonClick={() => {
            navigate("/write");
          }}
          title="게시글 최소 6개 필요"
          content="그림 일기 굿즈를 생성하기 위해서는
          게시글이 최소 6개 필요합니다.
          게시글을 새로 작성하고
          우리 가족의 그림일기를 만들어보세요!"
        />
      )}
    </div>
  );
};
