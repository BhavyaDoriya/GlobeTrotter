"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, SlidersHorizontal, MapPin, Calendar, ArrowRight, Compass, Plane, CheckCircle2, Ticket, Plus } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { useItineraryStore } from "@/lib/itinerary/store";

const TripCard = ({
  id = 'demo-trip-1',
  title,
  route,
  dates,
  image,
  status,
  rotation,
}: {
  id?: string;
  title: string;
  route: string;
  dates: string;
  image: string;
  status: 'ongoing' | 'upcoming' | 'completed';
  rotation: string;
}) => {
  const statusStyles = {
    ongoing: {
      badge: "bg-[#E77A64] text-white",
      border: "border-[#E77A64]",
      icon: <Compass size={14} className="animate-spin-slow" />,
      text: "Happening Now",
    },
    upcoming: {
      badge: "bg-[#F6D267] text-slate-800",
      border: "border-transparent",
      icon: <Ticket size={14} />,
      text: "Upcoming",
    },
    completed: {
      badge: "bg-slate-800 text-white",
      border: "border-transparent",
      icon: <CheckCircle2 size={14} />,
      text: "Completed",
    },
  };

  const style = statusStyles[status] || statusStyles.upcoming;

  return (
    <Link
      href={`/trips/${id}/view`}
      className={`block group relative bg-white p-4 pb-6 rounded-2xl shadow-xl border-[6px] border-white cursor-pointer hover:z-50 transition-all duration-500 hover:rotate-0 hover:scale-105 hover:-translate-y-2 ${rotation} ${
        status === "ongoing" ? "ring-4 ring-[#E77A64]/30" : ""
      }`}
    >
      <div
        className={`absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-6 bg-white/80 backdrop-blur-md shadow-sm rotate-[-3deg] z-10 transition-transform group-hover:rotate-[2deg] ${style.border} border-t-2`}
      ></div>

      {status === "completed" && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-4 border-[#4A7C77] text-[#4A7C77] opacity-80 text-3xl font-black uppercase tracking-widest px-4 py-2 rounded-lg rotate-[-15deg] z-20 pointer-events-none group-hover:scale-110 transition-transform">
          Finished
        </div>
      )}

      <div className="relative w-full h-56 rounded-xl overflow-hidden mb-4 bg-slate-100">
        <img
          src={image || "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=80"}
          alt={title}
          className={`w-full h-full object-cover transition-transform duration-700 ${
            status !== "completed" ? "group-hover:scale-110" : "grayscale-[40%]"
          }`}
        />

        <div className={`absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-md ${style.badge}`}>
          {style.icon} {style.text}
        </div>
      </div>

      <div className="px-1">
        <h4 className="text-2xl font-bold text-slate-800 font-serif leading-tight mb-2 group-hover:text-[#4A7C77] transition-colors">
          {title}
        </h4>

        <div className="space-y-2">
          <p className="text-slate-500 text-sm font-bold flex items-center gap-2">
            <MapPin size={16} className="text-[#E77A64]" /> {route || "Destination"}
          </p>
          <p className="text-slate-500 text-sm font-bold flex items-center gap-2">
            <Calendar size={16} className="text-[#8CBDB9]" /> {dates}
          </p>
        </div>
      </div>

      <div className="absolute bottom-4 right-4 bg-slate-100 p-2 rounded-full opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all text-[#4A7C77] hover:bg-[#F6D267] hover:text-slate-900">
        <ArrowRight size={20} />
      </div>
    </Link>
  );
};

