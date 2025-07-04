import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState, useCallback } from "react";
import imageNotFound from "../../../assets/image/section2/image_not_found_270x280.svg";
import { Carousel, CarouselContent, CarouselItem, CarouselDots, } from "../../../components/ui/carouselDetail";
const IMAGES = [
    { id: 1, src: imageNotFound },
    { id: 2, src: imageNotFound },
    { id: 3, src: imageNotFound },
];
export function ImageSlider() {
    const [api, setApi] = useState(null);
    const onSelect = useCallback(() => {
        if (!api)
            return;
        // 선택된 슬라이드 인덱스를 확인하는 로직 (필요시 추가)
    }, [api]);
    useEffect(() => {
        if (!api)
            return;
        api.on("select", onSelect);
        return () => {
            api.off("select", onSelect);
        };
    }, [api, onSelect]);
    return (_jsxs(Carousel, { className: "w-full relative", setApi: setApi, children: [_jsx(CarouselContent, { className: "w-full", children: IMAGES.map((image) => (_jsx(CarouselItem, { className: "flex justify-center", children: _jsx("img", { src: image.src, alt: "\uC774\uBBF8\uC9C0", className: "w-full" }) }, image.id))) }), _jsx("div", { className: "absolute bottom-[0.62rem] left-1/2 -translate-x-1/2 z-10", children: _jsx(CarouselDots, {}) })] }));
}
