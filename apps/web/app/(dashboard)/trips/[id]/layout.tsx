"use client";

import React from "react";
import { useItineraryStore } from "@/lib/itinerary/store";
import { ItineraryHeader } from "@/components/itinerary/ItineraryHeader";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}

export default function TripLayout({ children, params }: LayoutProps) {
  const resolvedParams = React.use(params);
  const tripId = resolvedParams.id;

  const getTrip = useItineraryStore((s) => s.getTrip);
  const getTotalActivities = useItineraryStore((s) => s.getTotalActivities);

  const trip = getTrip(tripId);
  const totalActivities = getTotalActivities(tripId);

  if (!trip) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gt-bg">
        <div className="scrapbook-card p-8 text-center max-w-sm">
          <div className="text-4xl mb-3">🗺️</div>
          <h2 className="text-xl font-black text-slate-800 mb-2">Trip Not Found</h2>
          <p className="text-slate-500 text-sm">
            No trip with ID <code className="bg-slate-100 px-1 rounded">{tripId}</code> exists.
            <br />
            Try <a href="/trips/demo-trip-1/build" className="text-[#4A7C77] font-bold hover:underline">demo-trip-1</a>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gt-bg">
      <ItineraryHeader
        tripId={tripId}
        tripName={trip.name}
        startDate={trip.startDate}
        endDate={trip.endDate}
        totalActivities={totalActivities}
      />
      {children}
    </div>
  );
}
