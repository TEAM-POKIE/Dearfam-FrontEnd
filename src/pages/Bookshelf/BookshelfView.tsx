import * as React from "react";

interface BookshelfViewProps {
  bookshelfItems: Array<{
    id: string;
    type: string;
    title: string;
    imageUrl: string;
  }>;
}

export const BookshelfView: React.FC<BookshelfViewProps> = ({
  bookshelfItems,
}) => {
  const renderBookshelfItem = (
    item: BookshelfViewProps["bookshelfItems"][0]
  ) => {
    return (
      <div
        key={item.id}
        className="bg-white rounded-lg shadow-sm p-4 flex flex-col items-center"
      >
        <div className="w-full h-32 mb-2 flex items-center justify-center">
          <img
            src={item.imageUrl}
            alt={item.title}
            className="max-h-full max-w-full object-contain"
          />
        </div>
        <h3 className="text-sm font-medium text-center">{item.title}</h3>
      </div>
    );
  };

  const renderItemRows = () => {
    const rows = [];
    for (let i = 0; i < bookshelfItems.length; i += 2) {
      rows.push(
        <div key={i} className="grid grid-cols-2 gap-4 mb-4">
          {bookshelfItems[i] && renderBookshelfItem(bookshelfItems[i])}
          {bookshelfItems[i + 1] && renderBookshelfItem(bookshelfItems[i + 1])}
        </div>
      );

      // 마지막 행이 아니면 구분선 추가
      if (i + 2 < bookshelfItems.length) {
        rows.push(
          <div
            key={`separator-${i}`}
            className="border-b border-gray-200 mb-4"
          />
        );
      }
    }
    return rows;
  };

  return (
    <div className="p-4 bg-[#E5E1D7]">
      <h1 className="text-2xl font-bold mb-4">책장</h1>
      {renderItemRows()}
    </div>
  );
};
