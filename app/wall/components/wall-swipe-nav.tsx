"use client";

import { useCallback, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { addDays, addMonths, addWeeks, format } from "date-fns";

type WallSwipeNavProps = {
  view: "day" | "week" | "month";
  date: string; // yyyy-MM-dd
  children: React.ReactNode;
};

type TouchPoint = {
  x: number;
  y: number;
};

const SWIPE_THRESHOLD_PX = 60;
const MAX_VERTICAL_DRIFT_PX = 80;

function shiftDate(date: Date, view: "day" | "week" | "month", direction: "prev" | "next") {
  const amount = direction === "next" ? 1 : -1;

  if (view === "day") return addDays(date, amount);
  if (view === "week") return addWeeks(date, amount);
  return addMonths(date, amount);
}

export function WallSwipeNav({ view, date, children }: WallSwipeNavProps) {
  const router = useRouter();
  const touchStartRef = useRef<TouchPoint | null>(null);
  const touchEndRef = useRef<TouchPoint | null>(null);
  const isNavigatingRef = useRef(false);

  const currentDate = useMemo(() => {
    const parsed = new Date(`${date}T00:00:00`);
    return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
  }, [date]);

  const navigate = useCallback(
    (direction: "prev" | "next") => {
      if (isNavigatingRef.current) return;
      isNavigatingRef.current = true;

      const nextDate = shiftDate(currentDate, view, direction);
      const nextDateParam = format(nextDate, "yyyy-MM-dd");

      router.push(`/wall?view=${view}&date=${nextDateParam}`);

      window.setTimeout(() => {
        isNavigatingRef.current = false;
      }, 250);
    },
    [currentDate, router, view]
  );

  const onTouchStart = useCallback((event: React.TouchEvent<HTMLDivElement>) => {
    const touch = event.changedTouches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    touchEndRef.current = null;
  }, []);

  const onTouchMove = useCallback((event: React.TouchEvent<HTMLDivElement>) => {
    const touch = event.changedTouches[0];
    touchEndRef.current = { x: touch.clientX, y: touch.clientY };
  }, []);

  const onTouchEnd = useCallback(() => {
    const start = touchStartRef.current;
    const end = touchEndRef.current;

    if (!start || !end) return;

    const deltaX = end.x - start.x;
    const deltaY = end.y - start.y;

    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    const isHorizontalSwipe =
      absX >= SWIPE_THRESHOLD_PX &&
      absY <= MAX_VERTICAL_DRIFT_PX &&
      absX > absY;

    if (!isHorizontalSwipe) return;

    if (deltaX < 0) {
      navigate("next");
    } else {
      navigate("prev");
    }
  }, [navigate]);

  return (
    <div
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      className="touch-pan-y"
    >
      {children}
    </div>
  );
}