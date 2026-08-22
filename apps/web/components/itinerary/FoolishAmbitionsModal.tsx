"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X, ShieldAlert, Volume2 } from "lucide-react";
import { formatCurrency } from "@/lib/itinerary/budget-validator";
import { playMorgottVoice } from "@/lib/voice/morgott";

interface FoolishAmbitionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onIncreaseBudget: () => void;
  cityName: string;
  enteredBudget: number;
  suggestedMinBudget: number;
  tripDays: number;
}

export function FoolishAmbitionsModal({
  isOpen,
  onClose,
  onIncreaseBudget,
  cityName,
  enteredBudget,
  suggestedMinBudget,
  tripDays,
}: FoolishAmbitionsModalProps) {
  const [mounted, setMounted] = useState(false);
  const hasPlayedRef = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto-play Morgott voice when modal opens (once per open)
  useEffect(() => {
    if (isOpen && !hasPlayedRef.current) {
      hasPlayedRef.current = true;
      playMorgottVoice();
    }
    if (!isOpen) hasPlayedRef.current = false;
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const dailyEntered = tripDays > 0 ? enteredBudget / tripDays : enteredBudget;
  const dailyMin = tripDays > 0 ? suggestedMinBudget / tripDays : suggestedMinBudget;
  const ratio = suggestedMinBudget > 0 ? (suggestedMinBudget / Math.max(enteredBudget, 1)).toFixed(1) : "∞";

  const modalContent = (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center animate-fade-in p-4"
      style={{ background: "rgba(15, 23, 42, 0.65)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      {/* Modal content container */}
      <div
        className="relative max-w-md w-full text-center animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Soft rounded Scrapbook card matching Developer A theme */}
        <div
          className="relative p-6 sm:p-8 rounded-3xl bg-white border-4 border-white shadow-2xl"
        >
          {/* Top header badge */}
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#E77A64] text-white font-extrabold text-xs uppercase tracking-wider mb-4 shadow-sm">
            <ShieldAlert size={14} />
            <span>Notice of Folly</span>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center
                       shadow-sm hover:shadow-md transition-all text-slate-500 hover:text-slate-800"
          >
            <X size={18} />
          </button>

          {/* Main dramatic text in Playfair Display serif font */}
          <h2 className="text-2xl sm:text-3xl font-black leading-tight mb-2 text-slate-900 font-serif tracking-tight">
            PUT THESE FOOLISH
            <br />
            <span className="text-[#E77A64]">AMBITIONS TO REST</span>
          </h2>

          <p className="text-xs sm:text-sm mt-2 mb-5 leading-relaxed font-semibold text-slate-600">
            Thou art not yet mighty enough to walk this path.
            <br />
            Return when your coffers are worthy of{" "}
            <span className="font-extrabold text-[#4A7C77]">{cityName}</span>.
          </p>

          {/* Budget comparison container */}
          <div className="rounded-2xl p-4 mb-6 text-left space-y-2 border border-slate-100 bg-[#E5F0EF]/50">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-500">YOUR DAILY BUDGET</span>
              <span className="text-[#E77A64]">{formatCurrency(dailyEntered)}/day</span>
            </div>
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-500">MINIMUM REQUIRED</span>
              <span className="text-[#4A7C77]">
                {formatCurrency(dailyMin)}/day
              </span>
            </div>
            <div className="border-t border-slate-200/80 pt-2 flex justify-between text-xs font-bold">
              <span className="text-slate-600">YOU NEED AT LEAST</span>
              <span className="text-slate-900">
                {formatCurrency(suggestedMinBudget)} total ({ratio}× more)
              </span>
            </div>
          </div>

          {/* Play voice button */}
          <button
            onClick={playMorgottVoice}
            className="w-full mb-4 py-2.5 px-4 rounded-xl text-xs font-bold bg-[#F6D267] text-slate-800 hover:bg-[#f3ca51] transition-all shadow-sm flex items-center justify-center gap-2"
          >
            <Volume2 size={15} />
            <span>Replay Morgott's Warning</span>
          </button>

          {/* Action buttons */}
          <div className="flex gap-2.5">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all"
            >
              I understand
            </button>
            <button
              onClick={onIncreaseBudget}
              className="flex-1 py-3 rounded-xl text-xs font-black bg-[#4A7C77] hover:bg-[#3d6e69] text-white shadow-md transition-all active:scale-95"
            >
              Fix Budget
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
