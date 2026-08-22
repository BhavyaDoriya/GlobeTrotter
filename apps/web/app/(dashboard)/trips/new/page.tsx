"use client";

import React, { useState } from "react";
import { MapPin, Calendar, Sparkles, Navigation, ImageIcon, ArrowRight } from "lucide-react";

// MODULAR COMPONENT: You can extract this to apps/web/components/SuggestionPolaroid.tsx later
const SuggestionPolaroid = ({ delay, rotation }: { delay: string, rotation: string }) => (
  <div 
    className={`group relative bg-white p-3 rounded-2xl shadow-xl border-[6px] border-white cursor-pointer hover:z-50 transition-all duration-500 hover:rotate-0 hover:scale-110 hover:-translate-y-4 ${rotation}`}
    style={{ animationDelay: delay, animation: 'fadeInUp 0.6s ease-out backwards' }}
  >
    {/* Messy Tape */}
    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-5 bg-white/70 backdrop-blur-sm shadow-sm rotate-[-5deg] z-10 transition-transform group-hover:rotate-[2deg]"></div>
    
    <div className="w-full aspect-square rounded-xl overflow-hidden mb-3 bg-slate-100 flex items-center justify-center border-2 border-dashed border-slate-200 group-hover:border-[#F6D267] transition-colors">
      <ImageIcon size={32} className="text-slate-300 group-hover:text-[#F6D267] transition-colors" />
    </div>
    
    <div className="px-1 pb-1">
      <div className="h-4 bg-slate-200 rounded w-3/4 mb-2 group-hover:bg-[#8CBDB9]/40 transition-colors"></div>
      <div className="h-3 bg-slate-100 rounded w-1/2 group-hover:bg-[#E77A64]/40 transition-colors"></div>
    </div>
  </div>
);

