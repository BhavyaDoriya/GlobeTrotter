"use client";

import React from "react";
import Link from "next/link";
import { MapPin, Calendar, ArrowRight, Compass, CheckCircle2, Ticket } from "lucide-react";

export interface TripCardProps {
  id?: string;
  href?: string;
  title: string;
  route: string;
  dates: string;
  image: string;
  status: "ongoing" | "upcoming" | "completed";
  rotation: string;
}

// ==========================================
// MODULAR COMPONENT: THE TRIP CARD
// Person B can import this to use on the Profile or Calendar views!
// ==========================================
export const TripCard = ({
  id = "demo-trip-1",
  href,
  title,
  route,
  dates,
  image,
  status,
  rotation,
}: TripCardProps) => {
  const targetHref = href ?? `/trips/${id}/build`;

  // Dynamic styling based on the trip's status
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

  const style = statusStyles[status];

  return (
    <Link
      href={targetHref}
      className={`group relative bg-white p-4 pb-6 rounded-2xl shadow-xl border-[4px] border-white cursor-pointer hover:z-50 transition-all duration-300 hover:rotate-0 hover:scale-[1.03] hover:-translate-y-2 block ${rotation} ${
        status === "ongoing" ? "ring-4 ring-[#E77A64]/30" : ""
      }`}
    >
      {/* Messy Tape */}
      <div
        className={`absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-6 bg-white/90 backdrop-blur-md shadow-sm rotate-[-3deg] z-10 transition-transform group-hover:rotate-[2deg] ${style.border} border-t-2`}
      />

      {/* Completed Stamp Effect */}
      {status === "completed" && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-4 border-[#4A7C77] text-[#4A7C77] opacity-80 text-3xl font-black uppercase tracking-widest px-4 py-2 rounded-lg rotate-[-15deg] z-20 pointer-events-none group-hover:scale-110 transition-transform font-serif">
          Finished
        </div>
      )}

      {/* Image Container */}
      <div className="relative w-full h-56 rounded-xl overflow-hidden mb-4 bg-slate-100">
        <img
          src={image}
          alt={title}
          className={`w-full h-full object-cover transition-transform duration-500 ${
            status !== "completed" ? "group-hover:scale-110" : "grayscale-[40%]"
          }`}
        />

        {/* Status Badge */}
        <div
          className={`absolute top-3 left-3 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-md ${style.badge}`}
        >
          {style.icon} {style.text}
        </div>
      </div>

      {/* Details */}
      <div className="px-1">
        <h4 className="text-2xl font-bold text-slate-800 font-serif leading-tight mb-2 group-hover:text-[#4A7C77] transition-colors">
          {title}
        </h4>

        <div className="space-y-2">
          <p className="text-slate-500 text-sm font-bold flex items-center gap-2">
            <MapPin size={16} className="text-[#E77A64]" /> {route}
          </p>
          <p className="text-slate-500 text-sm font-bold flex items-center gap-2">
            <Calendar size={16} className="text-[#8CBDB9]" /> {dates}
          </p>
        </div>
      </div>

      {/* Hover Action */}
      <div className="absolute bottom-4 right-4 bg-slate-100 p-2.5 rounded-full opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all text-[#4A7C77] hover:bg-[#F6D267] hover:text-slate-900 shadow-sm">
        <ArrowRight size={20} />
      </div>
    </Link>
  );
};
