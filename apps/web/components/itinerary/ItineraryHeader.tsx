"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Share2, ListTodo, Calendar, Eye, Hammer, Check, Copy, Sparkles } from "lucide-react";
import { apiClient } from "@/lib/api-client";

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
  { id: "build", label: "Builder", icon: Hammer, href: (id: string) => `/trips/${id}/build` },
  { id: "view", label: "Viewer", icon: Eye, href: (id: string) => `/trips/${id}/view` },
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
  const [sharing, setSharing] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleShareClick = async () => {
    setSharing(true);
    try {
      const res = await apiClient.sharing.generateSlug(tripId);
      const fullUrl = `${window.location.origin}/share/${res.shareSlug}`;
      setShareUrl(fullUrl);
      navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err: any) {
      // Fallback for store demo trips
      const fallbackUrl = `${window.location.origin}/share/${tripId}`;
      setShareUrl(fallbackUrl);
      navigator.clipboard.writeText(fallbackUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } finally {
      setSharing(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-2 flex items-center justify-between gap-3 flex-wrap">
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

            <button
              onClick={handleShareClick}
              disabled={sharing}
              className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-[#E77A64] hover:bg-[#d66752] text-white shadow-xs transition-all cursor-pointer"
            >
              {copied ? <Check size={13} /> : <Share2 size={13} />}
              <span>{copied ? "Link Copied!" : "Share"}</span>
            </button>
          </div>
        </div>
      </header>

      {shareUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white p-6 rounded-3xl border-4 border-white shadow-2xl max-w-md w-full animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold font-serif text-[#4A7C77] flex items-center gap-2">
                <Sparkles className="text-[#F6D267]" size={20} /> Public Scrapbook Shared!
              </h3>
              <button
                onClick={() => setShareUrl(null)}
                className="text-slate-400 hover:text-slate-700 font-black text-sm"
              >
                ✕
              </button>
            </div>
            <p className="text-slate-500 font-bold text-xs mb-3">
              Anyone with this link can view your travel itinerary in read-only scrapbook mode:
            </p>
            <div className="flex items-center gap-2 bg-slate-100 p-2.5 rounded-xl border border-slate-200 mb-4">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="w-full bg-transparent font-mono text-xs font-bold text-slate-700 outline-none"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(shareUrl);
                  setCopied(true);
                }}
                className="bg-[#4A7C77] text-white p-2 rounded-lg text-xs font-bold hover:bg-[#38605c] transition-colors"
              >
                <Copy size={14} />
              </button>
            </div>
            <button
              onClick={() => window.open(shareUrl, "_blank")}
              className="w-full bg-[#F6D267] hover:bg-amber-400 text-slate-900 font-bold py-2.5 rounded-xl shadow-sm text-sm"
            >
              Open Public Scrapbook View ✈️
            </button>
          </div>
        </div>
      )}
    </>
  );
}
