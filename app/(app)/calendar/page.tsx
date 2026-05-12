import { CalendarView } from "@/components/calendar/CalendarView";

export const metadata = {
  title: "Calendar - Kynda Do",
};

export default function CalendarPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Calendar</h1>
        <p className="text-muted text-sm mt-1">View your tasks across the month.</p>
      </div>

      <CalendarView />
    </div>
  );
}
