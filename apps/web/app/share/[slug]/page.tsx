"use client";

import React, { useState, useEffect } from "react";
import { Compass, MapPin, Calendar, Globe2, Share2, Sparkles } from "lucide-react";
import { apiClient } from "@/lib/api-client";

interface SharePageProps {
  params: Promise<{ slug: string }>;
}

export default function SharedItineraryPage({ params }: SharePageProps) {
  const resolvedParams = React.use(params);
  const slug = resolvedParams.slug;

  const [trip, setTrip] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    apiClient.sharing
      .getBySlug(slug)
      .then((data) => setTrip(data))
      .catch((err) => setError(err.message || "Public itinerary not found"))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#E5F0EF] flex items-center justify-center p-4 text-center">
        <div className="bg-white p-8 rounded-3xl border-4 border-white shadow-xl">
          <Compass className="animate-spin text-[#E77A64] mx-auto mb-4" size={48} />
          <h2 className="text-2xl font-bold font-serif text-[#4A7C77]">Opening Passport...</h2>
          <p className="text-slate-500 font-medium mt-1">Fetching public travel scrapbook</p>
        </div>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="min-h-screen bg-[#E5F0EF] flex items-center justify-center p-4 text-center">
        <div className="bg-white p-8 rounded-3xl border-4 border-white shadow-xl max-w-md">
          <Globe2 className="text-slate-400 mx-auto mb-4" size={48} />
          <h2 className="text-2xl font-bold font-serif text-slate-800">Itinerary Private or Not Found</h2>
          <p className="text-slate-500 font-medium mt-2">{error || "This travel plan may have been unshared."}</p>
        </div>
      </div>
    );
  }

  const creatorName = trip.user ? `${trip.user.firstName} ${trip.user.lastName}` : "GlobeTrotter Traveler";

  return (
    <div className="min-h-screen bg-[#E5F0EF] text-slate-800 font-sans pb-32 pt-8">
      <main className="container mx-auto px-4 lg:px-8 max-w-4xl">
        <div className="bg-white p-8 md:p-12 rounded-3xl border-8 border-white shadow-2xl relative mb-12">
          <div className="absolute -top-6 left-8 bg-[#F6D267] text-slate-900 px-4 py-1.5 rounded-full font-black text-xs uppercase tracking-widest shadow-md flex items-center gap-1.5 rotate-[-2deg]">
            <Sparkles size={14} /> Shared Scrapbook Itinerary
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-[#4A7C77] font-serif mb-3">{trip.name}</h1>
              <p className="text-slate-500 font-bold flex items-center gap-2">
                <MapPin size={18} className="text-[#E77A64]" /> By {creatorName}
              </p>
            </div>

            <div className="bg-[#E5F0EF] p-4 rounded-2xl border-2 border-slate-100 flex items-center gap-3">
              <Calendar className="text-[#4A7C77]" size={24} />
              <div>
                <p className="text-xs font-black text-slate-400 uppercase">Trip Dates</p>
                <p className="text-sm font-bold text-slate-800">
                  {trip.startDate?.slice(0, 10)} → {trip.endDate?.slice(0, 10)}
                </p>
              </div>
            </div>
          </div>

          {trip.description && (
            <p className="text-slate-600 font-medium bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-8 italic">
              "{trip.description}"
            </p>
          )}

          <div className="space-y-8">
            <h2 className="text-2xl font-bold font-serif text-[#4A7C77] flex items-center gap-2">
              <Compass size={24} /> Stops & Scheduled Activities
            </h2>

            {trip.stops?.length === 0 ? (
              <div className="p-6 bg-slate-50 rounded-2xl text-center text-slate-400 font-bold">
                No stops added to this itinerary yet.
              </div>
            ) : (
              trip.stops?.map((stop: any, idx: number) => (
                <div key={stop.id} className="bg-slate-50 p-6 rounded-2xl border-2 border-slate-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold font-serif text-slate-800">
                      Stop {idx + 1}: {stop.city?.name || "Destination"}
                    </h3>
                    <span className="text-xs font-bold text-[#E77A64] bg-white px-3 py-1 rounded-full border border-slate-200">
                      {stop.city?.country}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {stop.stopActivities?.length === 0 ? (
                      <p className="text-xs text-slate-400 font-medium">Free day to explore</p>
                    ) : (
                      stop.stopActivities?.map((sa: any) => (
                        <div key={sa.id} className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                          <span className="font-bold text-slate-800 text-sm">{sa.activity?.name || "Scheduled Activity"}</span>
                          <span className="text-xs font-bold text-slate-500">${sa.activity?.costEstimate || 0}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
