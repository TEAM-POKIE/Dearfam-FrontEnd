import { useState, useEffect } from "react";
import { Skeleton } from "../../../components/ui/shadcn/skeleton";
import imageNotFound from "../../../assets/image/section2/image_not_found_270x280.svg";

interface ImageWithProfilesProps {
  imageSrc: string;
  imageAlt: string;
  imageClassName?: string;
  profileCount?: number;
  profileSize?: "small" | "medium";
}

export const ImageWithProfiles: React.FC<ImageWithProfilesProps> = ({
  imageSrc,
  imageAlt,
  imageClassName = "",

  profileCount,
  profileSize = "medium",
}) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isImageError, setIsImageError] = useState(false);

  //const profileImage = "/src/assets/image/style_icon_profile.svg";
  const profileSizeClasses = {
    small: "w-[0.8125rem] h-[0.8125rem]",
    medium: "w-[1.25rem] h-[1.25rem]",
  };

  const profilePositionClasses = {
    small: "bottom-[0.63rem] left-[0.75rem]",
    medium: "bottom-[0.75rem] left-[0.75rem]",
  };

  const handleImageLoad = () => {
    setIsImageLoaded(true);
    setIsImageError(false);
  };

  const handleImageError = () => {
    setIsImageError(true);
    setIsImageLoaded(false);
  };

  // 이미지 src가 변경되면 로딩 상태 초기화
  useEffect(() => {
    setIsImageLoaded(false);
    setIsImageError(false);
  }, [imageSrc]);

  return (
    <div className="flex justify-center  w-full ">
      {!isImageLoaded && !isImageError && (
        <div className="relative">
          <Skeleton className={` ${imageClassName}`} />
          {/* 프로필 아이콘들 스켈레톤 */}
          <div
            className={`flex gap-[0.5rem] absolute ${profilePositionClasses[profileSize]}`}
          >
            {Array.from({ length: profileCount || 0 }).map((_, index) => (
              <Skeleton
                key={index}
                className={`${profileSizeClasses[profileSize]} rounded-full`}
              />
            ))}
          </div>
        </div>
      )}
      <img
        className={`  ${imageClassName} ${
          isImageError ? "object-cover" : "object-cover"
        }`}
        src={isImageError ? imageNotFound : imageSrc}
        alt={imageAlt}
        onLoad={handleImageLoad}
        onError={handleImageError}
      />

      {/* {isImageLoaded && (
          <div
            className={`flex gap-[0.5rem] absolute ${profilePositionClasses[profileSize]}`}
          >
            {Array.from({ length: profileCount || 0 }).map((_, index) => (
              <img
                key={index}
                className={profileSizeClasses[profileSize]}
                src={profileImage}
                alt="프로필 아이콘"
              />
            ))}
          </div>
        )} */}
    </div>
  );
};
