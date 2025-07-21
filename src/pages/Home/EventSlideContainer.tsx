import { EventCarousel } from "./components/EventCarousel";

export function EventSlideContainer() {
  return <EventCarousel showLastItem={true} limit={10} />;
}
