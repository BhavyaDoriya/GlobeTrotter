"use client";

import React, { useState, useEffect } from "react";
import { useItineraryStore } from "@/lib/itinerary/store";
import { ActivityCard } from "@/components/itinerary/ActivityCard";
import { TimelineDot } from "@/components/itinerary/TimelineDot";
import { BudgetChart } from "@/components/itinerary/BudgetChart";
import { apiClient } from "@/lib/api-client";

interface ViewPageProps {
  params: Promise<{ id: string }>;
}

const VIEW_TABS = ["Timeline", "Budget"] as const;
type ViewTab = (typeof VIEW_TABS)[number];

export default function ViewPage({ params }: ViewPageProps) {
  const resolvedParams = React.use(params);
  const tripId = resolvedParams.id;

  const [activeTab, setActiveTab] = useState<ViewTab>("Timeline");
  const [apiTrip, setApiTrip] = useState<any>(null);

  const getDaySchedules = useItineraryStore((s) => s.getDaySchedules);
  const getTrip = useItineraryStore((s) => s.getTrip);
  const setTotalBudget = useItineraryStore((s) => s.setTotalBudget);
  const updateBudgetLine = useItineraryStore((s) => s.updateBudgetLine);

  const storeTrip = getTrip(tripId);
  const daySchedules = getDaySchedules(tripId);

  useEffect(() => {
    if (!storeTrip && tripId) {
      apiClient.trips
        .getById(tripId)
        .then((data) => setApiTrip(data))
        .catch((err) => console.log("API trip fetch note:", err.message));
    }
  }, [storeTrip, tripId]);

  const trip = storeTrip || apiTrip;
  if (!trip) {
    return (
      <div className="p-8 text-center text-slate-500 font-bold">
        Loading trip details...
      </div>
    );
  }

  const now = new Date();
  const tripDays = daySchedules.length || 1;
  const cityName = trip.stops?.[0]?.city?.name ?? trip.name ?? "Unknown";

  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
      <div className="flex items-center gap-1 bg-white rounded-full p-1 shadow-sm w-fit mb-6">
        {VIEW_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`gt-tab ${activeTab === tab ? "active" : ""}`}
          >
            {tab === "Timeline" ? "📋" : "💰"} {tab}
          </button>
        ))}
      </div>

      {activeTab === "Timeline" && (
        <div className="space-y-8 animate-fade-in">
          {daySchedules.map((day, dayIdx) => (
            <section key={day.date}>
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="px-4 py-1.5 rounded-full text-sm font-extrabold text-white"
                  style={{ background: "linear-gradient(135deg, #4A7C77, #8CBDB9)" }}
                >
                  {day.dayLabel}
                </div>
                <div className="flex-1 h-px bg-slate-200" />
                <span className="text-xs font-medium text-slate-400">
                  {day.activities.length} activities
                </span>
              </div>

              {day.activities.length === 0 ? (
                <div className="rounded-2xl border-2 border-dashed border-slate-200 p-6 text-center text-slate-400 text-sm">
                  No activities scheduled for this day
                </div>
              ) : (
                <div className="flex flex-col gap-0">
                  {day.activities.map((sa, idx) => {
                    const isLast = idx === day.activities.length - 1;
                    const actDateTime = new Date(`${sa.scheduledDate}T${sa.scheduledTime}`);
                    const completed = actDateTime < now;

                    return (
                      <div key={sa.id} className="flex gap-3 items-stretch">
                        <TimelineDot
                          completed={completed}
                          isLast={isLast && dayIdx === daySchedules.length - 1}
                          index={idx}
                        />

                        <div className="flex-1 pb-3 min-w-0">
                          <ActivityCard
                            stopActivity={sa}
                            variant="timeline"
                            completed={completed}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          ))}
        </div>
      )}

      {activeTab === "Budget" && (
        <div className="animate-fade-in">
          <div
            className="scrapbook-card p-4 mb-5 flex items-start gap-3"
            style={{ background: "linear-gradient(135deg, #E5F0EF, #f8fffe)" }}
          >
            <span className="text-2xl">💡</span>
            <div>
              <p className="text-sm font-bold text-slate-800">Budget Reality Check</p>
              <p className="text-xs text-slate-500 mt-0.5">
                Adjust your travel budget and categories dynamically.
              </p>
            </div>
          </div>

          <BudgetChart
            budgetLines={trip.budgetLines || []}
            totalBudget={trip.totalBudget || 1000}
            cityName={cityName}
            tripDays={tripDays}
            onSetBudget={(amount) => setTotalBudget({ tripId, amount })}
            onUpdateLine={(category, amount) => updateBudgetLine({ tripId, category, amount })}
          />
        </div>
      )}
    </main>
  );
}
