"use client";

import React, { useState } from "react";
import { X, Clock, Timer, DollarSign, ChevronDown } from "lucide-react";
import type { ActivityCategory } from "@/lib/itinerary/types";
import { CATEGORY_META } from "@/lib/itinerary/types";
import { ACTIVITY_CATALOG } from "@/lib/itinerary/mock-data";

interface ActivityDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  date: string;
  dayLabel: string;
  onAdd: (data: {
    name: string;
    category: ActivityCategory;
    scheduledTime: string;
    durationMinutes: number;
    costEstimate: number;
  }) => void;
}

export function ActivityDrawer({ isOpen, onClose, date, dayLabel, onAdd }: ActivityDrawerProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<ActivityCategory>("sightseeing");
  const [time, setTime] = useState("09:00");
  const [duration, setDuration] = useState(60);
  const [cost, setCost] = useState(0);

  const categories = Object.entries(CATEGORY_META) as [ActivityCategory, (typeof CATEGORY_META)[ActivityCategory]][];

  const applyTemplate = (templateId: string) => {
    const t = ACTIVITY_CATALOG.find((c) => c.id === templateId);
    if (!t) return;
    setName(t.name);
    setCategory(t.category);
    setDuration(t.durationMinutes);
    setCost(t.costEstimate);
  };

  const handleSubmit = () => {
    if (!name.trim()) return;
    onAdd({ name: name.trim(), category, scheduledTime: time, durationMinutes: duration, costEstimate: cost });
    // Reset
    setName(""); setCategory("sightseeing"); setTime("09:00"); setDuration(60); setCost(0);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/40 animate-fade-in"
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className="fixed right-0 top-0 h-full w-full max-w-sm z-50 bg-[#FAFAF7] border-l-4 border-[#0D0D0D]
                   flex flex-col animate-slide-right shadow-2xl"
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-5 border-b-2 border-[#0D0D0D] bg-[#F6D267]"
        >
          <div>
            <p className="text-[10px] font-black text-[#0D0D0D] uppercase tracking-widest" style={{ fontFamily: "var(--font-mono)" }}>
              ✦ Add Activity
            </p>
            <h2 className="text-xl font-black text-[#0D0D0D]">{dayLabel}</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-md bg-[#FAFAF7] border-2 border-[#0D0D0D] flex items-center justify-center
                       shadow-[2px_2px_0px_#0D0D0D] hover:translate-x-0.5 hover:translate-y-0.5 transition-all text-[#0D0D0D]"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body — scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Quick templates */}
          <div>
            <label className="text-[10px] font-black text-[#0D0D0D] uppercase tracking-wider mb-2 block" style={{ fontFamily: "var(--font-mono)" }}>
              Quick Templates
            </label>
            <div className="relative">
              <select
                onChange={(e) => applyTemplate(e.target.value)}
                defaultValue=""
                className="nb-input appearance-none cursor-pointer pr-8"
              >
                <option value="" disabled>Choose a template…</option>
                {ACTIVITY_CATALOG.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0D0D0D] pointer-events-none" />
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="text-[10px] font-black text-[#0D0D0D] uppercase tracking-wider mb-1.5 block" style={{ fontFamily: "var(--font-mono)" }}>
              Activity Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Colosseum guided tour"
              className="nb-input"
            />
          </div>

          {/* Category */}
          <div>
            <label className="text-[10px] font-black text-[#0D0D0D] uppercase tracking-wider mb-1.5 block" style={{ fontFamily: "var(--font-mono)" }}>
              Category
            </label>
            <div className="grid grid-cols-4 gap-2">
              {categories.map(([cat, meta]) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  title={meta.label}
                  className={`
                    flex flex-col items-center gap-1 p-2 rounded-md border-2 border-[#0D0D0D] text-center
                    transition-all text-sm font-bold
                    ${category === cat
                      ? "bg-[#8CBDB9] shadow-[2px_2px_0px_#0D0D0D] translate-x-[-1px] translate-y-[-1px]"
                      : "bg-[#FAFAF7] hover:bg-[#F0EDE6]"
                    }
                  `}
                >
                  <span className="text-base">{meta.emoji}</span>
                  <span className="text-[9px] font-black text-[#0D0D0D] leading-tight uppercase" style={{ fontFamily: "var(--font-mono)" }}>
                    {meta.label.split(" ")[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Time & Duration */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-black text-[#0D0D0D] uppercase tracking-wider mb-1.5 flex items-center gap-1" style={{ fontFamily: "var(--font-mono)" }}>
                <Clock size={10} /> Start Time
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="nb-input"
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-[#0D0D0D] uppercase tracking-wider mb-1.5 flex items-center gap-1" style={{ fontFamily: "var(--font-mono)" }}>
                <Timer size={10} /> Duration (min)
              </label>
              <input
                type="number"
                value={duration}
                min={15}
                step={15}
                onChange={(e) => setDuration(parseInt(e.target.value) || 60)}
                className="nb-input"
              />
            </div>
          </div>

          {/* Cost */}
          <div>
            <label className="text-[10px] font-black text-[#0D0D0D] uppercase tracking-wider mb-1.5 flex items-center gap-1" style={{ fontFamily: "var(--font-mono)" }}>
              <DollarSign size={10} /> Estimated Cost (USD)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0D0D0D] font-bold text-sm" style={{ fontFamily: "var(--font-mono)" }}>$</span>
              <input
                type="number"
                value={cost}
                min={0}
                onChange={(e) => setCost(parseFloat(e.target.value) || 0)}
                className="nb-input pl-7"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 pt-3 border-t-2 border-[#0D0D0D] space-y-2">
          <button
            onClick={handleSubmit}
            disabled={!name.trim()}
            className="nb-btn nb-btn-coral w-full py-3 text-sm disabled:opacity-40"
          >
            Add to {dayLabel} ✈️
          </button>
          <button
            onClick={onClose}
            className="w-full py-2 text-[#0D0D0D] font-bold text-xs uppercase tracking-wider hover:underline"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );
}
