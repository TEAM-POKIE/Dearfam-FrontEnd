import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const BookshelfView = ({ bookshelfItems, }) => {
    const renderBookshelfItem = (item) => {
        return (_jsxs("div", { className: "bg-white rounded-lg shadow-sm p-4 flex flex-col items-center", children: [_jsx("div", { className: "w-full h-32 mb-2 flex items-center justify-center", children: _jsx("img", { src: item.imageUrl, alt: item.title, className: "max-h-full max-w-full object-contain" }) }), _jsx("h3", { className: "text-sm font-medium text-center", children: item.title })] }, item.id));
    };
    const renderItemRows = () => {
        const rows = [];
        for (let i = 0; i < bookshelfItems.length; i += 2) {
            rows.push(_jsxs("div", { className: "grid grid-cols-2 gap-4 mb-4", children: [bookshelfItems[i] && renderBookshelfItem(bookshelfItems[i]), bookshelfItems[i + 1] && renderBookshelfItem(bookshelfItems[i + 1])] }, i));
            // 마지막 행이 아니면 구분선 추가
            if (i + 2 < bookshelfItems.length) {
                rows.push(_jsx("div", { className: "border-b border-gray-200 mb-4" }, `separator-${i}`));
            }
        }
        return rows;
    };
    return (_jsxs("div", { className: "p-4 bg-[#E5E1D7]", children: [_jsx("h1", { className: "text-2xl font-bold mb-4", children: "\uCC45\uC7A5" }), renderItemRows()] }));
};
