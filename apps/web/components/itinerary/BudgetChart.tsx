"use client";

import React, { useState } from "react";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
} from "recharts";
import { DollarSign, TrendingUp } from "lucide-react";
import type { BudgetLine, BudgetCategory } from "@/lib/itinerary/types";
import { BUDGET_CATEGORY_META } from "@/lib/itinerary/types";
import { validateBudget, formatCurrency, getSuggestedMinBudget } from "@/lib/itinerary/budget-validator";
import { FoolishAmbitionsModal } from "./FoolishAmbitionsModal";

interface BudgetChartProps {
  budgetLines: BudgetLine[];
  totalBudget: number;
  cityName: string;
  tripDays: number;
  onSetBudget: (amount: number) => void;
  onUpdateLine: (category: string, amount: number) => void;
}

const CUSTOM_TOOLTIP = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0].payload;
  return (
    <div className="bg-[#FAFAF7] border-2 border-[#0D0D0D] px-3 py-1.5 rounded shadow-[3px_3px_0px_#0D0D0D] text-xs font-bold text-[#0D0D0D]">
      {name}: <span className="text-[#E77A64]">{formatCurrency(value)}</span>
    </div>
  );
};

export function BudgetChart({
  budgetLines, totalBudget, cityName, tripDays, onSetBudget, onUpdateLine,
}: BudgetChartProps) {
  const [budgetInput, setBudgetInput] = useState(totalBudget > 0 ? String(totalBudget) : "");
  const [showMorgott, setShowMorgott] = useState(false);
  const [morgottData, setMorgottData] = useState({ suggestedMin: 0 });

  const spent = budgetLines.reduce((s, l) => s + l.amount, 0);

  const pieData = budgetLines.map((bl) => ({
    name: BUDGET_CATEGORY_META[bl.category]?.label ?? bl.category,
    value: bl.amount,
    color: BUDGET_CATEGORY_META[bl.category]?.color ?? "#8CBDB9",
    emoji: BUDGET_CATEGORY_META[bl.category]?.emoji ?? "💰",
  }));

  const handleSetBudget = () => {
    const amount = parseFloat(budgetInput);
    if (isNaN(amount) || amount <= 0) return;

    const result = validateBudget(cityName, amount, tripDays);
    if (result.isFoolish) {
      setMorgottData({ suggestedMin: result.suggestedMinBudget });
      setShowMorgott(true);
    } else {
      onSetBudget(amount);
    }
  };

  const isOverBudget = totalBudget > 0 && spent > totalBudget;

  return (
    <>
      {/* Morgott Modal */}
      <FoolishAmbitionsModal
        isOpen={showMorgott}
        onClose={() => setShowMorgott(false)}
        onIncreaseBudget={() => {
          setShowMorgott(false);
          const suggested = getSuggestedMinBudget(cityName, tripDays);
          setBudgetInput(String(suggested));
          onSetBudget(suggested);
        }}
        cityName={cityName}
        enteredBudget={parseFloat(budgetInput) || 0}
        suggestedMinBudget={morgottData.suggestedMin}
        tripDays={tripDays}
      />

      <div className="space-y-6">
        {/* ── Set total budget ───────────────────────────────────────────── */}
        <div className="nb-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-[#F6D267] border-2 border-[#0D0D0D] rounded flex items-center justify-center shadow-[2px_2px_0px_#0D0D0D]">
              <DollarSign size={16} className="text-[#0D0D0D]" />
            </div>
            <h3 className="font-extrabold text-[#0D0D0D]">Total Trip Budget</h3>
          </div>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0D0D0D] font-bold text-sm" style={{ fontFamily: "var(--font-mono)" }}>$</span>
              <input
                type="number"
                value={budgetInput}
                onChange={(e) => setBudgetInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSetBudget()}
                placeholder="Enter total budget..."
                className="nb-input pl-8"
              />
            </div>
            <button
              onClick={handleSetBudget}
              className="nb-btn nb-btn-teal"
            >
              Set
            </button>
          </div>

          {/* Budget meter */}
          {totalBudget > 0 && (
            <div className="mt-4">
              <div className="flex justify-between text-xs font-bold text-[#0D0D0D] mb-1.5" style={{ fontFamily: "var(--font-mono)" }}>
                <span>{formatCurrency(spent)} SPENT</span>
                <span className={isOverBudget ? "text-red-600 font-black" : "text-[#0D0D0D]/70"}>
                  {isOverBudget ? "OVER BUDGET!" : `${formatCurrency(totalBudget - spent)} REMAINING`}
                </span>
              </div>
              <div className="h-4 bg-[#F0EDE6] rounded-md border-2 border-[#0D0D0D] overflow-hidden p-0.5">
                <div
                  className={`h-full rounded-sm transition-all duration-300 ${
                    isOverBudget ? "bg-[#E77A64]" : "bg-[#8CBDB9]"
                  }`}
                  style={{ width: `${Math.min(100, (spent / totalBudget) * 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* ── Pie chart ───────────────────────────────────────────────────── */}
        {pieData.length > 0 && (
          <div className="nb-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-[#8CBDB9] border-2 border-[#0D0D0D] rounded flex items-center justify-center shadow-[2px_2px_0px_#0D0D0D]">
                <TrendingUp size={16} className="text-[#0D0D0D]" />
              </div>
              <h3 className="font-extrabold text-[#0D0D0D]">Spending Breakdown</h3>
            </div>

            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={4}
                  stroke="#0D0D0D"
                  strokeWidth={2}
                >
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CUSTOM_TOOLTIP />} />
              </PieChart>
            </ResponsiveContainer>

            {/* Itemised list */}
            <div className="space-y-2 mt-2">
              {pieData.map((entry, i) => (
                <div key={i} className="flex items-center justify-between p-1.5 rounded border border-[#0D0D0D]/20 bg-[#F0EDE6]">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 border border-[#0D0D0D] rounded-sm flex-shrink-0"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-xs font-bold text-[#0D0D0D]">
                      {entry.emoji} {entry.name}
                    </span>
                  </div>
                  <span className="text-xs font-black text-[#0D0D0D]" style={{ fontFamily: "var(--font-mono)" }}>
                    {formatCurrency(entry.value)}
                  </span>
                </div>
              ))}

              <div className="border-t-2 border-[#0D0D0D] pt-2 flex justify-between">
                <span className="text-xs font-extrabold text-[#0D0D0D] uppercase tracking-wider" style={{ fontFamily: "var(--font-mono)" }}>Total</span>
                <span className="text-sm font-black text-[#E77A64]" style={{ fontFamily: "var(--font-mono)" }}>{formatCurrency(spent)}</span>
              </div>
            </div>
          </div>
        )}

        {/* ── Per-category edit ───────────────────────────────────────────── */}
        <div className="nb-card p-5">
          <h3 className="font-extrabold text-[#0D0D0D] mb-3">Edit Budget Lines</h3>
          <div className="space-y-3">
            {(["transport", "stay", "activities", "meals"] as BudgetCategory[]).map((cat) => {
              const meta = BUDGET_CATEGORY_META[cat];
              const current = budgetLines.find((bl) => bl.category === cat)?.amount ?? 0;
              return (
                <div key={cat} className="flex items-center gap-3">
                  <span className="text-base">{meta.emoji}</span>
                  <span className="text-xs font-bold text-[#0D0D0D] w-24 uppercase" style={{ fontFamily: "var(--font-mono)" }}>{meta.label}</span>
                  <div className="relative flex-1">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#0D0D0D] text-xs font-bold" style={{ fontFamily: "var(--font-mono)" }}>$</span>
                    <input
                      type="number"
                      defaultValue={current}
                      onBlur={(e) => onUpdateLine(cat, parseFloat(e.target.value) || 0)}
                      className="nb-input pl-6 py-1 text-xs"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