export default function MyTripsPage() {
  const storeTrips = useItineraryStore((state) => state.trips);
  const [dbTrips, setDbTrips] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    apiClient.trips
      .list()
      .then((data) => {
        if (Array.isArray(data)) setDbTrips(data);
      })
      .catch((err) => console.log("API trips fetch note:", err.message));
  }, []);

  const storeTripsArray = Object.values(storeTrips).map((t) => ({
    id: t.id,
    title: t.name,
    route: t.stops?.[0]?.city?.name || "Destination",
    dates: `${t.startDate.slice(0, 10)} - ${t.endDate.slice(0, 10)}`,
    image: t.coverPhotoUrl || "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=80",
    status: (t as any).status || "upcoming",
    rotation: "rotate-[-1deg]",
  }));

  const dbTripsFormatted = dbTrips.map((t, idx) => ({
    id: t.id,
    title: t.name,
    route: t.description || t.stops?.[0]?.city?.name || "Global Destination",
    dates: `${t.startDate?.slice(0, 10) || "Upcoming"} - ${t.endDate?.slice(0, 10) || "End"}`,
    image: t.coverPhotoUrl || "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&q=80",
    status: t.status || (idx === 0 ? "ongoing" : "upcoming"),
    rotation: idx % 2 === 0 ? "rotate-[1deg]" : "rotate-[-2deg]",
  }));

  const combinedTrips = [...dbTripsFormatted, ...storeTripsArray];
  const filteredTrips = searchQuery
    ? combinedTrips.filter((t) => t.title.toLowerCase().includes(searchQuery.toLowerCase()) || t.route.toLowerCase().includes(searchQuery.toLowerCase()))
    : combinedTrips;

  const ongoing = filteredTrips.filter((t) => t.status === "ongoing");
  const upcoming = filteredTrips.filter((t) => t.status === "upcoming" || !t.status);
  const completed = filteredTrips.filter((t) => t.status === "completed");

  return (
    <div className="min-h-screen bg-[#E5F0EF] text-slate-800 font-sans pb-32 overflow-hidden selection:bg-[#F6D267] selection:text-slate-900 pt-8">
      <div className="fixed inset-0 pointer-events-none z-0 opacity-30">
        <svg className="absolute w-[150%] h-[150%] animate-[spin_120s_linear_infinite] -top-[25%] -left-[25%]" viewBox="0 0 1000 1000">
          <circle cx="500" cy="500" r="400" fill="none" stroke="#8CBDB9" strokeWidth="2" strokeDasharray="20 20" />
        </svg>
      </div>

      <main className="relative z-10 container mx-auto px-4 lg:px-8 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <h1 className="text-5xl font-black text-[#4A7C77] font-serif tracking-tight mb-2">My Travel Log</h1>
            <p className="text-lg font-bold text-slate-500">Your past, present, and future adventures.</p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative group flex-1 md:w-72">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#4A7C77] transition-colors" size={18} />
              <input
                type="text"
                placeholder="Search trips..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-full bg-white border-4 border-white shadow-sm focus:border-[#F6D267] focus:outline-none transition-all font-bold text-slate-700 placeholder-slate-400"
              />
            </div>
            <Link
              href="/trips/new"
              className="bg-[#E77A64] hover:bg-[#d66752] text-white px-5 py-3 rounded-full font-bold shadow-md flex items-center gap-2 transition-all"
            >
              <Plus size={18} /> Plan Trip
            </Link>
          </div>
        </div>

        {ongoing.length > 0 && (
          <section className="mb-20">
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-[#E77A64] p-2 rounded-full text-white shadow-md animate-pulse">
                <Plane size={20} />
              </div>
              <h2 className="text-3xl font-black text-slate-800 font-serif">Currently Exploring</h2>
              <div className="flex-1 h-1 bg-gradient-to-r from-[#E77A64]/50 to-transparent rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {ongoing.map((trip) => (
                <TripCard key={trip.id} {...trip} />
              ))}
            </div>
          </section>
        )}

        <section className="mb-20">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-3xl font-black text-slate-800 font-serif">Up-coming</h2>
            <div className="flex-1 h-1 bg-gradient-to-r from-[#F6D267] to-transparent rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcoming.map((trip) => (
              <TripCard key={trip.id} {...trip} />
            ))}
          </div>
        </section>

        {completed.length > 0 && (
          <section>
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-3xl font-black text-slate-800 font-serif opacity-70">Completed</h2>
              <div className="flex-1 h-1 bg-gradient-to-r from-slate-300 to-transparent rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 opacity-90">
              {completed.map((trip) => (
                <TripCard key={trip.id} {...trip} />
              ))}
            </div>
          </section>
        )}
      </main>

      <style>{`
        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }
      `}</style>
    </div>
  );
}