import * as React from "react";
import { useState } from "react";
import imageNotFound from "../../assets/image/section2/image_not_found_270x280.svg";
import { EventCarousel } from "./components/EventCarousel";

const SLIDES = [
  { id: 1, title: "Event Title", image: imageNotFound },
  { id: 2, title: "Event Title 2", image: imageNotFound },
  { id: 3, title: "Event Title 3", image: imageNotFound },
  { id: 4, title: "Event Title 4", image: imageNotFound },
  { id: 5, title: "Event Title 5", image: imageNotFound },
];

export function EventSlideContainer() {
  const [likedEvents, setLikedEvents] = useState<Set<number>>(new Set());

  const handleLike = (id: number) => {
    setLikedEvents((prev) => {
      const newLiked = new Set(prev);
      if (newLiked.has(id)) {
        newLiked.delete(id);
      } else {
        newLiked.add(id);
      }
      return newLiked;
    });
  };

  return (
    <EventCarousel
      items={SLIDES}
      likedEvents={likedEvents}
      onLike={handleLike}
    />
  );
}
