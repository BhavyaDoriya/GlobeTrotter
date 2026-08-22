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
  onEditActivity?: (sa: StopActivity) => void;
  colIndex?: number;
}

// Scrapbook theme header colors
const COL_ACCENTS = [
  { bg: "bg-[#8CBDB9] text-white" },
  { bg: "bg-[#E77A64] text-white" },
  { bg: "bg-[#F6D267] text-slate-800" },
  { bg: "bg-[#FFB3C1] text-slate-800" },
  { bg: "bg-[#9333EA] text-white" },
  { bg: "bg-[#22C55E] text-white" },
];

export function DayColumn({
  date, dayLabel, activities, onAddActivity, onRemoveActivity, onEditActivity, colIndex = 0,
}: DayColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: date, data: { date } });
  const activityIds = activities.map((a) => a.id);
  const accent = COL_ACCENTS[colIndex % COL_ACCENTS.length];

  return (
    <div className="flex-shrink-0 w-[270px] flex flex-col gap-2.5">
      {/* Day header pill */}
      <div className={`text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full self-start shadow-sm ${accent.bg}`}>
        {dayLabel}
      </div>

      {/* Drop zone */}
      <div
        ref={setNodeRef}
        className={`
          flex flex-col gap-2.5 flex-1 min-h-36 rounded-2xl border-2 border-dashed p-2.5
          transition-all duration-200
          ${isOver ? "drop-zone-active bg-[#8CBDB9]/10" : "border-slate-300/70 bg-white/40"}
        `}
      >
        <SortableContext items={activityIds} strategy={verticalListSortingStrategy}>
          {activities.map((sa) => (
            <ActivityCard
              key={sa.id}
              stopActivity={sa}
              variant="board"
              onRemove={onRemoveActivity}
              onEdit={onEditActivity}
            />
          ))}
        </SortableContext>

        {/* Empty state */}
        {activities.length === 0 && (
          <div className="flex flex-col items-center justify-center flex-1 py-8 text-center">
            <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center mb-2 text-slate-400">
              <Plus size={18} />
            </div>
            <p className="text-xs font-bold text-slate-400">Drop activities here</p>
          </div>
        )}

        {/* Add activity button */}
        <button
          onClick={() => onAddActivity(date)}
          className="
            flex items-center justify-center gap-1.5 w-full py-2.5 mt-auto
            rounded-xl text-xs font-bold text-[#4A7C77] bg-white hover:bg-[#8CBDB9]/20
            border border-dashed border-[#8CBDB9] shadow-sm
            transition-all duration-150 cursor-pointer
          "
        >
          <Plus size={14} />
          Add Activity
        </button>
      </div>
    </div>
  );
}
