"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Plane, Hotel, Landmark, Utensils, ShoppingBag, Music, MapPin,
  Clock, Trash2, GripVertical, Pencil,
} from "lucide-react";
import type { StopActivity, ActivityCategory } from "@/lib/itinerary/types";

// ─── Category Config ──────────────────────────────────────────────────────────

const CATEGORY_CFG: Record<
  ActivityCategory,
  { icon: React.ElementType; bg: string; text: string; label: string }
> = {
  transport:     { icon: Plane,       bg: "bg-[#E77A64]", text: "text-white",       label: "Transport" },
  accommodation: { icon: Hotel,       bg: "bg-[#EC4899]", text: "text-white",       label: "Stay" },
  sightseeing:   { icon: Landmark,    bg: "bg-[#8CBDB9]", text: "text-slate-900",   label: "Sights" },
  food:          { icon: Utensils,    bg: "bg-[#86EFAC]", text: "text-emerald-950", label: "Food" },
  shopping:      { icon: ShoppingBag, bg: "bg-[#F6D267]", text: "text-amber-950",   label: "Shop" },
  entertainment: { icon: Music,       bg: "bg-[#C084FC]", text: "text-purple-950",  label: "Show" },
  other:         { icon: MapPin,      bg: "bg-slate-200",  text: "text-slate-800",   label: "Other" },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function addMinutes(time: string, minutes: number): string {
  const [h, m] = time.split(":").map(Number);
  const total = h * 60 + m + minutes;
  const hh = Math.floor(total / 60) % 24;
  const mm = total % 60;
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}

function durationLabel(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

// ─── Board Card (builder view) ────────────────────────────────────────────────

interface BoardCardProps {
  stopActivity: StopActivity;
  onRemove?: (id: string) => void;
  onEdit?: (sa: StopActivity) => void;
  isDragOverlay?: boolean;
}

function BoardCard({ stopActivity, onRemove, onEdit, isDragOverlay = false }: BoardCardProps) {
  const { activity, scheduledTime, id } = stopActivity;
  const cfg = CATEGORY_CFG[activity.category] ?? CATEGORY_CFG.other;
  const Icon = cfg.icon;

  const {
    attributes, listeners, setNodeRef, transform, transition, isDragging,
  } = useSortable({ id, data: { date: stopActivity.scheduledDate } });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        relative rounded-2xl bg-white border border-slate-100 p-3.5 shadow-sm group select-none cursor-grab active:cursor-grabbing
        transition-all duration-200 hover:shadow-md hover:-translate-y-0.5
        ${isDragging && !isDragOverlay ? "dragging-card opacity-30" : ""}
        ${isDragOverlay ? "drag-overlay-card shadow-2xl ring-2 ring-[#4A7C77]" : ""}
      `}
    >
      {/* Top Section: Category Icon Box + Title + Grip */}
      <div className="flex items-start gap-3">
        {/* Category Icon Box */}
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm ${cfg.bg}`}
          title={cfg.label}
        >
          <Icon size={18} className={cfg.text} />
        </div>

        {/* Title */}
        <div className="flex-1 min-w-0 pr-1">
          <p className="text-sm font-bold text-slate-800 leading-snug line-clamp-2">
            {activity.name}
          </p>
          <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
            {cfg.label}
          </span>
        </div>

        {/* Drag Handle */}
        <div className="text-slate-300 group-hover:text-slate-500 transition-colors pt-0.5 flex-shrink-0">
          <GripVertical size={16} />
        </div>
      </div>

      {/* Bottom Footer Row: Time, Cost, & Edit/Delete Actions (No absolute overlapping!) */}
      <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100">
        {/* Scheduled Time & Duration */}
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
          <Clock size={13} className="text-slate-400" />
          <span>{scheduledTime}</span>
          <span className="text-slate-300">•</span>
          <span className="text-slate-400 font-semibold">{durationLabel(activity.durationMinutes)}</span>
        </div>

        {/* Right Action Controls & Cost Badge */}
        <div className="flex items-center gap-2">
          {/* Cost Badge */}
          {activity.costEstimate > 0 && (
            <span className="text-xs font-black text-[#4A7C77] bg-[#E5F0EF] px-2.5 py-0.5 rounded-full">
              ${activity.costEstimate}
            </span>
          )}

          {/* Edit Button */}
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(stopActivity);
              }}
              onPointerDown={(e) => e.stopPropagation()}
              className="p-1 rounded-lg text-slate-400 hover:text-[#4A7C77] hover:bg-slate-100 transition-all cursor-pointer"
              aria-label="Edit activity"
              title="Edit event"
            >
              <Pencil size={14} />
            </button>
          )}

          {/* Remove Button */}
          {onRemove && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove(id);
              }}
              onPointerDown={(e) => e.stopPropagation()}
              className="p-1 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer"
              aria-label="Remove activity"
              title="Delete event"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Timeline Card (viewer) ────────────────────────────────────────────────────

interface TimelineCardProps {
  stopActivity: StopActivity;
  completed?: boolean;
}

function TimelineCard({ stopActivity, completed = false }: TimelineCardProps) {
  const { activity, scheduledTime } = stopActivity;
  const cfg = CATEGORY_CFG[activity.category] ?? CATEGORY_CFG.other;
  const Icon = cfg.icon;
  const endTime = addMinutes(scheduledTime, activity.durationMinutes);

  return (
    <div
      className={`
        flex items-center gap-4 bg-white rounded-2xl p-4
        border border-slate-100 shadow-sm
        transition-all duration-200 hover:shadow-md hover:-translate-y-0.5
        ${completed ? "opacity-60" : ""}
      `}
    >
      {/* Category Icon Box */}
      <div
        className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm ${cfg.bg}`}
      >
        <Icon size={22} className={cfg.text} />
      </div>

      {/* Name + Category */}
      <div className="flex-1 min-w-0">
        <p className="font-bold text-slate-800 text-sm leading-snug truncate">
          {activity.name}
        </p>
        <span className="inline-block text-xs font-bold text-slate-400 capitalize mt-0.5">
          {activity.category.replace("_", " ")}
        </span>
      </div>

      {/* Time range */}
      <div className="text-right flex-shrink-0">
        <p className="text-xs font-bold text-slate-700">{scheduledTime} - {endTime}</p>
        <p className="text-[11px] font-semibold text-slate-400">{durationLabel(activity.durationMinutes)}</p>
      </div>
    </div>
  );
}

// ─── Public Export ────────────────────────────────────────────────────────────

interface ActivityCardProps {
  stopActivity: StopActivity;
  variant: "board" | "timeline";
  onRemove?: (id: string) => void;
  onEdit?: (sa: StopActivity) => void;
  isDragOverlay?: boolean;
  completed?: boolean;
}

export function ActivityCard({
  stopActivity, variant, onRemove, onEdit, isDragOverlay, completed,
}: ActivityCardProps) {
  if (variant === "board") {
    return (
      <BoardCard
        stopActivity={stopActivity}
        onRemove={onRemove}
        onEdit={onEdit}
        isDragOverlay={isDragOverlay}
      />
    );
  }
  return <TimelineCard stopActivity={stopActivity} completed={completed} />;
}

export { CATEGORY_CFG };
