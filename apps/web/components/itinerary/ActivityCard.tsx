"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Plane, Hotel, Landmark, Utensils, ShoppingBag, Music, MapPin,
  Clock, Timer, Trash2, GripVertical,
} from "lucide-react";
import type { StopActivity, ActivityCategory } from "@/lib/itinerary/types";

// ─── Category config ──────────────────────────────────────────────────────────

const CATEGORY_CFG: Record<
  ActivityCategory,
  { icon: React.ElementType; bg: string; border: string; iconColor: string; label: string }
> = {
  transport:     { icon: Plane,       bg: "#E77A64", border: "#E77A64", iconColor: "#FAFAF7", label: "Transport" },
  accommodation: { icon: Hotel,       bg: "#EC4899", border: "#EC4899", iconColor: "#FAFAF7", label: "Stay" },
  sightseeing:   { icon: Landmark,    bg: "#8CBDB9", border: "#8CBDB9", iconColor: "#0D0D0D", label: "Sights" },
  food:          { icon: Utensils,    bg: "#86EFAC", border: "#86EFAC", iconColor: "#0D0D0D", label: "Food" },
  shopping:      { icon: ShoppingBag, bg: "#F6D267", border: "#F6D267", iconColor: "#0D0D0D", label: "Shop" },
  entertainment: { icon: Music,       bg: "#C084FC", border: "#C084FC", iconColor: "#0D0D0D", label: "Show" },
  other:         { icon: MapPin,      bg: "#CBD5E1", border: "#CBD5E1", iconColor: "#0D0D0D", label: "Other" },
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
  isDragOverlay?: boolean;
}

function BoardCard({ stopActivity, onRemove, isDragOverlay = false }: BoardCardProps) {
  const { activity, scheduledTime, id } = stopActivity;
  const cfg = CATEGORY_CFG[activity.category] ?? CATEGORY_CFG.other;
  const Icon = cfg.icon;

  const {
    attributes, listeners, setNodeRef, transform, transition, isDragging,
  } = useSortable({ id, data: { date: stopActivity.scheduledDate } });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    boxShadow: isDragOverlay ? "5px 5px 0px #0D0D0D" : "2.5px 2.5px 0px #0D0D0D",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        relative rounded-lg bg-[#FAFAF7] border-[1.5px] border-[#0D0D0D]
        p-3 group select-none cursor-grab active:cursor-grabbing
        ${isDragging && !isDragOverlay ? "dragging-card" : ""}
        ${isDragOverlay ? "drag-overlay-card bg-[#F6D267]" : "hover:-translate-y-0.5 transition-all duration-100"}
      `}
    >
      {/* Visible Drag handle indicator */}
      <div
        className="absolute top-2.5 right-2 opacity-40 group-hover:opacity-100
                   text-[#0D0D0D] transition-opacity p-0.5 pointer-events-none"
      >
        <GripVertical size={16} />
      </div>

      {/* Content */}
      <p className="text-xs font-bold text-[#0D0D0D] leading-snug pr-6 line-clamp-2">
        {activity.name}
      </p>

      <div className="flex items-center gap-2 mt-2.5 flex-wrap">
        {/* Category pill */}
        <span
          className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase px-2 py-0.5 rounded border border-[#0D0D0D]"
          style={{
            backgroundColor: cfg.bg,
            color: cfg.iconColor,
            fontFamily: "var(--font-mono)",
          }}
        >
          <Icon size={12} />
          {cfg.label}
        </span>

        {/* Time */}
        <span className="flex items-center gap-1 text-[11px] font-bold text-[#0D0D0D]/75" style={{ fontFamily: "var(--font-mono)" }}>
          <Clock size={12} />
          {scheduledTime}
        </span>

        {/* Duration */}
        <span className="flex items-center gap-1 text-[11px] font-bold text-[#0D0D0D]/75" style={{ fontFamily: "var(--font-mono)" }}>
          <Timer size={12} />
          {durationLabel(activity.durationMinutes)}
        </span>

        {/* Cost */}
        {activity.costEstimate > 0 && (
          <span
            className="text-[10px] font-black text-[#0D0D0D] ml-auto bg-[#F6D267] px-1.5 py-0.5 rounded border border-[#0D0D0D]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            ${activity.costEstimate}
          </span>
        )}
      </div>

      {/* Remove button */}
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(id);
          }}
          onPointerDown={(e) => e.stopPropagation()}
          className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100
                     hover:text-red-600 text-[#0D0D0D]/50 transition-opacity p-1 cursor-pointer"
          aria-label="Remove activity"
        >
          <Trash2 size={14} />
        </button>
      )}
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
        flex items-center gap-4 bg-[#FAFAF7] rounded-lg p-3.5
        border-[1.5px] border-[#0D0D0D]
        transition-all duration-150 hover:-translate-y-0.5
        ${completed ? "opacity-60" : ""}
      `}
      style={{ boxShadow: "3px 3px 0px #0D0D0D" }}
    >
      {/* Category icon box (increased icon size to 22px) */}
      <div
        className="w-11 h-11 rounded-md border-[1.5px] border-[#0D0D0D] flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: cfg.bg }}
      >
        <Icon size={22} style={{ color: cfg.iconColor }} />
      </div>

      {/* Name + category */}
      <div className="flex-1 min-w-0">
        <p className="font-bold text-[#0D0D0D] text-sm leading-snug truncate">
          {activity.name}
        </p>
        <span
          className="inline-block text-[10px] font-black uppercase tracking-wider text-[#0D0D0D]/60 mt-0.5"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {activity.category.replace("_", " ")}
        </span>
      </div>

      {/* Time range */}
      <div className="text-right flex-shrink-0" style={{ fontFamily: "var(--font-mono)" }}>
        <p className="text-xs font-bold text-[#0D0D0D]">{scheduledTime} - {endTime}</p>
        <p className="text-[10px] font-medium text-[#0D0D0D]/60">{durationLabel(activity.durationMinutes)}</p>
      </div>
    </div>
  );
}

// ─── Public export ────────────────────────────────────────────────────────────

interface ActivityCardProps {
  stopActivity: StopActivity;
  variant: "board" | "timeline";
  onRemove?: (id: string) => void;
  isDragOverlay?: boolean;
  completed?: boolean;
}

export function ActivityCard({
  stopActivity, variant, onRemove, isDragOverlay, completed,
}: ActivityCardProps) {
  if (variant === "board") {
    return (
      <BoardCard
        stopActivity={stopActivity}
        onRemove={onRemove}
        isDragOverlay={isDragOverlay}
      />
    );
  }
  return <TimelineCard stopActivity={stopActivity} completed={completed} />;
}

export { CATEGORY_CFG };
