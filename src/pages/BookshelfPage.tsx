import React from "react";

// 책장 아이템 타입 정의
type BookshelfItemType =
  | "book"
  | "photo"
  | "video"
  | "calendar"
  | "note"
  | "collection";

interface BookshelfItem {
  id: string;
  type: BookshelfItemType;
  title?: string;
  imageUrl?: string;
  content?: string;
  date?: string;
}

export function BookshelfPage() {
  // 샘플 데이터
  const bookshelfItems: BookshelfItem[] = [
    {
      id: "1",
      type: "book",
      title: "Angel & Baby",
      imageUrl: "/images/book-cover.svg",
    },
    {
      id: "2",
      type: "photo",
      title: "가족 사진",
      imageUrl: "/images/photo-frames.svg",
    },
    {
      id: "3",
      type: "video",
      title: "첫 생일 영상",
      imageUrl: "/images/video-thumbnail.svg",
    },
    {
      id: "4",
      type: "calendar",
      title: "가족 일정",
      imageUrl: "/images/calendar.svg",
    },
    {
      id: "5",
      type: "note",
      title: "은수의 그림 일기",
      content:
        "2020년 11월 27일 토요일\n날씨: 눈 오다\n\n겨울이네! 마지막 목도리를 둘렀더니 눈이 보였다! 좋겠다. 겨울이 나는 좋다.",
      date: "2020.11.27",
      imageUrl: "/images/note.svg",
    },
    {
      id: "6",
      type: "collection",
      title: "추억 모음",
      imageUrl: "/images/collection.svg",
    },
  ];

  // 아이템 렌더링 함수
  const renderBookshelfItem = (item: BookshelfItem) => {
    switch (item.type) {
      case "book":
        return (
          <div className="bg-[#F5F2EA] rounded-lg p-4 flex justify-center items-center h-full">
            <div className="w-28 h-40 mx-auto">
              <img
                src={item.imageUrl || "/images/default-book.png"}
                alt={item.title}
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        );

      case "photo":
        return (
          <div className="bg-[#F5F2EA] rounded-lg p-4 flex justify-center items-center h-full">
            <div className="relative w-full h-full">
              <img
                src={item.imageUrl || "/images/default-photo.png"}
                alt={item.title}
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        );

      case "video":
        return (
          <div className="bg-[#F5F2EA] rounded-lg p-4 flex justify-center items-center h-full">
            <div className="relative w-full h-full">
              <img
                src={item.imageUrl || "/images/default-video.png"}
                alt={item.title}
                className="w-full h-full object-contain"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 bg-[#F5751E] rounded-full flex items-center justify-center">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M8 5V19L19 12L8 5Z" fill="white" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        );

      case "calendar":
        return (
          <div className="bg-[#F5F2EA] rounded-lg p-4 flex justify-center items-center h-full">
            <div className="w-full h-full">
              <img
                src={item.imageUrl || "/images/default-calendar.png"}
                alt={item.title}
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        );

      case "note":
        return (
          <div className="bg-[#F5F2EA] rounded-lg p-4 flex justify-center items-center h-full">
            <div className="w-full h-full relative">
              <div className="absolute top-2 left-2 right-2 bg-[#FFEB3B] p-2 rounded-t-lg">
                <div className="flex justify-between items-center">
                  <span className="font-bold">{item.title}</span>
                  <span className="text-xs">✨</span>
                </div>
              </div>
              <img
                src={item.imageUrl || "/images/default-note.png"}
                alt={item.title}
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        );

      case "collection":
        return (
          <div className="bg-[#F5F2EA] rounded-lg p-4 flex justify-center items-center h-full">
            <div className="w-full h-full flex items-center justify-center">
              <img
                src={item.imageUrl || "/images/default-collection.png"}
                alt={item.title}
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        );

      default:
        return (
          <div className="bg-[#F5F2EA] rounded-lg p-4 flex justify-center items-center h-full">
            <div className="text-center">
              <p>{item.title || "항목"}</p>
            </div>
          </div>
        );
    }
  };

  // 아이템을 2개씩 그룹화하여 행으로 표시
  const renderItemRows = () => {
    const rows = [];
    for (let i = 0; i < bookshelfItems.length; i += 2) {
      const item1 = bookshelfItems[i];
      const item2 =
        i + 1 < bookshelfItems.length ? bookshelfItems[i + 1] : null;

      rows.push(
        <div key={`row-${i}`} className="mb-3">
          <div className="grid grid-cols-2 gap-4 mb-1">
            <div className="h-56 shadow-md rounded-lg overflow-hidden">
              {renderBookshelfItem(item1)}
            </div>
            {item2 && (
              <div className="h-56 shadow-md rounded-lg overflow-hidden">
                {renderBookshelfItem(item2)}
              </div>
            )}
          </div>
          {i < bookshelfItems.length - 2 && (
            <div className="h-3 bg-[#D9D5CC] mx-1 rounded-b-lg"></div>
          )}
        </div>
      );
    }
    return rows;
  };

  return <div className="p-4 bg-[#E5E1D7]">{renderItemRows()}</div>;
}
