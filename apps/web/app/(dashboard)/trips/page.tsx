"use client";

import React from "react";
import { Search, SlidersHorizontal, Plane } from "lucide-react";
import { TripCard } from "@/components/TripCard";

export default function MyTripsPage() {
  return (
    <div className="min-h-screen bg-[#F0EDE6] text-[#0D0D0D] font-sans pb-32 overflow-hidden pt-8">
      <main className="relative z-10 container mx-auto px-4 lg:px-8 max-w-7xl">
        
        {/* HEADER & SEARCH TOOLBAR */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl sm:text-5xl font-black text-[#0D0D0D] tracking-tight mb-2">My Travel Log</h1>
            <p className="text-base font-bold text-[#0D0D0D]/60" style={{ fontFamily: "var(--font-mono)" }}>Your past, present, and future adventures.</p>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative group flex-1 md:w-72">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0D0D0D]/50" size={18} />
              <input 
                type="text" 
                placeholder="Search trips..." 
                className="nb-input pl-11"
              />
            </div>
            <button className="nb-btn nb-btn-yellow p-3">
              <SlidersHorizontal size={18} />
            </button>
          </div>
        </div>

        {/* ONGOING SECTION */}
        <section className="mb-16">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-[#E77A64] p-2 rounded-md text-white border border-[#0D0D0D] shadow-[2px_2px_0px_#0D0D0D] animate-pulse">
              <Plane size={20} />
            </div>
            <h2 className="text-2xl font-black text-[#0D0D0D]">Currently Exploring</h2>
            <div className="flex-1 h-0.5 bg-[#0D0D0D]/20"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <TripCard 
              title="Euro Summer '24"
              route="Paris → Rome → Amalfi"
              dates="Aug 15 - Sep 02, 2024"
              image="https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=80"
              status="ongoing"
              rotation="rotate-[-1deg]"
            />
          </div>
        </section>

        {/* UPCOMING SECTION */}
        <section className="mb-16">
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-2xl font-black text-[#0D0D0D]">Up-coming</h2>
            <div className="flex-1 h-0.5 bg-[#0D0D0D]/20"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <TripCard 
              title="Tokyo Drift"
              route="Tokyo → Kyoto → Osaka"
              dates="Nov 10 - Nov 24, 2024"
              image="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80"
              status="upcoming"
              rotation="rotate-[2deg]"
            />
            <TripCard 
              title="Winter in the Rockies"
              route="Banff → Jasper"
              dates="Dec 15 - Dec 22, 2024"
              image="https://images.unsplash.com/photo-1600298882283-40b4dcb8b211?auto=format&fit=crop&q=80"
              status="upcoming"
              rotation="rotate-[-2deg]"
            />
          </div>
        </section>

        {/* COMPLETED SECTION */}
        <section>
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-2xl font-black text-[#0D0D0D]/70">Completed</h2>
            <div className="flex-1 h-0.5 bg-[#0D0D0D]/20"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 opacity-90">
            <TripCard 
              title="Nordic Adventure"
              route="Helsinki → Rovaniemi"
              dates="Jan 05 - Jan 14, 2024"
              image="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80"
              status="completed"
              rotation="rotate-[3deg]"
            />
            <TripCard 
              title="Dutch Windmills"
              route="Amsterdam → Rotterdam"
              dates="Sep 05 - Sep 12, 2023"
              image="https://images.unsplash.com/photo-1517487224203-0302b130e5d0?auto=format&fit=crop&q=80"
              status="completed"
              rotation="rotate-[-3deg]"
            />
            <TripCard 
              title="Bali Retreat"
              route="Ubud → Canggu"
              dates="May 10 - May 20, 2023"
              image="https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80"
              status="completed"
              rotation="rotate-[1deg]"
            />
          </div>
        </section>

      </main>
    </div>
  );
}