import * as React from "react";
// 두 가지 상태의 이미지 가져오기
import dropdownDefaultIcon from "../../../assets/image/section1/dropdown_default.svg";
import dropdownActiveIcon from "../../../assets/image/section1/dropdown_active.svg";

interface BasicDropDownProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
}

export function BasicDropDown({ value, onChange, options, placeholder }: BasicDropDownProps) {
  const isSelected = value === options[0];

  return (
    <div
      className={`
        flex
        items-center
        w-[clamp(12.5rem,56.41vw,21.875rem)]
        h-[clamp(2.5rem,8vw,3.125rem)]
        px-[clamp(0.5rem,3.2vw,1.25rem)]
        py-[clamp(0.25rem,1.6vw,0.625rem)]
        rounded-[1rem]
        bg-bg-2
        cursor-pointer
        focus:outline-none
      `}
      onClick={() => onChange(options[0])}
    >
      <img
        src={isSelected ? dropdownActiveIcon : dropdownDefaultIcon}
        alt="선택 아이콘"
        className="mr-[1.25rem]"
      />
      <span className="text-body3 text-[#000000]">
        {placeholder || options[0]}
      </span>
    </div>
  );
}
