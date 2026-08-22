"use client";

import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Plus } from "lucide-react";
import { ActivityCard } from "./ActivityCard";
import type { StopActivity } from "@/lib/itinerary/types";

interface DayColumnProps {
  date: string;
  dayLabel: string;
  activities: StopActivity[];
  onAddActivity: (date: string) => void;
  onRemoveActivity: (id: string) => void;
  colIndex?: number;
}

// Neobrutalist column accent colors (cycling)
const COL_ACCENTS = [
  { bg: "#8CBDB9", shadow: "#4A7C77" },   // teal
  { bg: "#E77A64", shadow: "#D16752" },   // coral
  { bg: "#F6D267", shadow: "#D4A80A" },   // yellow
  { bg: "#FFB3C1", shadow: "#D4607A" },   // pink
  { bg: "#A855F7", shadow: "#7E22CE" },   // purple
  { bg: "#86EFAC", shadow: "#16A34A" },   // green
  { bg: "#60A5FA", shadow: "#1D4ED8" },   // blue
];

export function DayColumn({
  date, dayLabel, activities, onAddActivity, onRemoveActivity, colIndex = 0,
}: DayColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: date, data: { date } });
  const activityIds = activities.map((a) => a.id);
  const accent = COL_ACCENTS[colIndex % COL_ACCENTS.length];

  return (
    <div className="flex-shrink-0 w-52 flex flex-col gap-2">
      {/* Day header — neobrutalist pill badge */}
      <div
        className="text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-md self-start"
        style={{
          background: accent.bg,
          color: "#0D0D0D",
          border: "1.5px solid #0D0D0D",
          boxShadow: `2px 2px 0px #0D0D0D`,
          fontFamily: "var(--font-mono)",
        }}
      >
        {dayLabel}
      </div>

      {/* Drop zone */}
      <div
        ref={setNodeRef}
        className={`
          flex flex-col gap-2 flex-1 min-h-32 rounded-lg border-[1.5px] border-dashed p-2
          transition-colors duration-150
          ${isOver ? "drop-zone-active" : "border-[#0D0D0D]/30 bg-white/60"}
        `}
      >
        <SortableContext items={activityIds} strategy={verticalListSortingStrategy}>
          {activities.map((sa) => (
            <ActivityCard
              key={sa.id}
              stopActivity={sa}
              variant="board"
              onRemove={onRemoveActivity}
            />
          ))}
        </SortableContext>

        {/* Empty state */}
        {activities.length === 0 && (
          <div className="flex flex-col items-center justify-center flex-1 py-6 text-center">
            <div
              className="w-9 h-9 flex items-center justify-center mb-2 rounded-md"
              style={{ border: "2px dashed #0D0D0D", background: "transparent" }}
            >
              <Plus size={16} className="text-[#0D0D0D]/40" />
            </div>
            <p
              className="text-[10px] font-bold text-[#0D0D0D]/40 uppercase tracking-wider"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Drop here
            </p>
          </div>
        )}

        {/* Add activity button */}
        <button
          onClick={() => onAddActivity(date)}
          className="
            flex items-center justify-center gap-1.5 w-full py-2 mt-auto
            rounded-md transition-all duration-100 cursor-pointer font-black uppercase tracking-wider
          "
          style={{
            fontSize: "10px",
            fontFamily: "var(--font-mono)",
            color: "#0D0D0D",
            border: "2px dashed #0D0D0D",
            background: "transparent",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = accent.bg;
            (e.currentTarget as HTMLButtonElement).style.borderStyle = "solid";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "transparent";
            (e.currentTarget as HTMLButtonElement).style.borderStyle = "dashed";
          }}
        >
          <Plus size={12} />
          Add Activity
        </button>
      </div>
    </div>
  );
}
