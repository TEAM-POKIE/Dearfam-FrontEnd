import { EventCarousel } from "./components/EventCarousel";

interface EventSlideContainerProps {
  memoryPostsData?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export function EventSlideContainer({
  memoryPostsData,
}: EventSlideContainerProps) {
  return (
    <EventCarousel
      showLastItem={true}
      limit={10}
      memoryPostsData={memoryPostsData}
    />
  );
}
