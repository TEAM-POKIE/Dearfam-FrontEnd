import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import imageNotFound from "../../assets/image/section2/image_not_found_170x130.svg";
import { ImageWithProfiles } from "./components/ImageWithProfiles";
import { useMemoryPostsByTimeOrder } from "../../hooks/api";
import { Skeleton } from "../../components/ui/skeleton";
const EventGallery = () => {
    const { data, isLoading, error } = useMemoryPostsByTimeOrder({
        page: 1,
        limit: 50, // 충분한 데이터를 가져와서 연도별 그룹화
        order: "desc", // 최신순 정렬
    });
    // 디버깅용 로그
    React.useEffect(() => {
        console.log("📊 EventGallery 상태:", {
            isLoading,
            error: error?.message,
            dataLength: data?.data?.posts?.length,
            data: data?.data,
        });
        // 데이터가 있을 때 추가 정보 로그
        if (data?.data?.posts && data.data.posts.length > 0) {
            console.log("📝 첫 번째 포스트:", data.data.posts[0]);
            console.log("📅 포스트 날짜들:", data.data.posts.map((p) => ({
                id: p.postId,
                createdAt: p.createdAt,
                year: new Date(p.createdAt).getFullYear(),
            })));
        }
    }, [data, isLoading, error]);
    if (isLoading) {
        return (_jsx("div", { className: "h-[calc(100vh-4rem)] px-5 overflow-y-auto hide-scrollbar", children: Array.from({ length: 2 }).map((_, yearIndex) => (_jsxs("div", { className: "mb-6", children: [_jsx(Skeleton, { className: "h-6 w-16 mb-4 ml-2.5" }), _jsx("div", { className: "grid grid-cols-2 gap-x-4 gap-y-4", children: Array.from({ length: 6 }).map((_, imageIndex) => (_jsxs("div", { className: "relative", children: [_jsx(Skeleton, { className: "rounded-[0.94rem] w-[10.625rem] h-[8.125rem]" }), _jsx("div", { className: "absolute bottom-2 right-2 flex -space-x-1", children: Array.from({ length: 2 }).map((_, profileIndex) => (_jsx(Skeleton, { className: "w-6 h-6 rounded-full border-2 border-white" }, profileIndex))) })] }, imageIndex))) })] }, yearIndex))) }));
    }
    if (error) {
        return (_jsx("div", { className: "h-[calc(100vh-4rem)] px-5 flex items-center justify-center", children: _jsx("div", { className: "text-center", children: _jsx("div", { className: "text-h4 text-[#9a9893]", children: "\uB370\uC774\uD130\uB97C \uBD88\uB7EC\uC624\uB294 \uC911 \uC624\uB958\uAC00 \uBC1C\uC0DD\uD588\uC2B5\uB2C8\uB2E4." }) }) }));
    }
    if (!data?.data?.posts || data.data.posts.length === 0) {
        return (_jsx("div", { className: "h-[calc(100vh-4rem)] px-5 flex items-center justify-center", children: _jsx("div", { className: "text-center", children: _jsx("div", { className: "text-h4 text-[#9a9893]", children: "\uD45C\uC2DC\uD560 \uBA54\uBAA8\uB9AC\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4." }) }) }));
    }
    const posts = data.data.posts;
    // 데이터를 연도별로 그룹화
    const groupedByYear = posts.reduce((acc, post) => {
        const year = new Date(post.createdAt || post.updatedAt || Date.now()).getFullYear();
        if (!acc[year]) {
            acc[year] = [];
        }
        acc[year].push(post);
        return acc;
    }, {});
    return (_jsx("div", { className: "h-[calc(100vh-4rem)] px-5 overflow-y-auto hide-scrollbar", children: Object.entries(groupedByYear)
            .sort(([yearA], [yearB]) => Number(yearB) - Number(yearA)) // 최신 연도부터
            .map(([year, posts]) => (_jsxs("div", { className: "mb-6", children: [_jsx("div", { className: "text-h4 text-[#9a9893] mb-4 ml-2.5", children: year }), _jsx("div", { className: "grid grid-cols-2 gap-x-4 gap-y-4", children: posts.map((post) => (_jsx(ImageWithProfiles, { imageSrc: post.images && post.images.length > 0
                            ? post.images[0]
                            : imageNotFound, imageAlt: post.title || "이미지", imageClassName: "rounded-[0.94rem] w-[10.625rem] h-[8.125rem]", profileCount: post.participants?.length || 1, profileSize: "small" }, post.postId))) })] }, year))) }));
};
export default EventGallery;
