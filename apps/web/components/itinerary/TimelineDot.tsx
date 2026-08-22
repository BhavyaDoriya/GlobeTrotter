"use client";

import React from "react";
import { Check } from "lucide-react";

interface TimelineDotProps {
  completed: boolean;
  isLast?: boolean;
  index?: number;
}

export function TimelineDot({ completed, isLast = false }: TimelineDotProps) {
  return (
    <div className="flex flex-col items-center flex-shrink-0" style={{ width: 40 }}>
      {/* The dot */}
      <div
        className={`
          w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
          border-2 border-[#0D0D0D] transition-all duration-150 z-10
          ${completed ? "bg-[#86EFAC]" : "bg-[#FAFAF7]"}
        `}
        style={{ boxShadow: "2px 2px 0px #0D0D0D" }}
      >
        {completed ? (
          <Check size={14} strokeWidth={3} className="text-[#0D0D0D]" />
        ) : (
          <div className="w-2.5 h-2.5 rounded-full bg-[#8CBDB9] border border-[#0D0D0D]" />
        )}
      </div>

      {/* Connector line */}
      {!isLast && (
        <div
          className="w-1 flex-1 min-h-8 border-x border-[#0D0D0D]"
          style={{
            background: completed ? "#86EFAC" : "#8CBDB9",
          }}
        />
      )}
    </div>
  );
}
