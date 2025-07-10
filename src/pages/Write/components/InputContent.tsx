import React, { useState } from "react";
import styles from "./InputContent.module.css";

export const InputContent = () => {
  const [content, setContent] = useState<string>("");

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= 500) {
      setContent(e.target.value);
    }
  };

  return (
    <div className="border-t border-main-2 p-[0.625rem] w-full h-full flex flex-col items-end">
      <textarea
        className={` placeholder:text-gray-3  text-body4 text-gray-2 w-full bg-[#F3F3F3] border-none outline-none resize-none h-full ${styles["hide-scrollbar"]}`}
        value={content}
        onChange={handleContentChange}
        placeholder="DearFam은 가족끼리 따뜻한 추억을 나누는 공간입니다. 가족 모두가 기분 좋게 사용할 수 있도록 이용규칙을 제정하여 운영하고 있습니다.

🙆🏻‍♀️️️ 이런 글을 올려주세요
• 가족과 있었던 즐거운 일상, 여행가, 대화 등 따뜻했던 순간
• 사진, 영상, 짧은 메모 등 자유로운 형식
• 사랑과 공감이 담긴 이야기

🙅🏻‍♀️ 이런 글은 삼가주세요
• 가족 간 다툼이나 비난이 담긴 내용
• 개인정보(전화번호, 주소 등) 노출
• 광고나 외부 홍보 목적의 게시물
• 혐오, 폭력 등 불쾌감을 줄 수 있는 글

부적절한 글은 사전 알림 없이 숨김 및 삭제될 수 있으며 반복된 위반 시, 사용이 제한될 수 있습니다.

DearFam은 서로의 마음을 나누는 따뜻한 공간입니다. 모두가 편안하게 추억을 공유할 수 있도록 규칙을 지켜주세요."
      />
      <div className="  text-gray-3 text-body-3 ">({content.length}/500)</div>
    </div>
  );
};
