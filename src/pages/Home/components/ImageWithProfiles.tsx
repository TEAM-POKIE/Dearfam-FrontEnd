import * as React from "react";

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
  profileCount = 1,
  profileSize = "medium",
}) => {
  const profileImage = "/src/assets/image/style_icon_profile.svg";
  const profileSizeClasses = {
    small: "w-[0.8125rem] h-[0.8125rem]",
    medium: "w-[1.25rem] h-[1.25rem]",
  };

  const profilePositionClasses = {
    small: "bottom-[0.63rem] left-[0.75rem]",
    medium: "bottom-[0.75rem] left-[0.75rem]",
  };

  return (
    <div className="relative inline-block">
      <img
        className={` w-full ${imageClassName}`}
        src={imageSrc}
        alt={imageAlt}
      />
      <div
        className={`flex gap-[0.5rem] absolute ${profilePositionClasses[profileSize]}`}
      >
        {Array.from({ length: profileCount }).map((_, index) => (
          <img
            key={index}
            className={profileSizeClasses[profileSize]}
            src={profileImage}
            alt="프로필 아이콘"
          />
        ))}
      </div>
    </div>
  );
};
