"use client";

import React, { useState } from "react";
import { 
  MapPin, Calendar, Clock, DollarSign, Image as ImageIcon, 
  ChevronRight, Compass, Camera, Heart, Navigation, Plane 
} from "lucide-react";
import Link from "next/link";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend
} from "recharts";

// Mock data for the budget breakdown
const budgetData = [
  { name: "Flights", value: 850, color: "#8CBDB9" },
  { name: "Accommodation", value: 1200, color: "#F6D267" },
  { name: "Food & Dining", value: 600, color: "#E77A64" },
  { name: "Activities", value: 450, color: "#4A7C77" },
];

export default function TripViewPage() {
  const [activeDay, setActiveDay] = useState(1);

  return (
    <div className="min-h-screen bg-[#E5F0EF] text-slate-800 font-sans pb-32 overflow-hidden selection:bg-[#F6D267] selection:text-slate-900 pt-8">
      
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-30">
        <svg className="absolute w-[150%] h-[150%] animate-[spin_120s_linear_infinite] -top-[25%] -left-[25%]" viewBox="0 0 1000 1000">
          <circle cx="500" cy="500" r="400" fill="none" stroke="#8CBDB9" strokeWidth="2" strokeDasharray="20 20" />
        </svg>
      </div>

      <main className="relative z-10 container mx-auto px-4 lg:px-8 max-w-7xl">
        
        {/* TOP HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <div className="inline-block bg-[#F6D267] px-4 py-1 rounded-full font-black text-xs uppercase tracking-widest text-slate-800 shadow-sm mb-3">
              European Summer
            </div>
            <h1 className="text-5xl font-black text-[#4A7C77] font-serif tracking-tight mb-2 flex items-center gap-4">
              Paris & Beyond <Plane size={32} className="text-[#E77A64] rotate-45" />
            </h1>
            <p className="text-lg font-bold text-slate-500 flex items-center gap-2">
              <Calendar size={18} /> Aug 15 - Sep 02, 2024
            </p>
          </div>
          
          <div className="flex gap-3">
            <Link 
              href="/trips/1/calendar" 
              className="bg-white hover:bg-slate-50 text-slate-600 font-bold py-3 px-6 rounded-xl border-4 border-white shadow-sm hover:shadow-md transition-all flex items-center gap-2"
            >
              <Calendar size={20} /> View Calendar
            </Link>
            <Link 
              href="/trips/1/build" 
              className="bg-[#4A7C77] hover:bg-[#38605c] text-white font-bold py-3 px-6 rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              Edit Itinerary
            </Link>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 items-start">
          
          {/* LEFT COLUMN: ITINERARY TIMELINE */}
          <div className="w-full lg:w-7/12">
            
            {/* Day Selector Navigation */}
            <div className="flex gap-4 overflow-x-auto pb-4 mb-8 snap-x no-scrollbar">
              {[1, 2, 3, 4, 5].map((day) => (
                <button 
                  key={day}
                  onClick={() => setActiveDay(day)}
                  className={`snap-center shrink-0 min-w-[100px] py-4 rounded-2xl font-bold flex flex-col items-center justify-center border-4 transition-all ${
                    activeDay === day 
                      ? 'bg-[#E77A64] border-[#E77A64] text-white shadow-lg scale-105' 
                      : 'bg-white border-white text-slate-500 hover:border-slate-200 shadow-sm'
                  }`}
                >
                  <span className="text-xs uppercase tracking-widest mb-1 opacity-80">Day</span>
                  <span className="text-2xl font-black">{day}</span>
                </button>
              ))}
            </div>

            {/* Timeline Events */}
            <div className="bg-[#FFFDF8] rounded-[2rem] p-8 border-4 border-white shadow-[0_20px_40px_rgba(0,0,0,0.08)] relative">
              <div className="absolute top-0 bottom-0 left-12 w-1 bg-slate-200"></div>

              {/* Event 1 */}
              <div className="relative pl-16 py-6 group">
                <div className="absolute left-[41px] top-8 w-4 h-4 rounded-full bg-[#E77A64] border-4 border-[#FFFDF8] shadow-sm z-10 group-hover:scale-150 transition-transform"></div>
                <div className="text-sm font-bold text-slate-400 mb-1 flex items-center gap-2">
                  <Clock size={14} /> 09:00 AM
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-sm border-2 border-slate-50 group-hover:border-[#E77A64] transition-colors">
                  <h3 className="text-xl font-bold text-[#4A7C77] font-serif mb-2">Eiffel Tower Tour</h3>
                  <p className="text-slate-600 text-sm font-medium leading-relaxed mb-4">
                    Early access tickets to skip the line. Don't forget the camera!
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-slate-100 text-slate-500 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1">
                      <MapPin size={12} /> Champ de Mars
                    </span>
                    <span className="bg-slate-100 text-slate-500 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1">
                      <DollarSign size={12} /> $45.00
                    </span>
                  </div>
                </div>
              </div>

              {/* Event 2 */}
              <div className="relative pl-16 py-6 group">
                <div className="absolute left-[41px] top-8 w-4 h-4 rounded-full bg-[#F6D267] border-4 border-[#FFFDF8] shadow-sm z-10 group-hover:scale-150 transition-transform"></div>
                <div className="text-sm font-bold text-slate-400 mb-1 flex items-center gap-2">
                  <Clock size={14} /> 12:30 PM
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-sm border-2 border-slate-50 group-hover:border-[#F6D267] transition-colors flex gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-[#4A7C77] font-serif mb-2">Lunch at Le Jules Verne</h3>
                    <p className="text-slate-600 text-sm font-medium leading-relaxed mb-4">
                      Reservation confirmed. Dress code is smart casual.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-slate-100 text-slate-500 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1">
                        <MapPin size={12} /> Eiffel Tower (2nd Floor)
                      </span>
                      <span className="bg-slate-100 text-slate-500 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1">
                        <DollarSign size={12} /> $120.00
                      </span>
                    </div>
                  </div>
                  <div className="w-24 h-24 rounded-xl overflow-hidden bg-slate-200 hidden md:block border-4 border-white shadow-sm rotate-3">
                     <img src="https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&q=80" alt="Lunch" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>

              {/* Event 3 */}
              <div className="relative pl-16 py-6 group">
                <div className="absolute left-[41px] top-8 w-4 h-4 rounded-full bg-[#8CBDB9] border-4 border-[#FFFDF8] shadow-sm z-10 group-hover:scale-150 transition-transform"></div>
                <div className="text-sm font-bold text-slate-400 mb-1 flex items-center gap-2">
                  <Clock size={14} /> 03:00 PM
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-sm border-2 border-slate-50 group-hover:border-[#8CBDB9] transition-colors">
                  <h3 className="text-xl font-bold text-[#4A7C77] font-serif mb-2">Louvre Museum</h3>
                  <p className="text-slate-600 text-sm font-medium leading-relaxed mb-4">
                    Focus on the Denon wing to see the Mona Lisa and Winged Victory.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-slate-100 text-slate-500 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1">
                      <MapPin size={12} /> Rue de Rivoli
                    </span>
                    <span className="bg-slate-100 text-slate-500 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1">
                      <DollarSign size={12} /> $20.00
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: BUDGET & MAP STUBS */}
          <div className="w-full lg:w-5/12 space-y-8">
            
            {/* Map Polaroid */}
            <div className="relative bg-white p-4 pb-12 rounded-2xl shadow-xl border-4 border-white rotate-2 hover:rotate-0 transition-transform duration-500 z-10">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-16 h-6 bg-white/80 backdrop-blur-md shadow-sm rotate-[-2deg] border-b border-slate-200 z-20"></div>
              
              <div className="w-full h-64 bg-slate-200 rounded-xl overflow-hidden relative flex items-center justify-center">
                 {/* Mapbox will go here */}
                 <div className="absolute inset-0 opacity-40 mix-blend-multiply" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")' }}></div>
                 <div className="text-center z-10 flex flex-col items-center">
                   <Compass size={40} className="text-slate-400 mb-2 opacity-50" />
                   <span className="font-bold text-slate-500 font-serif text-xl">Map View</span>
                 </div>
                 
                 {/* Decorative Map Pins */}
                 <div className="absolute top-1/4 left-1/3 bg-[#E77A64] p-1.5 rounded-full shadow-lg border-2 border-white animate-bounce"><div className="w-2 h-2 bg-white rounded-full"></div></div>
                 <div className="absolute top-1/2 right-1/4 bg-[#8CBDB9] p-1.5 rounded-full shadow-lg border-2 border-white"><div className="w-2 h-2 bg-white rounded-full"></div></div>
              </div>
              <div className="absolute bottom-4 left-4 font-serif text-xl font-bold text-slate-700">Route Map</div>
            </div>

            {/* Budget Breakdown */}
            <div className="relative bg-[#FFFDF8] p-8 rounded-[2rem] border-4 border-white shadow-[0_20px_40px_rgba(0,0,0,0.05)] rotate-[-1deg]">
              <h3 className="text-2xl font-black text-[#4A7C77] font-serif mb-6 flex items-center gap-3">
                <DollarSign size={24} className="text-[#F6D267]" /> Budget Breakdown
              </h3>
              
              <div className="h-[250px] w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={budgetData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {budgetData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', fontWeight: 'bold' }}
                      itemStyle={{ color: '#4A7C77' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                {/* Center Total */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-xs font-black uppercase tracking-widest text-slate-400">Total</span>
                  <span className="text-2xl font-black text-slate-800">$3,100</span>
                </div>
              </div>

              <div className="space-y-4 mt-6">
                {budgetData.map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: item.color }}></div>
                      <span className="font-bold text-slate-600">{item.name}</span>
                    </div>
                    <span className="font-black text-slate-800">${item.value}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
