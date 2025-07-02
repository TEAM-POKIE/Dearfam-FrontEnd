import IconSend from "../../../assets/image/section2/icon_send.svg";
import { Input } from "@/components/ui/input";

export const InputContainer = () => {
  return (
    <div className="flex items-center bg-gray-7 py-[0.8125rem] px-[0.625rem] h-[4.125rem] gap-[0.62rem]">
      <Input />

      <img src={IconSend} alt="전송" className="w-[1.875rem]" />
    </div>
  );
};
