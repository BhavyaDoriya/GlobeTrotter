"use client";

import React from "react";
import { Compass, Camera, Navigation, MapPin } from "lucide-react";
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
      <div className="min-h-screen flex items-center justify-center bg-[#E5F0EF] p-4">
        <div className="scrapbook-card p-8 text-center max-w-sm bg-white rounded-3xl border-4 border-white shadow-xl">
          <div className="w-12 h-12 rounded-full bg-[#E5F0EF] flex items-center justify-center mx-auto mb-3 text-[#4A7C77]">
            <MapPin size={24} />
          </div>
          <h2 className="text-xl font-bold font-serif text-slate-800 mb-2">Trip Not Found</h2>
          <p className="text-slate-500 text-sm font-medium mb-4">
            No trip with ID <code className="bg-slate-100 px-2 py-0.5 rounded text-slate-700">{tripId}</code> exists.
          </p>
          <a
            href="/trips/demo-trip-1/build"
            className="inline-block px-5 py-2.5 rounded-full bg-[#4A7C77] text-white font-bold text-xs uppercase tracking-wider shadow-sm hover:bg-[#38605c] transition-colors"
          >
            Go to Demo Trip
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E5F0EF] relative overflow-x-hidden">
      {/* Animated Background Topography / Flight Paths */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-25">
        <svg className="absolute w-[200%] h-[200%] animate-[spin_140s_linear_infinite] -top-[50%] -left-[50%]" viewBox="0 0 1000 1000">
          <circle cx="500" cy="500" r="280" fill="none" stroke="#8CBDB9" strokeWidth="1.5" strokeDasharray="12 12" />
          <circle cx="500" cy="500" r="420" fill="none" stroke="#8CBDB9" strokeWidth="1.5" strokeDasharray="10 20" />
          <circle cx="500" cy="500" r="560" fill="none" stroke="#4A7C77" strokeWidth="1.5" strokeDasharray="15 15" opacity="0.4" />
        </svg>
      </div>

      {/* Floating Background Travel Line Art */}
      <div className="fixed top-24 right-12 opacity-35 z-0 pointer-events-none hidden md:block">
        <Compass size={64} className="text-[#8CBDB9]" />
      </div>
      <div className="fixed bottom-24 left-10 opacity-30 z-0 pointer-events-none hidden md:block">
        <Camera size={48} className="text-[#E77A64] rotate-12" />
      </div>
      <div className="fixed top-1/2 left-6 opacity-20 z-0 pointer-events-none hidden lg:block">
        <Navigation size={40} className="text-[#4A7C77] -rotate-45" />
      </div>

      <div className="relative z-10">
        <ItineraryHeader
          tripId={tripId}
          tripName={trip.name}
          startDate={trip.startDate}
          endDate={trip.endDate}
          totalActivities={totalActivities}
        />
        {children}
      </div>
    </div>
  );
}
