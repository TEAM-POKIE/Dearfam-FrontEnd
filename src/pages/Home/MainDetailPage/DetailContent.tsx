interface DetailContentProps {
  data: string;
}

export const DetailContent = ({ data }: DetailContentProps) => {
  return (
    <div className="px-[1.25rem] pt-[0.62rem] pb-[1.25rem]">
      <div className="text-gray-2 text-body3">{data}</div>
    </div>
  );
};
