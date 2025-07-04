import { jsx as _jsx } from "react/jsx-runtime";
import { EventCarousel } from "./components/EventCarousel";
export function EventSlideContainer() {
    return _jsx(EventCarousel, { showLastItem: true, limit: 10 });
}
