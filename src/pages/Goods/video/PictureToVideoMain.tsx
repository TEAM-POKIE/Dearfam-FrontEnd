import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LogoImage from "@/assets/image/section5/dearfam_logo_goods.svg";
import BasicButton from "@/components/BasicButton";
import { UniversalFilePicker } from "@/components/UniversalFilePicker";
import { usePictureToVideoStore } from "@/context/store/pictureToVideoStore";

export const PictureToVideoMain = ({ content }: { content: string }) => {
  const navigate = useNavigate();
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const { selectedFiles, clearFiles } = usePictureToVideoStore();

  const handleOpenPicker = () => {
    setIsPickerOpen(true);
  };

  const handleClosePicker = () => {
    setIsPickerOpen(false);
  };

  const handleClearFiles = () => {
    clearFiles();
  };

  // 파일이 선택되면 VideoGenerationStep으로 이동
  useEffect(() => {
    if (selectedFiles.length > 0) {
      navigate("/home/goods/videoGeneration/step");
    }
  }, [selectedFiles, navigate]);

  return (
    <div className="flex flex-col items-center justify-between h-full pb-[3.44rem]">
      <div className="flex flex-col items-center">
        <img
          src={LogoImage}
          alt="logo"
          className="w-[9.375rem] mt-[6.88rem] mb-[2.5rem]"
        />
        <div className="text-center text-body2 text-gray-3 whitespace-pre-line px-[2.81rem]">
          {content}
        </div>
      </div>

      {/* Selected Files Preview */}
      {selectedFiles.length > 0 && (
        <div className="w-full max-w-md px-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-900">
                선택된 파일 ({selectedFiles.length})
              </h3>
              <button
                onClick={handleClearFiles}
                className="text-xs text-red-600 hover:text-red-700"
              >
                모두 삭제
              </button>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {selectedFiles.slice(0, 4).map((file, index) => (
                <div key={file.id} className="relative">
                  <img
                    src={file.preview}
                    alt={file.name}
                    className="w-full aspect-square object-cover rounded border"
                  />
                  {index === 3 && selectedFiles.length > 4 && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded flex items-center justify-center">
                      <span className="text-white text-xs font-medium">
                        +{selectedFiles.length - 4}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <BasicButton
        className=""
        text={selectedFiles.length > 0 ? "파일 추가/변경" : "사진 업로드하기"}
        color="main_2_80"
        size={350}
        onClick={handleOpenPicker}
      />

      {/* Universal File Picker Modal */}
      <UniversalFilePicker
        isOpen={isPickerOpen}
        onClose={handleClosePicker}
        acceptedFileTypes={["image/*"]}
        maxFiles={1}
        title="사진을 동영상화"
      />
    </div>
  );
};
