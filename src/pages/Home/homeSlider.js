import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect } from "react";
import { cn } from "../../utils/utils";
import { Slider } from "../../components/ui/slider";
import { useSliderStore } from "../../context/store/sliderStore";
import { useCarouselStore } from "../../context/store/carouselStore";
export function HomeSlider({ className, ...props }) {
    // 스토어에서 상태 및 액션 가져오기
    const { sliderValue, handleSliderChange, step, updateStep } = useSliderStore();
    const { currentIndex, totalSlides } = useCarouselStore();
    // 슬라이드 수가 변경되면 step 업데이트
    useEffect(() => {
        updateStep();
    }, [totalSlides, updateStep]);
    // 인덱스 변경 시 슬라이더 값 업데이트
    useEffect(() => {
        const newSliderValue = currentIndex * step;
        if (sliderValue !== newSliderValue) {
            useSliderStore.getState().setSliderValue(newSliderValue);
        }
    }, [currentIndex, step, sliderValue]);
    // 디버깅용 로그
    useEffect(() => {
        console.log("HomeSlider rendered with:", {
            sliderValue,
            currentIndex,
            totalSlides,
            step,
        });
    }, [sliderValue, currentIndex, totalSlides, step]);
    return (_jsx("div", { className: "px-[2.81rem]", children: _jsx(Slider, { value: [sliderValue], max: 100, step: step, onValueChange: handleSliderChange, className: cn("cursor-pointer", className), ...props }) }));
}
