import { InputTitle } from "./InputTitle";
import { DropdownCalender } from "./DropdownCalender";
import addFamProfile from "../../assets/image/section3/icon_add_fam_profile.svg";
import addFamPlus from "../../assets/image/section3/icon_add_fam_plus.svg";
import { InputContent } from "./InputContent";

export const Paper = () => {
  return (
    <div className=" flex flex-col items-center mx-[0.625rem] mt-[1.25rem]">
      <div className="flex  w-[23.125rem] h-[36.0625rem]  bg-[#F3F3F3] rounded-[0.625rem]  ">
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
            <DropdownCalender />
            <button className="bg-bg-2 inline-flex px-[0.625rem] py-[0.25rem] rounded-[1rem] gap-[0.375rem] h-[1.4375rem]">
              <img src={addFamPlus} alt="addFamPlus" />
              <img src={addFamProfile} alt="addFamProfile" />
            </button>
          </div>
          <InputTitle />
          <InputContent />
        </div>
      </div>
    </div>
  );
};
