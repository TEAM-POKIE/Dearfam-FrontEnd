import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import { Skeleton } from "../../../components/ui/skeleton";
export const ImageWithProfiles = ({ imageSrc, imageAlt, imageClassName = "", profileCount = 1, profileSize = "medium", }) => {
    const [isImageLoaded, setIsImageLoaded] = React.useState(false);
    const [isImageError, setIsImageError] = React.useState(false);
    const profileImage = "/src/assets/image/style_icon_profile.svg";
    const profileSizeClasses = {
        small: "w-[0.8125rem] h-[0.8125rem]",
        medium: "w-[1.25rem] h-[1.25rem]",
    };
    const profilePositionClasses = {
        small: "bottom-[0.63rem] left-[0.75rem]",
        medium: "bottom-[0.75rem] left-[0.75rem]",
    };
    const handleImageLoad = () => {
        setIsImageLoaded(true);
        setIsImageError(false);
    };
    const handleImageError = () => {
        setIsImageError(true);
        setIsImageLoaded(false);
    };
    // 이미지 src가 변경되면 로딩 상태 초기화
    React.useEffect(() => {
        setIsImageLoaded(false);
        setIsImageError(false);
    }, [imageSrc]);
    return (_jsxs("div", { className: "relative inline-block", children: [!isImageLoaded && !isImageError && (_jsxs("div", { className: "relative", children: [_jsx(Skeleton, { className: imageClassName }), _jsx("div", { className: `flex gap-[0.5rem] absolute ${profilePositionClasses[profileSize]}`, children: Array.from({ length: profileCount }).map((_, index) => (_jsx(Skeleton, { className: `${profileSizeClasses[profileSize]} rounded-full` }, index))) })] })), _jsx("img", { className: `w-full ${imageClassName} ${!isImageLoaded && !isImageError ? "opacity-0 absolute" : ""}`, src: imageSrc, alt: imageAlt, onLoad: handleImageLoad, onError: handleImageError }), isImageLoaded && (_jsx("div", { className: `flex gap-[0.5rem] absolute ${profilePositionClasses[profileSize]}`, children: Array.from({ length: profileCount }).map((_, index) => (_jsx("img", { className: profileSizeClasses[profileSize], src: profileImage, alt: "\uD504\uB85C\uD544 \uC544\uC774\uCF58" }, index))) }))] }));
};
