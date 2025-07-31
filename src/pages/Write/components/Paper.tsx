import { InputTitle } from "./InputTitle";
import { DropdownCalender } from "./DropdownCalender";

import { InputContent } from "./InputContent";
import { AddFam } from "./AddFam";

interface PaperProps {
  isEditMode?: boolean;
}

export const Paper = ({ isEditMode = false }: PaperProps) => {
  return (
    <div className=" flex flex-col items-center mx-[0.625rem] mt-[1.25rem]">
      <div className="flex  w-[23.125rem] h-[36.0625rem]   bg-[#F3F3F3] rounded-[0.625rem]  ">
        <div className="  w-[1.69rem] flex flex-col space-y-[1.06rem] my-[1.06rem]">
          {Array(16)
            .fill(null)
            .map((_, index) => (
              <div key={index} className="flex items-center">
                <div className="w-[0.75rem] h-[0.625rem] bg-bg-1"></div>
                <div className="w-[1.125rem] h-[1.125rem] bg-bg-1 rounded-full ml-[-0.19rem]"></div>
              </div>
            ))}
        </div>
        <div className="flex flex-col w-full h-full  p-[0.625rem]">
          <div className="flex justify-between items-center mb-[0.81rem]">
            <div className={isEditMode ? "opacity-50 pointer-events-none" : ""}>
              <DropdownCalender />
            </div>
            <div className={isEditMode ? "opacity-50 pointer-events-none" : ""}>
              <AddFam />
            </div>
          </div>
          <InputTitle />
          <InputContent />
        </div>
      </div>
    </div>
  );
};
