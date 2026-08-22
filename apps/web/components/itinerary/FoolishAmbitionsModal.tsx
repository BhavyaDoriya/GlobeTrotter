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
      style={{ background: "rgba(13, 13, 13, 0.85)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      {/* Modal content container */}
      <div
        className="relative max-w-md w-full text-center animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Neobrutalist border box matching overall app theme */}
        <div
          className="relative p-6 sm:p-8 rounded-xl bg-[#FAFAF7] border-4 border-[#0D0D0D]"
          style={{
            boxShadow: "10px 10px 0px #0D0D0D",
          }}
        >
          {/* Top header badge */}
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md border-2 border-[#0D0D0D] bg-[#E77A64] text-[#FAFAF7] font-black text-xs uppercase tracking-widest mb-4"
            style={{ fontFamily: "var(--font-mono)", boxShadow: "2px 2px 0px #0D0D0D" }}
          >
            <ShieldAlert size={14} />
            <span>Notice of Folly</span>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-md bg-[#FAFAF7] border-2 border-[#0D0D0D] flex items-center justify-center
                       shadow-[2px_2px_0px_#0D0D0D] hover:translate-x-0.5 hover:translate-y-0.5 transition-all text-[#0D0D0D]"
          >
            <X size={18} />
          </button>

          {/* Main dramatic text in app font */}
          <h2
            className="text-2xl sm:text-3xl font-black leading-tight mb-2 text-[#0D0D0D] uppercase tracking-tight"
            style={{
              fontFamily: "var(--font-sans)",
            }}
          >
            PUT THESE FOOLISH
            <br />
            <span className="text-[#E77A64]">AMBITIONS TO REST</span>
          </h2>

          <p
            className="text-xs sm:text-sm mt-2 mb-5 leading-relaxed font-semibold text-[#0D0D0D]/80"
          >
            Thou art not yet mighty enough to walk this path.
            <br />
            Return when your coffers are worthy of{" "}
            <span className="font-extrabold text-[#0D0D0D] underline decoration-[#E77A64] decoration-2">{cityName}</span>.
          </p>

          {/* Budget comparison container */}
          <div
            className="rounded-lg p-3.5 mb-5 text-left space-y-2 border-2 border-[#0D0D0D] bg-[#F0EDE6]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            <div className="flex justify-between text-xs">
              <span className="font-bold text-[#0D0D0D]/60">YOUR DAILY BUDGET</span>
              <span className="font-black text-[#E77A64]">{formatCurrency(dailyEntered)}/day</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="font-bold text-[#0D0D0D]/60">MINIMUM REQUIRED</span>
              <span className="font-black text-[#4A7C77]">
                {formatCurrency(dailyMin)}/day
              </span>
            </div>
            <div
              className="border-t-2 border-[#0D0D0D]/20 pt-2 flex justify-between text-xs"
            >
              <span className="font-bold text-[#0D0D0D]/70">YOU NEED AT LEAST</span>
              <span className="font-black text-[#0D0D0D]">
                {formatCurrency(suggestedMinBudget)} total ({ratio}× more)
              </span>
            </div>
          </div>

          {/* Play voice button */}
          <button
            onClick={playMorgottVoice}
            className="nb-btn nb-btn-yellow w-full mb-4 text-xs py-2 flex items-center justify-center gap-2"
          >
            <Volume2 size={14} />
            <span>Replay Morgott's Warning</span>
          </button>

          {/* Action buttons */}
          <div className="flex gap-2.5">
            <button
              onClick={onClose}
              className="nb-btn nb-btn-ghost flex-1 py-2.5 text-xs"
            >
              I understand
            </button>
            <button
              onClick={onIncreaseBudget}
              className="nb-btn nb-btn-coral flex-1 py-2.5 text-xs"
            >
              ⚔️ Fix Budget
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
