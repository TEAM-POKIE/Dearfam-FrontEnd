interface PageControlProps {
  currentStep: number;
  totalSteps: number;
}

export function PageControl({ currentStep, totalSteps }: PageControlProps) {
  return (
    <div className="flex flex-col justify-center items-center w-[390px] p-[10px]">
      <div className="flex justify-center items-center gap-2">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div
            key={index}
            className={`w-[10px] h-[10px] rounded-full ${
              index + 1 === currentStep ? 'bg-main-1' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
} 