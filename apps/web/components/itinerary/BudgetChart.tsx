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
    <div className="bg-white rounded-xl px-4 py-2 shadow-lg border border-slate-100 text-sm font-semibold text-slate-800">
      {name}: <span className="text-[#4A7C77]">{formatCurrency(value)}</span>
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

  if (totalBudget > 0 && spent < totalBudget) {
    pieData.push({
      name: "Remaining",
      value: totalBudget - spent,
      color: "#e2e8f0", // slate-200
      emoji: "💭",
    });
  }

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
        <div className="scrapbook-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-[#F6D267] rounded-xl flex items-center justify-center shadow-sm">
              <DollarSign size={16} className="text-amber-800" />
            </div>
            <h3 className="font-extrabold text-slate-800">Total Trip Budget</h3>
          </div>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
              <input
                type="number"
                value={budgetInput}
                onChange={(e) => setBudgetInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSetBudget()}
                placeholder="Enter total budget..."
                className="w-full pl-8 pr-4 py-2.5 rounded-xl border-2 border-slate-100
                           focus:border-[#8CBDB9] focus:outline-none focus:ring-2 focus:ring-[#8CBDB9]/20
                           text-sm font-semibold transition-all bg-slate-50 text-slate-800"
              />
            </div>
            <button
              onClick={handleSetBudget}
              className="px-4 py-2.5 bg-[#4A7C77] hover:bg-[#3d6e69] text-white text-sm
                         font-bold rounded-xl transition-all shadow-sm active:scale-95"
            >
              Set
            </button>
          </div>

          {/* Budget meter */}
          {totalBudget > 0 && (
            <div className="mt-4">
              <div className="flex justify-between text-xs font-medium text-slate-500 mb-1.5">
                <span>{formatCurrency(spent)} spent</span>
                <span className={isOverBudget ? "text-red-500 font-bold" : "text-slate-500"}>
                  {isOverBudget ? "OVER BUDGET!" : `${formatCurrency(totalBudget - spent)} remaining`}
                </span>
              </div>
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isOverBudget ? "bg-red-400" : "bg-[#8CBDB9]"
                  }`}
                  style={{ width: `${Math.min(100, (spent / totalBudget) * 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* ── Pie chart ───────────────────────────────────────────────────── */}
        {pieData.length > 0 && (
          <div className="scrapbook-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-[#8CBDB9]/30 rounded-xl flex items-center justify-center">
                <TrendingUp size={16} className="text-[#4A7C77]" />
              </div>
              <h3 className="font-extrabold text-slate-800">Spending Breakdown</h3>
            </div>

            {isOverBudget && (
              <div className="mb-4 bg-red-100 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-2">
                <span>⚠️</span> You are over budget by {formatCurrency(spent - totalBudget)}!
              </div>
            )}

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
                  paddingAngle={3}
                  strokeWidth={0}
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
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-sm text-slate-600 font-medium">
                      {entry.emoji} {entry.name}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-slate-800">
                    {formatCurrency(entry.value)}
                  </span>
                </div>
              ))}

              <div className="border-t border-slate-100 pt-2 flex justify-between">
                <span className="text-sm font-bold text-slate-700">Total</span>
                <span className="text-sm font-bold text-[#4A7C77]">{formatCurrency(spent)}</span>
              </div>
            </div>
          </div>
        )}

        {/* ── Per-category edit ───────────────────────────────────────────── */}
        <div className="scrapbook-card p-5">
          <h3 className="font-extrabold text-slate-800 mb-3">Edit Budget Lines</h3>
          <div className="space-y-3">
            {(["transport", "stay", "activities", "meals"] as BudgetCategory[]).map((cat) => {
              const meta = BUDGET_CATEGORY_META[cat];
              const current = budgetLines.find((bl) => bl.category === cat)?.amount ?? 0;
              return (
                <div key={cat} className="flex items-center gap-3">
                  <span className="text-base">{meta.emoji}</span>
                  <span className="text-sm font-medium text-slate-600 w-24">{meta.label}</span>
                  <div className="relative flex-1">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">$</span>
                    <input
                      type="number"
                      value={current || ""}
                      onChange={(e) => onUpdateLine(cat, parseFloat(e.target.value) || 0)}
                      className="w-full pl-6 pr-2 py-1.5 text-sm rounded-lg border border-slate-200
                                 focus:border-[#8CBDB9] focus:outline-none bg-slate-50 font-semibold text-slate-800"
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
