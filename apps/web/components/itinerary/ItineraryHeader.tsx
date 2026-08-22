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
  const fmt = (d: string) =>
    new Date(d).toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  return `${fmt(start)} → ${fmt(end)}`;
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
      className="sticky top-0 z-40"
      style={{
        background: "#FAFAF7",
        borderBottom: "2.5px solid #0D0D0D",
        boxShadow: "0 4px 0px #0D0D0D",
      }}
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        {/* ── Top row ─────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between py-3 gap-4 flex-wrap">
          {/* Left: accent bar + trip name + dates */}
          <div className="flex items-center gap-3 min-w-0">
            {/* Thick accent bar */}
            <div
              className="hidden sm:block w-1.5 self-stretch rounded-sm flex-shrink-0"
              style={{ background: "#E77A64", minHeight: "40px" }}
            />
            <div className="min-w-0">
              <h1
                className="text-2xl sm:text-3xl font-black text-[#0D0D0D] leading-none truncate tracking-tight"
                style={{ fontFamily: "var(--font-sans)", letterSpacing: "-0.02em" }}
              >
                {tripName}
              </h1>
              <div
                className="flex items-center gap-2 mt-1 text-xs text-[#0D0D0D]/60 font-medium"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                <span>{formatDateRange(startDate, endDate)}</span>
              </div>
            </div>
          </div>

          {/* Right: activity count + share */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {totalActivities !== undefined && (
              <div
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold"
                style={{
                  background: "#F6D267",
                  color: "#0D0D0D",
                  border: "2px solid #0D0D0D",
                  borderRadius: "6px",
                  boxShadow: "2px 2px 0px #0D0D0D",
                  fontFamily: "var(--font-mono)",
                }}
              >
                <ListTodo size={12} />
                {totalActivities} activities
              </div>
            )}
            <button
              className="nb-btn nb-btn-ghost flex items-center gap-1.5"
              style={{ padding: "0.35rem 0.85rem" }}
            >
              <Share2 size={12} />
              Share
            </button>
          </div>
        </div>

        {/* ── Page nav tabs ──────────────────────────────────────────────── */}
        <div className="flex items-center justify-between pb-3 gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            {NAV_TABS.map((tab) => {
              const isActive = pathname?.includes(`/${tab.id}`);
              const Icon = tab.icon;
              return (
                <Link
                  key={tab.id}
                  href={tab.href(tripId)}
                  className={`gt-tab flex items-center gap-1.5 ${isActive ? "active" : ""}`}
                >
                  <Icon size={12} />
                  <span className="hidden sm:inline">{tab.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Inner tabs */}
          {innerTabs && innerTabs.length > 0 && (
            <div className="flex items-center gap-2">
              {innerTabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => onInnerTabChange?.(t.id)}
                  className={`gt-tab ${activeInnerTab === t.id ? "active" : ""}`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
