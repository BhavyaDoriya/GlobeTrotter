"use client";

import React from "react";
import Link from "next/link";
import { Calendar as CalendarIcon, Map, Compass } from "lucide-react";

export default function TripCalendarPage() {
  return (
    <div className="min-h-screen bg-[#E5F0EF] flex items-center justify-center p-8">
      <div className="bg-[#FFFDF8] p-12 rounded-[2rem] border-4 border-white shadow-xl text-center max-w-2xl w-full rotate-[1deg]">
        <CalendarIcon size={48} className="text-[#E77A64] mx-auto mb-6" />
        <h1 className="text-4xl font-black text-[#4A7C77] font-serif mb-4">Trip Calendar</h1>
        <p className="text-slate-500 font-medium mb-8 text-lg">
          This is where Person B will integrate react-big-calendar!
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/trips/1/view" className="bg-[#4A7C77] hover:bg-[#38605c] text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md">
            Go to View Page
          </Link>
          <Link href="/trips/1/build" className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-6 rounded-xl transition-all shadow-sm">
            Go to Builder
          </Link>
        </div>
      </div>
    </div>
  );
}
