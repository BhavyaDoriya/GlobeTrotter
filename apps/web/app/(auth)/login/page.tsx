"use client";

import React, { useState, useEffect } from "react";
import { Plane, Globe2, Map, Camera, Luggage, Heart, Sun, Navigation } from "lucide-react";

export default function IntroAndAuthPage() {
  const [showSplash, setShowSplash] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Start fade out after 3 seconds
    const fadeTimer = setTimeout(() => setFadeOut(true), 3000);
    // Remove splash screen completely after 3.5 seconds
    const removeTimer = setTimeout(() => setShowSplash(false), 3500);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (showSplash) {
    return (
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center bg-[#8CBDB9] transition-all duration-500 ease-in-out ${
          fadeOut ? "opacity-0 scale-110" : "opacity-100 scale-100"
        }`}
      >
        <style>{`
          @keyframes orbit {
            0% { transform: rotate(0deg) translateX(120px) rotate(0deg); }
            100% { transform: rotate(360deg) translateX(120px) rotate(-90deg); }
          }
          .orbit-plane {
            animation: orbit 3s linear infinite;
          }
          @keyframes dash {
            to { stroke-dashoffset: -0; }
          }
        `}</style>

        <div className="relative flex items-center justify-center w-64 h-64">
          {/* Dashed flight path */}
          <svg className="absolute w-full h-full animate-[spin_10s_linear_infinite]" viewBox="0 0 200 200">
            <circle
              cx="100"
              cy="100"
              r="80"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeDasharray="8 8"
              opacity="0.6"
            />
          </svg>

          {/* Sticker Globe */}
          <div className="absolute z-10 p-2 bg-[#8CBDB9] border-[6px] border-white rounded-full shadow-lg">
            <Globe2 size={80} className="text-white" fill="#4A7C77" />
          </div>

          {/* Orbiting Plane Sticker */}
          <div className="absolute z-20 orbit-plane">
            <div className="p-2 bg-[#E77A64] border-4 border-white rounded-full shadow-md rotate-45">
              <Plane size={24} className="text-white" fill="white" />
            </div>
          </div>
          
          <h1 className="absolute -bottom-16 text-3xl font-bold text-white tracking-widest drop-shadow-md">
            GLOBE TROTTER
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E5F0EF] text-slate-800 font-sans overflow-x-hidden selection:bg-[#F6D267] selection:text-slate-900">
      {/* Background Dashed Lines */}
      <svg className="fixed inset-0 w-full h-full pointer-events-none opacity-20" xmlns="http://www.w3.org/2000/svg">
        <path d="M-100,200 Q400,50 800,300 T1600,100" fill="none" stroke="#4A7C77" strokeWidth="3" strokeDasharray="10 10" />
        <path d="M-100,600 Q300,800 900,500 T1800,700" fill="none" stroke="#4A7C77" strokeWidth="3" strokeDasharray="10 10" />
      </svg>

      <div className="flex min-h-screen relative z-10 container mx-auto px-4 lg:px-8">
        
        {/* LEFT COLUMN: Authentication Form (Person A Core Flow) */}
        <div className="w-full lg:w-1/2 flex items-center justify-center py-12">
          {/* Main Scrapbook Card */}
          <div className="relative w-full max-w-md bg-white p-8 md:p-10 rounded-3xl border-8 border-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] rotate-[-1deg] hover:rotate-0 transition-transform duration-300">
            
            {/* Decorative Corner Sticker */}
            <div className="absolute -top-6 -left-6 bg-[#F6D267] p-3 rounded-full border-4 border-white shadow-md rotate-12">
              <Sun size={32} className="text-amber-600" />
            </div>

            <div className="text-center mb-8">
              <h2 className="text-4xl font-extrabold text-[#4A7C77] mb-2 font-serif tracking-tight">Time to Travel</h2>
              <p className="text-slate-500 font-medium">Log in to build your itinerary.</p>
            </div>

            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2" htmlFor="email">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-slate-100 focus:border-[#8CBDB9] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#8CBDB9]/20 transition-all"
                  placeholder="traveler@world.com"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2" htmlFor="password">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-slate-100 focus:border-[#8CBDB9] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#8CBDB9]/20 transition-all"
                  placeholder="••••••••"
                />
              </div>
              
              <div className="flex items-center justify-between mt-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-[#E77A64] focus:ring-[#E77A64]" />
                  <span className="text-sm font-medium text-slate-600">Remember me</span>
                </label>
                <a href="#" className="text-sm font-bold text-[#E77A64] hover:underline hover:text-[#d66752]">
                  Forgot password?
                </a>
              </div>

              <button className="w-full mt-6 bg-[#E77A64] hover:bg-[#d66752] text-white text-lg font-bold py-4 rounded-2xl shadow-[0_8px_0_#b55140] active:shadow-[0_0px_0_#b55140] active:translate-y-2 transition-all">
                Let's Go! ✈️
              </button>
            </form>

            <div className="mt-8 text-center text-slate-500 font-medium">
              Don't have an account? <a href="#" className="text-[#4A7C77] font-bold hover:underline">Sign up</a>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Desktop Scrapbook Collage (Hidden on Mobile) */}
        <div className="hidden lg:flex w-1/2 relative items-center justify-center perspective-1000">
          <div className="relative w-[500px] h-[500px]">
            {/* Center Yellow Circle Background */}
            <div className="absolute inset-0 m-auto w-96 h-96 bg-[#F6D267] rounded-full shadow-inner opacity-90"></div>

            {/* Sticker 1: Camera */}
            <div className="absolute top-10 left-10 bg-[#8CBDB9] p-4 rounded-2xl border-[6px] border-white shadow-xl rotate-[-15deg] hover:rotate-[-5deg] hover:scale-110 transition-all duration-300 cursor-pointer">
              <Camera size={64} className="text-white" fill="white" />
            </div>

            {/* Sticker 2: Map */}
            <div className="absolute bottom-20 left-4 bg-[#E77A64] p-3 rounded-xl border-[6px] border-white shadow-xl rotate-[10deg] hover:rotate-[0deg] hover:scale-110 transition-all duration-300 cursor-pointer">
              <Map size={48} className="text-white" />
            </div>

            {/* Sticker 3: Suitcase */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#4A7C77] p-6 rounded-3xl border-[8px] border-white shadow-2xl rotate-3 z-20">
              <Luggage size={100} className="text-white" fill="white" />
            </div>


            {/* Sticker 5: Location Pin */}
            <div className="absolute bottom-32 right-10 bg-red-500 p-3 rounded-full border-[5px] border-white shadow-xl rotate-[-12deg] hover:scale-110 transition-all z-30">
              <Navigation size={32} className="text-white" fill="white" />
            </div>
            
            {/* Tiny Deco Stickers */}
            <div className="absolute top-0 right-1/3 bg-white p-2 rounded-full shadow-sm rotate-45">
              <Heart size={20} className="text-pink-400" fill="#f472b6" />
            </div>
            <div className="absolute bottom-10 left-1/3 bg-white p-2 rounded-full shadow-sm -rotate-12">
               <span className="text-2xl">🌴</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}