export default function CreateTripPage() {
  const [tripName, setTripName] = useState("");
  const [place, setPlace] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  return (
    <div className="min-h-screen bg-[#E5F0EF] text-slate-800 font-sans pb-32 overflow-hidden selection:bg-[#F6D267] selection:text-slate-900 pt-12">
      
      {/* Animated Topography Background */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-30">
        <svg className="absolute w-[150%] h-[150%] animate-[spin_90s_linear_infinite] -top-[25%] -left-[25%]" viewBox="0 0 1000 1000">
          <circle cx="500" cy="500" r="300" fill="none" stroke="#8CBDB9" strokeWidth="2" strokeDasharray="15 15" />
          <path d="M 200 500 Q 500 200 800 500 T 1400 500" fill="none" stroke="#E77A64" strokeWidth="2" strokeDasharray="10 10" opacity="0.5" />
        </svg>
      </div>

      <main className="relative z-10 container mx-auto px-4 lg:px-8 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          
          {/* LEFT COLUMN: The Notepad Form */}
          <div className="w-full lg:w-5/12 perspective-1000">
            <div className="relative bg-[#FFFDF8] p-8 md:p-10 rounded-[2rem] border-4 border-slate-100 shadow-[0_30px_60px_rgba(0,0,0,0.12)] rotate-[-1.5deg] hover:rotate-0 transition-transform duration-500 ease-out">
              
              {/* Top Binding / Clip */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-40 h-8 bg-slate-800 rounded-t-xl shadow-md border-b-4 border-slate-600 flex items-center justify-center gap-4">
                 <div className="w-3 h-3 rounded-full bg-slate-500 shadow-inner"></div>
                 <div className="w-3 h-3 rounded-full bg-slate-500 shadow-inner"></div>
              </div>

              {/* Decorative Compass */}
              <div className="absolute -right-6 -bottom-6 bg-[#F6D267] p-4 rounded-full border-[6px] border-white shadow-xl rotate-12 animate-[bounce_4s_infinite]">
                <Navigation size={28} className="text-slate-800" fill="currentColor" />
              </div>

              <h2 className="text-4xl font-extrabold text-[#4A7C77] mb-8 font-serif tracking-tight mt-4">Draft your <br/><span className="text-[#E77A64] italic underline decoration-[#F6D267] decoration-4 underline-offset-4">Adventure.</span></h2>

              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                
                {/* Trip Name Input */}
                <div className="group">
                  <label className="block text-sm font-black uppercase tracking-widest text-slate-400 mb-2 group-focus-within:text-[#E77A64] transition-colors">Name the Journey</label>
                  <input 
                    type="text" 
                    value={tripName}
                    onChange={(e) => setTripName(e.target.value)}
                    className="w-full px-0 py-2 bg-transparent border-b-4 border-slate-200 focus:border-[#E77A64] focus:outline-none transition-all font-serif text-2xl font-bold text-slate-700 placeholder-slate-300" 
                    placeholder="e.g., Euro Summer '24" 
                  />
                </div>

                {/* Mapbox Stub Input */}
                <div className="group pt-4">
                  <label className="block text-sm font-black uppercase tracking-widest text-slate-400 mb-2 group-focus-within:text-[#8CBDB9] transition-colors">Primary Destination</label>
                  <div className="relative flex items-center">
                    <MapPin className="absolute left-0 text-slate-400 group-focus-within:text-[#8CBDB9] transition-colors" size={24} />
                    <input 
                      type="text" 
                      value={place}
                      onChange={(e) => setPlace(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-transparent border-b-4 border-slate-200 focus:border-[#8CBDB9] focus:outline-none transition-all font-serif text-2xl font-bold text-slate-700 placeholder-slate-300" 
                      placeholder="Search a city..." 
                    />
                    {/* Note for Person B: Replace this input element with Mapbox Geocoder */}
                  </div>
                </div>

                {/* Dates Row */}
                <div className="grid grid-cols-2 gap-8 pt-4">
                  <div className="group">
                    <label className="block text-sm font-black uppercase tracking-widest text-slate-400 mb-2 group-focus-within:text-[#F6D267] transition-colors">Takeoff</label>
                    <div className="relative">
                      <Calendar className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#F6D267] transition-colors" size={20} />
                      <input 
                        type="date" 
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full pl-8 pr-2 py-2 bg-transparent border-b-4 border-slate-200 focus:border-[#F6D267] focus:outline-none transition-all font-bold text-slate-600" 
                      />
                    </div>
                  </div>
                  <div className="group">
                    <label className="block text-sm font-black uppercase tracking-widest text-slate-400 mb-2 group-focus-within:text-[#F6D267] transition-colors">Return</label>
                    <div className="relative">
                      <Calendar className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#F6D267] transition-colors" size={20} />
                      <input 
                        type="date" 
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full pl-8 pr-2 py-2 bg-transparent border-b-4 border-slate-200 focus:border-[#F6D267] focus:outline-none transition-all font-bold text-slate-600" 
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-8">
                  <button className="w-full flex justify-center items-center gap-3 bg-[#4A7C77] hover:bg-[#38605c] text-white text-xl font-black py-5 rounded-2xl shadow-[0_8px_0_#2D4C49] active:shadow-[0_0px_0_#2D4C49] active:translate-y-2 transition-all group">
                    <Sparkles size={24} className="group-hover:rotate-12 transition-transform" /> 
                    Build Itinerary 
                    <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* RIGHT COLUMN: Interactive Corkboard Suggestions */}
          <div className="w-full lg:w-7/12 mt-12 lg:mt-0">
            <div className="flex items-center gap-4 mb-10">
              <h3 className="text-3xl font-black text-[#4A7C77] font-serif">Spark Inspiration</h3>
              <div className="bg-[#E77A64] text-white text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full rotate-3 shadow-md">
                Trending
              </div>
            </div>

            {/* Staggered Polaroid Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-10 pl-2">
              <SuggestionPolaroid rotation="rotate-[3deg]" delay="0ms" />
              <SuggestionPolaroid rotation="rotate-[-4deg] translate-y-6" delay="100ms" />
              <SuggestionPolaroid rotation="rotate-[2deg] -translate-y-4" delay="200ms" />
              <SuggestionPolaroid rotation="rotate-[-2deg] translate-y-2" delay="300ms" />
              <SuggestionPolaroid rotation="rotate-[5deg]" delay="400ms" />
              <SuggestionPolaroid rotation="rotate-[-3deg] translate-y-8" delay="500ms" />
            </div>
            
            {/* Added CSS for the staggered load-in animation */}
            <style>{`
              @keyframes fadeInUp {
                from { opacity: 0; transform: translateY(40px) scale(0.9); }
                to { opacity: 1; transform: translateY(0) scale(1); }
              }
            `}</style>
          </div>

        </div>
      </main>
    </div>
  );
}