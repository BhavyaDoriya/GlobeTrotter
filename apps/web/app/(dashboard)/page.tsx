"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, SlidersHorizontal, MapPin, Calendar, Plus, Plane, Compass, Camera, Heart, ChevronDown } from "lucide-react";

export default function DashboardPage() {
  // State to handle the interactive filter dropdown
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="min-h-screen bg-[#E5F0EF] text-slate-800 font-sans pb-32 overflow-hidden selection:bg-[#F6D267] selection:text-slate-900">
      
      {/* Animated Background Topography / Flight Paths */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-30">
        <svg className="absolute w-[200%] h-[200%] animate-[spin_120s_linear_infinite] -top-[50%] -left-[50%]" viewBox="0 0 1000 1000">
          <circle cx="500" cy="500" r="300" fill="none" stroke="#8CBDB9" strokeWidth="2" strokeDasharray="15 15" />
          <circle cx="500" cy="500" r="450" fill="none" stroke="#8CBDB9" strokeWidth="2" strokeDasharray="10 20" />
        </svg>
      </div>

      {/* Floating Background Stickers */}
      <div className="fixed top-20 right-10 animate-[bounce_6s_infinite] opacity-50 z-0">
        <Compass size={64} className="text-[#8CBDB9]" />
      </div>
      <div className="fixed bottom-40 left-10 animate-[bounce_8s_infinite] opacity-50 z-0 delay-150">
        <Camera size={48} className="text-[#E77A64] rotate-12" />
      </div>

      

      <main className="relative z-10 container mx-auto px-4 lg:px-8 mt-12">
        
        {/* ASYMMETRICAL HERO SECTION */}
        <section className="relative flex flex-col lg:flex-row items-center gap-12 mb-24">
          
          <div className="lg:w-1/3 space-y-6 relative z-20">
            <div className="inline-block bg-[#F6D267] px-4 py-2 rounded-lg font-black text-sm uppercase tracking-widest text-slate-800 rotate-[-3deg] border-2 border-white shadow-sm">
              Featured Spot
            </div>
            <h2 className="text-5xl lg:text-7xl font-serif font-black text-[#4A7C77] leading-none tracking-tight">
              Get lost in <br />
              <span className="text-[#E77A64] italic decoration-[#F6D267] underline decoration-8 underline-offset-4">Paris.</span>
            </h2>
            <p className="text-lg text-slate-600 font-medium">
              Cobblestone streets, midnight espresso, and a scrapbook waiting to be filled.
            </p>
          </div>

          <div className="lg:w-2/3 relative group perspective-1000">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-32 h-10 bg-white/70 backdrop-blur-md border border-white/50 shadow-md rotate-[-2deg] z-30 transition-transform group-hover:rotate-0"></div>
            
            <div className="bg-white p-4 md:p-6 pb-12 md:pb-16 rounded-xl border-4 border-slate-100 shadow-[0_30px_60px_rgba(0,0,0,0.15)] rotate-[2deg] group-hover:rotate-0 group-hover:scale-[1.02] transition-all duration-500 ease-out">
              <div className="relative w-full h-[300px] md:h-[450px] rounded-lg overflow-hidden bg-slate-200">
                <img 
                  src="https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=80" 
                  alt="Paris" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                />
                <div className="absolute top-4 right-4 bg-white/90 p-3 rounded-full shadow-lg cursor-pointer hover:bg-[#E77A64] hover:text-white transition-colors text-[#4A7C77]">
                  <Heart size={24} fill="currentColor" />
                </div>
              </div>
              <div className="absolute bottom-4 left-8 font-serif text-3xl font-bold text-slate-800 rotate-[-2deg] opacity-80">
                Summer '24
              </div>
            </div>
          </div>
        </section>

        {/* STAGGERED MASONRY FOR REGIONS */}
        <section className="mb-24">
          <div className="flex items-center gap-4 mb-10">
            <h3 className="text-3xl font-extrabold text-[#4A7C77] font-serif">Explore Regions</h3>
            <div className="flex-1 h-1 bg-gradient-to-r from-[#8CBDB9] to-transparent rounded-full opacity-30"></div>
          </div>
          
          <div className="flex flex-wrap justify-center lg:justify-start gap-8 px-4">
            {[
              { city: "Kyoto", country: "Japan", img: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80", style: "rotate-[-4deg] translate-y-4" },
              { city: "Santorini", country: "Greece", img: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?auto=format&fit=crop&q=80", style: "rotate-[3deg] -translate-y-2 z-10" },
              { city: "Banff", country: "Canada", img: "https://images.unsplash.com/photo-1600298882283-40b4dcb8b211?auto=format&fit=crop&q=80", style: "rotate-[-1deg] translate-y-6" },
              { city: "Bali", country: "Indonesia", img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80", style: "rotate-[5deg] translate-y-1" },
            ].map((place, i) => (
              <div key={i} className={`group relative w-64 bg-white p-3 rounded-2xl shadow-xl border-[6px] border-white cursor-pointer hover:z-50 transition-all duration-300 hover:rotate-0 hover:scale-110 hover:-translate-y-4 ${place.style}`}>
                <div className="absolute -top-3 right-4 w-12 h-5 bg-white/80 backdrop-blur-sm shadow-sm rotate-[15deg]"></div>
                <div className="w-full h-48 rounded-xl overflow-hidden mb-4">
                  <img src={place.img} alt={place.city} className="w-full h-full object-cover" />
                </div>
                <div className="px-2 pb-2">
                  <h4 className="text-xl font-bold text-slate-800 font-serif leading-tight">{place.city}</h4>
                  <p className="text-[#E77A64] text-sm font-bold flex items-center gap-1 mt-1">
                    <MapPin size={14} /> {place.country}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* TICKET STUB STYLE FOR PREVIOUS TRIPS */}
        <section>
          <h3 className="text-3xl font-extrabold text-[#4A7C77] font-serif mb-10">Your Travel Log</h3>
          
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Ticket 1 */}
            <div className="group relative flex w-full max-w-2xl bg-[#FFFDF8] rounded-3xl overflow-hidden shadow-[0_15px_35px_rgba(0,0,0,0.05)] border-4 border-white hover:-translate-y-2 transition-all duration-300">
              <div className="w-6 bg-[#E77A64]"></div>
              <div className="flex-1 p-6 relative">
                <Plane size={120} className="absolute right-[-20px] bottom-[-20px] text-slate-100 rotate-[-15deg] pointer-events-none" />
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h4 className="text-2xl font-bold font-serif text-slate-800">Nordic Adventure</h4>
                    <div className="flex items-center gap-2 text-sm font-bold text-[#8CBDB9] mt-2">
                      <Calendar size={16} /> Aug 10 - Aug 18
                    </div>
                  </div>
                  <div className="bg-slate-800 text-white text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-md rotate-3 group-hover:rotate-6 transition-transform">
                    Completed
                  </div>
                </div>
                
                <div className="flex items-center gap-2 mb-6">
                  <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg text-sm font-bold">Helsinki</span>
                  <span className="text-slate-300">→</span>
                  <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg text-sm font-bold">Turku</span>
                  <span className="text-slate-300">→</span>
                  <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg text-sm font-bold">Rovaniemi</span>
                </div>
                
                <Link href="/trips/1/view" className="inline-block text-center w-full md:w-auto px-6 py-3 bg-[#4A7C77] hover:bg-[#38605c] text-white font-bold rounded-xl transition-colors shadow-md">
                  Open Scrapbook
                </Link>
              </div>
            </div>

            {/* Ticket 2 */}
            <div className="group relative flex w-full max-w-2xl bg-[#FFFDF8] rounded-3xl overflow-hidden shadow-[0_15px_35px_rgba(0,0,0,0.05)] border-4 border-white hover:-translate-y-2 transition-all duration-300">
              <div className="w-6 bg-[#F6D267]"></div>
              <div className="flex-1 p-6 relative">
                <Plane size={120} className="absolute right-[-20px] bottom-[-20px] text-slate-100 rotate-[-15deg] pointer-events-none" />
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h4 className="text-2xl font-bold font-serif text-slate-800">Dutch Windmills</h4>
                    <div className="flex items-center gap-2 text-sm font-bold text-[#8CBDB9] mt-2">
                      <Calendar size={16} /> Sep 05 - Sep 12
                    </div>
                  </div>
                  <div className="bg-slate-800 text-white text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-md rotate-[-2deg] group-hover:rotate-[-6deg] transition-transform">
                    Completed
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-6 flex-wrap">
                  <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg text-sm font-bold">Kinderdijk</span>
                  <span className="text-slate-300">→</span>
                  <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg text-sm font-bold">Zaanse Schans</span>
                </div>
                <Link href="/trips/2/view" className="inline-block text-center w-full md:w-auto px-6 py-3 bg-[#4A7C77] hover:bg-[#38605c] text-white font-bold rounded-xl transition-colors shadow-md">
                  Open Scrapbook
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

    </div>
  );
}