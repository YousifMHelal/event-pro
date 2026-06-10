import { CalendarDays } from "lucide-react";
import { ModulePlaceholder } from "@/components/shell/module-placeholder";

export default function EventsPage() {
  return <ModulePlaceholder titleKey="events" descriptionKey="events" icon={CalendarDays} />;
}
