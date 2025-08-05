interface DetailContentProps {
  data: string;
  date: string;
}

export const DetailContent = ({ data, date }: DetailContentProps) => {
  return (
    <div className="px-[1.25rem] pt-[0.625rem] pb-[1.25rem] ">
      <div className="text-gray-2 text-body3">{data}</div>
      <div className="mt-[0.625rem] text-right text-gray-3 text-caption1">
        {date}{" "}
      </div>
    </div>
  );
};
