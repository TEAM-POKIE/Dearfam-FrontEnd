"use client";
import * as React from "react";

import dropdownDefaultIcon from "../../../assets/image/icon_dropdown_arrow_24.svg";
import { Button } from "../../../components/ui/shadcn/button";
import { Calendar } from "../../../components/ui/shadcn/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../components/ui/shadcn/popover";
import { useWritePostStore } from "@/context/store/writePostStore";
import { useEffect } from "react";

export function DropdownCalender() {
  const { memoryDate, setMemoryDate } = useWritePostStore();
  const [open, setOpen] = React.useState(false);

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const weekdays = [
      "일요일",
      "월요일",
      "화요일",
      "수요일",
      "목요일",
      "금요일",
      "토요일",
    ];
    const weekday = weekdays[date.getDay()];

    return `${year}년 ${month}월 ${day}일 ${weekday}`;
  };
  useEffect(() => {
    setMemoryDate(memoryDate || "");
  }, [memoryDate]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          id="date"
          className="flex px-0 outline-none font-normal border-none shadow-none bg-[#F3F3F3] gap-[0.625rem]"
        >
          <div className="text-h5 text-[#000000]">
            {memoryDate
              ? formatDate(new Date(memoryDate))
              : "날짜를 선택하세요"}
          </div>
          <img src={dropdownDefaultIcon} alt="날짜 선택" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto bg-[#F3F3F3] p-0"
        align="start"
        style={{
          backgroundColor: "#F3F3F3",
        }}
      >
        <Calendar
          mode="single"
          selected={memoryDate ? new Date(memoryDate) : undefined}
          captionLayout="dropdown"
          onSelect={(date) => {
            if (date) {
              const year = date.getFullYear();
              const month = String(date.getMonth() + 1).padStart(2, "0");
              const day = String(date.getDate()).padStart(2, "0");
              const formattedDate = `${year}-${month}-${day}`;
              setMemoryDate(formattedDate);
            } else {
              setMemoryDate("");
            }
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
