import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "../../utils/utils";
import { Button } from "./button";
const CarouselContext = React.createContext(null);
function useCarousel() {
    const context = React.useContext(CarouselContext);
    if (!context) {
        throw new Error("useCarousel must be used within a <Carousel />");
    }
    return context;
}
const Carousel = React.forwardRef(({ orientation = "horizontal", opts, setApi, plugins, className, children, ...props }, ref) => {
    const [carouselRef, api] = useEmblaCarousel({
        ...opts,
        axis: orientation === "horizontal" ? "x" : "y",
    }, plugins);
    const [canScrollPrev, setCanScrollPrev] = React.useState(false);
    const [canScrollNext, setCanScrollNext] = React.useState(false);
    const onSelect = React.useCallback((api) => {
        if (!api)
            return;
        setCanScrollPrev(api.canScrollPrev());
        setCanScrollNext(api.canScrollNext());
    }, []);
    const scrollPrev = React.useCallback(() => {
        api?.scrollPrev();
    }, [api]);
    const scrollNext = React.useCallback(() => {
        api?.scrollNext();
    }, [api]);
    const handleKeyDown = React.useCallback((event) => {
        if (event.key === "ArrowLeft") {
            event.preventDefault();
            scrollPrev();
        }
        else if (event.key === "ArrowRight") {
            event.preventDefault();
            scrollNext();
        }
    }, [scrollPrev, scrollNext]);
    React.useEffect(() => {
        if (!api || !setApi)
            return;
        setApi(api);
    }, [api, setApi]);
    React.useEffect(() => {
        if (!api)
            return;
        onSelect(api);
        api.on("reInit", onSelect);
        api.on("select", onSelect);
        return () => {
            api?.off("select", onSelect);
        };
    }, [api, onSelect]);
    return (_jsx(CarouselContext.Provider, { value: {
            carouselRef,
            api,
            opts,
            orientation: orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
            scrollPrev,
            scrollNext,
            canScrollPrev,
            canScrollNext,
        }, children: _jsx("div", { ref: ref, onKeyDownCapture: handleKeyDown, className: cn("relative", className), role: "region", "aria-roledescription": "carousel", ...props, children: children }) }));
});
Carousel.displayName = "Carousel";
const CarouselContent = React.forwardRef(({ className, ...props }, ref) => {
    const { carouselRef } = useCarousel();
    return (_jsx("div", { ref: carouselRef, className: "overflow-hidden", children: _jsx("div", { ref: ref, className: cn("flex", className), ...props }) }));
});
CarouselContent.displayName = "CarouselContent";
const CarouselItem = React.forwardRef(({ className, ...props }, ref) => {
    return (_jsx("div", { ref: ref, role: "group", "aria-roledescription": "slide", className: cn("min-w-0 shrink-0 grow-0 basis-full", className), ...props }));
});
CarouselItem.displayName = "CarouselItem";
const CarouselPrevious = React.forwardRef(({ className, variant = "outline", size = "icon", ...props }, ref) => {
    const { orientation, scrollPrev, canScrollPrev } = useCarousel();
    return (_jsxs(Button, { ref: ref, variant: variant, size: size, className: cn("absolute h-8 w-8 rounded-full z-10", orientation === "horizontal"
            ? "-left-12 top-1/2 -translate-y-1/2"
            : "-top-12 left-1/2 -translate-x-1/2 rotate-90", className), disabled: !canScrollPrev, onClick: scrollPrev, ...props, children: [_jsx(ArrowLeft, { className: "h-4 w-4" }), _jsx("span", { className: "sr-only", children: "Previous slide" })] }));
});
CarouselPrevious.displayName = "CarouselPrevious";
const CarouselNext = React.forwardRef(({ className, variant = "outline", size = "icon", ...props }, ref) => {
    const { orientation, scrollNext, canScrollNext } = useCarousel();
    return (_jsxs(Button, { ref: ref, variant: variant, size: size, className: cn("absolute h-8 w-8 rounded-full z-10", orientation === "horizontal"
            ? "-right-12 top-1/2 -translate-y-1/2"
            : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90", className), disabled: !canScrollNext, onClick: scrollNext, ...props, children: [_jsx(ArrowRight, { className: "h-4 w-4" }), _jsx("span", { className: "sr-only", children: "Next slide" })] }));
});
CarouselNext.displayName = "CarouselNext";
const CarouselDots = () => {
    const { api } = useCarousel();
    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const [scrollSnaps, setScrollSnaps] = React.useState([]);
    React.useEffect(() => {
        if (!api)
            return;
        setScrollSnaps(api.scrollSnapList());
        setSelectedIndex(api.selectedScrollSnap());
        const onSelect = () => {
            setSelectedIndex(api.selectedScrollSnap());
        };
        api.on("select", onSelect);
        return () => {
            api.off("select", onSelect);
        };
    }, [api]);
    return (_jsx("div", { className: "flex  justify-center gap-[0.5rem] bg-main-3 w-[4rem] h-[1.5rem] px-[0.75rem] py-[0.5rem] rounded-[3.125rem]", children: scrollSnaps.map((_, index) => (_jsx("button", { onClick: () => api?.scrollTo(index), className: cn("h-[0.5rem] w-[0.5rem] rounded-full transition-colors", selectedIndex === index ? "bg-gray-7" : "bg-gray-5") }, index))) }));
};
export { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext, CarouselDots, };
