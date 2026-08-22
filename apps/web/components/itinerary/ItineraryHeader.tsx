"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Share2, ListTodo, Calendar, Eye, Hammer } from "lucide-react";

interface ItineraryHeaderProps {
  tripId: string;
  tripName: string;
  startDate: string;
  endDate: string;
  totalActivities?: number;
  innerTabs?: { id: string; label: string }[];
  activeInnerTab?: string;
  onInnerTabChange?: (id: string) => void;
}

function formatDateRange(start: string, end: string): string {
  const fmt = (d: string) => {
    const dt = new Date(d);
    return isNaN(dt.getTime())
      ? d
      : dt.toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        });
  };
  return `${fmt(start)} – ${fmt(end)}`;
}

const NAV_TABS = [
  { id: "build",    label: "Builder",  icon: Hammer,   href: (id: string) => `/trips/${id}/build`    },
  { id: "view",     label: "Viewer",   icon: Eye,      href: (id: string) => `/trips/${id}/view`     },
  { id: "calendar", label: "Calendar", icon: Calendar, href: (id: string) => `/trips/${id}/calendar` },
];

export function ItineraryHeader({
  tripId,
  tripName,
  startDate,
  endDate,
  totalActivities,
  innerTabs,
  activeInnerTab,
  onInnerTabChange,
}: ItineraryHeaderProps) {
  const pathname = usePathname();

  return (
    <header
      className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs"
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-2 flex items-center justify-between gap-3 flex-wrap">
        {/* Left: Compact Trip Title & Dates */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="min-w-0">
            <div className="flex items-baseline gap-2.5 flex-wrap">
              <h1 className="text-lg sm:text-xl font-black text-[#4A7C77] leading-tight truncate tracking-tight font-serif">
                {tripName}
              </h1>
              <span className="text-xs font-semibold text-slate-400">
                {formatDateRange(startDate, endDate)}
              </span>
            </div>
          </div>
        </div>

        {/* Center: Compact Nav Tabs (Builder / Viewer / Calendar) */}
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-full border border-slate-200/60">
          {NAV_TABS.map((tab) => {
            const isActive = pathname?.includes(`/${tab.id}`);
            const Icon = tab.icon;
            return (
              <Link
                key={tab.id}
                href={tab.href(tripId)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isActive
                    ? "bg-[#4A7C77] text-white shadow-xs"
                    : "text-slate-600 hover:text-[#4A7C77]"
                }`}
              >
                <Icon size={13} />
                <span>{tab.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Right: Activity Count Badge & Share */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {innerTabs && innerTabs.length > 0 && (
            <div className="flex items-center gap-1 bg-slate-100 rounded-full p-0.5 mr-1">
              {innerTabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => onInnerTabChange?.(t.id)}
                  className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all ${
                    activeInnerTab === t.id
                      ? "bg-[#4A7C77] text-white"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          )}

          {totalActivities !== undefined && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-[#F6D267] text-slate-800 shadow-xs">
              <ListTodo size={13} />
              <span>{totalActivities} activities</span>
            </div>
          )}
          <button className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 hover:bg-[#8CBDB9]/20 text-slate-700 hover:text-[#4A7C77] transition-all">
            <Share2 size={13} />
            <span>Share</span>
          </button>
        </div>
      </div>
    </header>
  );
}
