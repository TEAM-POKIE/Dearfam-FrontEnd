import React, { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

interface OptimizedImageProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackSrc?: string;
  lazy?: boolean;
  placeholder?: string | React.ReactNode;
  onLoad?: () => void;
  onError?: () => void;
  priority?: boolean;
  sizes?: string;
  blurDataURL?: string;
  quality?: number;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  fallbackSrc = "/assets/image/section2/image_not_found_270x280.svg",
  lazy = true,
  placeholder,
  onLoad,
  onError,
  priority = false,
  className,
  sizes,
  blurDataURL,
  quality = 75,
  ...props
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [inView, setInView] = useState(!lazy || priority);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!lazy || priority || inView) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            observerRef.current?.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: "50px",
        threshold: 0.1,
      }
    );

    if (imgRef.current) {
      observerRef.current.observe(imgRef.current);
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, [lazy, priority, inView]);

  const handleLoad = useCallback(() => {
    setLoaded(true);
    setError(false);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setError(true);
    setLoaded(false);
    onError?.();
  }, [onError]);

  // Generate optimized src with quality and format params
  const getOptimizedSrc = useCallback(
    (originalSrc: string) => {
      // If it's already an optimized URL or external URL, return as is
      if (originalSrc.includes("?") || originalSrc.startsWith("http")) {
        return originalSrc;
      }

      // Add optimization parameters for internal images
      const params = new URLSearchParams();
      if (quality !== 75) params.set("q", quality.toString());
      if (sizes) params.set("w", sizes);

      return params.toString() ? `${originalSrc}?${params}` : originalSrc;
    },
    [quality, sizes]
  );

  const imageSrc = error ? fallbackSrc : getOptimizedSrc(src);
  const shouldShowImage = inView || priority;

  return (
    <div
      className={cn(
        "relative overflow-hidden flex items-center justify-center",
        className
      )}
      ref={imgRef}
    >
      {!loaded && placeholder && shouldShowImage && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          {typeof placeholder === "string" ? (
            <div className="text-gray-400 text-sm">{placeholder}</div>
          ) : (
            placeholder
          )}
        </div>
      )}

      {blurDataURL && !loaded && shouldShowImage && (
        <img
          src={blurDataURL}
          alt=""
          className="absolute inset-0 w-full h-full object-cover filter blur-md scale-110"
          aria-hidden="true"
        />
      )}

      {shouldShowImage && (
        <img
          {...props}
          src={imageSrc}
          alt={alt}
          className={cn(
            "transition-opacity duration-300 max-w-full max-h-[24.375rem] object-contain w-full h-full",
            loaded ? "opacity-100" : "opacity-0"
          )}
          loading={lazy && !priority ? "lazy" : "eager"}
          decoding="async"
          onLoad={handleLoad}
          onError={handleError}
          sizes={sizes}
        />
      )}
    </div>
  );
};

// Hook for preloading critical images
export const useImagePreload = (srcs: string[]) => {
  useEffect(() => {
    srcs.forEach((src) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = src;
      document.head.appendChild(link);

      // Clean up on unmount
      return () => {
        if (document.head.contains(link)) {
          document.head.removeChild(link);
        }
      };
    });
  }, [srcs]);
};

export default OptimizedImage;
