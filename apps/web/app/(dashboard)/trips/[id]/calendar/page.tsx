"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useItineraryStore } from "@/lib/itinerary/store";
import type { StopActivity } from "@/lib/itinerary/types";
import { CATEGORY_META } from "@/lib/itinerary/types";

interface CalendarPageProps {
  params: Promise<{ id: string }>;
}

function addMinutes(time: string, mins: number): string {
  const [h, m] = time.split(":").map(Number);
  const t = h * 60 + m + mins;
  return `${String(Math.floor(t / 60) % 24).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`;
}

interface DayCellProps {
  date: string;
  dayLabel: string;
  activities: StopActivity[];
  isToday: boolean;
}

function DayCell({ date, dayLabel, activities, isToday }: DayCellProps) {
  const [expanded, setExpanded] = useState(false);

  const [weekday, ...rest] = dayLabel.split(", ");
  const dayNum = rest.join(", ");

  return (
    <div
      className={`
        rounded-2xl bg-white border-2 min-h-36 flex flex-col overflow-hidden
        transition-all duration-200 cursor-pointer hover:shadow-md
        ${isToday ? "border-[#8CBDB9] ring-2 ring-[#8CBDB9]/30" : "border-slate-100"}
        ${expanded ? "shadow-lg" : "shadow-sm"}
      `}
      onClick={() => setExpanded((p) => !p)}
    >
      {/* Day header */}
      <div
        className={`px-3 py-2.5 flex items-start justify-between flex-shrink-0 ${
          isToday ? "bg-[#4A7C77]" : "bg-slate-50"
        }`}
      >
        <div>
          <p className={`text-xs font-bold uppercase tracking-wider ${isToday ? "text-[#8CBDB9]" : "text-slate-400"}`}>
            {weekday}
          </p>
          <p className={`text-lg font-black leading-tight ${isToday ? "text-white" : "text-slate-800"}`}>
            {dayNum}
          </p>
        </div>
        {activities.length > 0 && (
          <span
            className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              isToday ? "bg-white/20 text-white" : "bg-[#E5F0EF] text-[#4A7C77]"
            }`}
          >
            {activities.length}
          </span>
        )}
      </div>

      {/* Activity chips */}
      <div className="px-2.5 py-2 flex-1 space-y-1.5 overflow-hidden">
        {activities.slice(0, expanded ? undefined : 3).map((sa) => {
          const meta = CATEGORY_META[sa.activity.category];
          const endTime = addMinutes(sa.scheduledTime, sa.activity.durationMinutes);
          return (
            <div
              key={sa.id}
              className={`flex items-start gap-2 rounded-xl p-1.5 ${meta.bgClass.split(" ")[0]}`}
              style={{ borderLeft: `3px solid ${meta.dotColor}` }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-bold text-slate-800 truncate leading-tight">
                  {sa.activity.name}
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  {sa.scheduledTime}–{endTime}
                </p>
              </div>
              <span className="text-xs flex-shrink-0 mt-0.5">{meta.emoji}</span>
            </div>
          );
        })}

        {!expanded && activities.length > 3 && (
          <p className="text-[11px] text-[#4A7C77] font-bold px-1.5">
            +{activities.length - 3} more…
          </p>
        )}

        {activities.length === 0 && (
          <p className="text-xs text-slate-300 font-medium mt-2 text-center">Free day</p>
        )}
      </div>
    </div>
  );
}

export default function CalendarPage({ params }: CalendarPageProps) {
  const resolvedParams = React.use(params);
  const tripId = resolvedParams.id;

  const getDaySchedules = useItineraryStore((s) => s.getDaySchedules);
  const getTrip = useItineraryStore((s) => s.getTrip);

  const trip = getTrip(tripId);
  const daySchedules = getDaySchedules(tripId);

  // Week pagination
  const [weekStart, setWeekStart] = useState(0);

  if (!trip) return null;

  const totalDays = daySchedules.length;
  const DAYS_PER_PAGE = 7;
  const pageStart = weekStart;
  const pageEnd = Math.min(weekStart + DAYS_PER_PAGE, totalDays);
  const visibleDays = daySchedules.slice(pageStart, pageEnd);

  const todayStr = new Date().toISOString().split("T")[0];

  // Build per-hour summary for time grid
  const totalActivities = daySchedules.reduce((n, d) => n + d.activities.length, 0);
  const categories = [...new Set(
    daySchedules.flatMap((d) => d.activities.map((a) => a.activity.category))
  )];

  return (
    <main className="px-4 sm:px-6 py-6 max-w-[1400px] mx-auto animate-fade-in">
      {/* ── Legend + stats ─────────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-3 items-center mb-6 justify-between">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => {
            const meta = CATEGORY_META[cat];
            return (
              <span
                key={cat}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-white shadow-sm border border-slate-100"
                style={{ color: meta.dotColor }}
              >
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: meta.dotColor }}
                />
                {meta.label}
              </span>
            );
          })}
        </div>

        <span className="text-sm text-slate-500 font-medium">
          {totalActivities} activities across {totalDays} days
        </span>
      </div>

      {/* ── Week navigation ────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setWeekStart(Math.max(0, weekStart - DAYS_PER_PAGE))}
          disabled={weekStart === 0}
          className="flex items-center gap-1 px-3 py-2 rounded-xl bg-white border border-slate-200
                     text-sm font-semibold text-slate-600 hover:border-[#8CBDB9] hover:text-[#4A7C77]
                     disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
        >
          <ChevronLeft size={16} /> Prev Week
        </button>

        <div className="text-sm font-bold text-slate-600">
          {visibleDays[0]?.dayLabel} → {visibleDays[visibleDays.length - 1]?.dayLabel}
        </div>

        <button
          onClick={() => setWeekStart(Math.min(totalDays - 1, weekStart + DAYS_PER_PAGE))}
          disabled={pageEnd >= totalDays}
          className="flex items-center gap-1 px-3 py-2 rounded-xl bg-white border border-slate-200
                     text-sm font-semibold text-slate-600 hover:border-[#8CBDB9] hover:text-[#4A7C77]
                     disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
        >
          Next Week <ChevronRight size={16} />
        </button>
      </div>

      {/* ── Calendar grid ─────────────────────────────────────────────────── */}
      <div
        className="grid gap-3"
        style={{
          gridTemplateColumns: `repeat(${Math.min(visibleDays.length, 7)}, minmax(0, 1fr))`,
        }}
      >
        {visibleDays.map((day) => (
          <DayCell
            key={day.date}
            date={day.date}
            dayLabel={day.dayLabel}
            activities={day.activities}
            isToday={day.date === todayStr}
          />
        ))}
      </div>

      {/* ── Total summary bar ─────────────────────────────────────────────── */}
      <div
        className="mt-6 scrapbook-card p-4 flex flex-wrap gap-6 items-center justify-between"
        style={{ background: "linear-gradient(135deg, #E5F0EF 0%, #f8fffe 100%)" }}
      >
        {categories.map((cat) => {
          const meta = CATEGORY_META[cat];
          const count = daySchedules.reduce(
            (n, d) => n + d.activities.filter((a) => a.activity.category === cat).length,
            0,
          );
          return (
            <div key={cat} className="flex items-center gap-2">
              <span className="text-lg">{meta.emoji}</span>
              <div>
                <p className="text-xs font-bold text-slate-800">{count}</p>
                <p className="text-[10px] text-slate-500">{meta.label}</p>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
