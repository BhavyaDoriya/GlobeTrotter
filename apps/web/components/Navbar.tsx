"use client";

import React, { useState } from "react";
import { Search, SlidersHorizontal, Plus, Plane } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <>
      <nav className="relative z-50 pt-6 px-4">
        <div className="container mx-auto">
          <div className="bg-white/80 backdrop-blur-xl border-4 border-white shadow-[0_10px_30px_rgba(0,0,0,0.05)] rounded-full px-6 py-3 flex flex-col md:flex-row items-center justify-between gap-4 transition-all hover:shadow-[0_15px_40px_rgba(0,0,0,0.08)]">
            
            <Link href="/" className="flex items-center gap-3 cursor-pointer group">
              <div className="bg-[#E77A64] p-2 rounded-full shadow-inner group-hover:rotate-180 transition-transform duration-700">
                <Plane size={20} className="text-white" fill="white" />
              </div>
              <h1 className="text-2xl font-serif font-black text-[#4A7C77] tracking-tighter group-hover:text-[#E77A64] transition-colors">GlobeTrotter</h1>
            </Link>
            
            <div className="flex w-full md:w-auto items-center gap-3">
              <div className="relative group flex-1 md:w-96">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4A7C77] group-focus-within:text-[#E77A64] transition-colors" size={20} />
                <input 
                  type="text" 
                  placeholder="Where is your next adventure?" 
                  className="w-full pl-12 pr-4 py-3 rounded-full bg-slate-100/50 border-2 border-transparent focus:bg-white focus:border-[#F6D267] focus:outline-none focus:ring-4 focus:ring-[#F6D267]/20 transition-all font-bold text-slate-700 placeholder-slate-400"
                />
              </div>
              
              <div className="relative">
                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className={`p-3 rounded-full border-4 shadow-sm transition-all ${showFilters ? 'bg-[#F6D267] border-white text-slate-900 rotate-12' : 'bg-slate-100 border-transparent text-[#4A7C77] hover:bg-[#F6D267] hover:text-slate-900 hover:rotate-12'}`}
                >
                  <SlidersHorizontal size={20} />
                </button>

                {showFilters && (
                  <div className="absolute right-0 top-16 w-72 bg-[#FFFDF8] border-4 border-white shadow-[0_20px_40px_rgba(0,0,0,0.1)] rounded-2xl p-5 z-50 origin-top-right animate-in fade-in zoom-in duration-200">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-4 bg-white/80 backdrop-blur-md shadow-sm rotate-2 border-b border-slate-200"></div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-black uppercase tracking-widest text-[#4A7C77] mb-2 block">Sort By</label>
                        <select className="w-full bg-slate-100 text-slate-700 font-bold p-2 rounded-lg outline-none border-2 border-transparent focus:border-[#F6D267] cursor-pointer">
                          <option>Latest First</option>
                          <option>Upcoming Dates</option>
                          <option>Budget (Low to High)</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-black uppercase tracking-widest text-[#4A7C77] mb-2 block">Group By</label>
                        <select className="w-full bg-slate-100 text-slate-700 font-bold p-2 rounded-lg outline-none border-2 border-transparent focus:border-[#F6D267] cursor-pointer">
                          <option>None</option>
                          <option>Status</option>
                          <option>Region</option>
                        </select>
                      </div>
                      <button 
                        onClick={() => setShowFilters(false)}
                        className="w-full mt-2 bg-[#4A7C77] hover:bg-[#38605c] text-white font-bold py-2 rounded-xl transition-colors"
                      >
                        Apply View
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* FIXED FLOATING ACTION BUTTON TO CREATE A NEW TRIP */}
      <Link href="/trips/new" className="fixed bottom-10 right-10 z-[100] flex items-center gap-3 bg-[#E77A64] hover:bg-[#d66752] text-white text-xl font-black py-4 px-8 rounded-full border-4 border-white shadow-[0_10px_20px_rgba(231,122,100,0.4)] hover:shadow-[0_15px_30px_rgba(231,122,100,0.6)] hover:-translate-y-2 transition-all duration-300 group">
        <Plus size={28} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-300" /> Plan a Trip
      </Link>
    </>
  );
}