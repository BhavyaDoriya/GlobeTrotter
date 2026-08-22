"use client";

import React, { useState, useEffect, useMemo } from "react";
import { X, Clock, Timer, DollarSign, ChevronDown, AlertTriangle } from "lucide-react";
import type { StopActivity, ActivityCategory } from "@/lib/itinerary/types";
import { CATEGORY_META } from "@/lib/itinerary/types";
import { ACTIVITY_CATALOG } from "@/lib/itinerary/mock-data";

interface ActivityDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  date: string;
  dayLabel: string;
  initialActivity?: StopActivity | null;
  existingActivities?: StopActivity[];
  onAdd?: (data: {
    name: string;
    category: ActivityCategory;
    scheduledTime: string;
    durationMinutes: number;
    costEstimate: number;
  }) => void;
  onEdit?: (data: {
    activityId: string;
    name: string;
    category: ActivityCategory;
    scheduledTime: string;
    durationMinutes: number;
    costEstimate: number;
  }) => void;
}

export function ActivityDrawer({
  isOpen,
  onClose,
  date,
  dayLabel,
  initialActivity,
  existingActivities = [],
  onAdd,
  onEdit,
}: ActivityDrawerProps) {
  const isEditMode = !!initialActivity;

  const [name, setName] = useState("");
  const [category, setCategory] = useState<ActivityCategory>("sightseeing");
  const [time, setTime] = useState("09:00");
  const [duration, setDuration] = useState(60);
  const [cost, setCost] = useState(0);

  useEffect(() => {
    if (initialActivity) {
      setName(initialActivity.activity.name);
      setCategory(initialActivity.activity.category);
      setTime(initialActivity.scheduledTime);
      setDuration(initialActivity.activity.durationMinutes);
      setCost(initialActivity.activity.costEstimate);
    } else {
      setName("");
      setCategory("sightseeing");
      setTime("09:00");
      setDuration(60);
      setCost(0);
    }
  }, [initialActivity, isOpen]);

  // ── Time Conflict Validation ─────────────────────────────────────────────
  const timeConflict = useMemo(() => {
    if (!existingActivities || existingActivities.length === 0 || !time) return null;
    return (
      existingActivities.find(
        (sa) =>
          sa.scheduledTime === time &&
          (!initialActivity || sa.id !== initialActivity.id),
      ) ?? null
    );
  }, [existingActivities, time, initialActivity]);

  const categories = Object.entries(CATEGORY_META) as [
    ActivityCategory,
    (typeof CATEGORY_META)[ActivityCategory],
  ][];

  const applyTemplate = (templateId: string) => {
    const t = ACTIVITY_CATALOG.find((c) => c.id === templateId);
    if (!t) return;
    setName(t.name);
    setCategory(t.category);
    setDuration(t.durationMinutes);
    setCost(t.costEstimate);
  };

  const handleSubmit = () => {
    if (!name.trim() || timeConflict) return;
    if (isEditMode && initialActivity && onEdit) {
      onEdit({
        activityId: initialActivity.id,
        name: name.trim(),
        category,
        scheduledTime: time,
        durationMinutes: duration,
        costEstimate: cost,
      });
    } else if (onAdd) {
      onAdd({
        name: name.trim(),
        category,
        scheduledTime: time,
        durationMinutes: duration,
        costEstimate: cost,
      });
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className="fixed right-0 top-0 h-full w-full max-w-sm z-50 bg-white shadow-2xl
                   flex flex-col animate-slide-right border-l border-slate-100 rounded-l-3xl overflow-hidden"
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-5 border-b border-slate-100"
          style={{ background: "linear-gradient(135deg, #E5F0EF, #f8fffe)" }}
        >
          <div>
            <p className="text-xs font-extrabold text-[#4A7C77] uppercase tracking-wider">
              {isEditMode ? "Edit Activity" : "Add Activity"}
            </p>
            <h2 className="text-xl font-black text-slate-800 font-serif">{dayLabel}</h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white flex items-center justify-center
                       shadow-sm hover:shadow-md transition-all text-slate-500 hover:text-slate-800"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body — scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Quick templates (only in add mode) */}
          {!isEditMode && (
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                Quick Templates
              </label>
              <div className="relative">
                <select
                  onChange={(e) => applyTemplate(e.target.value)}
                  defaultValue=""
                  className="w-full py-2.5 px-3 pr-8 rounded-xl border-2 border-slate-100 bg-slate-50
                             text-sm font-medium text-slate-700 focus:border-[#8CBDB9] focus:outline-none
                             appearance-none cursor-pointer"
                >
                  <option value="" disabled>
                    Choose a template…
                  </option>
                  {ACTIVITY_CATALOG.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
              </div>
            </div>
          )}

          {/* Name */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">
              Activity Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Colosseum guided tour"
              className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-100 bg-slate-50
                         text-sm font-medium text-slate-800 focus:border-[#8CBDB9] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#8CBDB9]/20 transition-all"
            />
          </div>

          {/* Category */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">
              Category
            </label>
            <div className="grid grid-cols-4 gap-2">
              {categories.map(([cat, meta]) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  title={meta.label}
                  className={`
                    flex flex-col items-center gap-1 p-2 rounded-xl border-2 text-center
                    transition-all text-sm font-bold
                    ${
                      category === cat
                        ? "border-[#4A7C77] bg-[#E5F0EF] scale-105"
                        : "border-slate-100 bg-slate-50 hover:border-slate-200"
                    }
                  `}
                >
                  <span className="text-lg">{meta.emoji}</span>
                  <span className="text-[9px] font-bold text-slate-600 leading-tight">
                    {meta.label.split(" ")[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Time & Duration */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Clock size={12} /> Start Time
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className={`w-full px-3 py-2.5 rounded-xl border-2 transition-all text-sm font-semibold text-slate-800 focus:outline-none ${
                  timeConflict
                    ? "border-red-400 bg-red-50/50 text-red-900 focus:border-red-500"
                    : "border-slate-100 bg-slate-50 focus:border-[#8CBDB9]"
                }`}
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Timer size={12} /> Duration (min)
              </label>
              <input
                type="number"
                value={duration}
                min={15}
                step={15}
                onChange={(e) => setDuration(parseInt(e.target.value) || 60)}
                className="w-full px-3 py-2.5 rounded-xl border-2 border-slate-100 bg-slate-50
                           text-sm font-semibold text-slate-800 focus:border-[#8CBDB9] focus:outline-none"
              />
            </div>
          </div>

          {/* Time Conflict Validation Alert Banner */}
          {timeConflict && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs font-bold text-red-700 animate-fade-in shadow-sm">
              <AlertTriangle size={16} className="flex-shrink-0 text-red-500 mt-0.5" />
              <div>
                <span className="font-extrabold text-red-800">Time Conflict Error</span>
                <p className="text-[11px] font-medium text-red-600 mt-0.5 leading-snug">
                  "{timeConflict.activity.name}" is already scheduled at <span className="font-bold">{time}</span> on {dayLabel}.
                </p>
              </div>
            </div>
          )}

          {/* Cost */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <DollarSign size={12} /> Estimated Cost (USD)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                $
              </span>
              <input
                type="number"
                value={cost}
                min={0}
                onChange={(e) => setCost(parseFloat(e.target.value) || 0)}
                className="w-full pl-7 pr-4 py-2.5 rounded-xl border-2 border-slate-100 bg-slate-50
                           text-sm font-semibold text-slate-800 focus:border-[#8CBDB9] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 pt-3 border-t border-slate-100 space-y-2">
          <button
            onClick={handleSubmit}
            disabled={!name.trim() || !!timeConflict}
            className="w-full py-3.5 bg-[#4A7C77] hover:bg-[#3d6e69] disabled:opacity-40 disabled:cursor-not-allowed
                       text-white font-black rounded-2xl shadow-md hover:shadow-lg
                       transition-all active:scale-95 text-sm"
          >
            {isEditMode ? "Save Changes ✨" : `Add to ${dayLabel}`}
          </button>
          <button
            onClick={onClose}
            className="w-full py-2.5 text-slate-500 font-semibold text-sm rounded-xl
                       hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );
}
