"use client";

import React, { useState } from "react";
import { MapPin, Mail, Phone, Edit3, Camera, Map, CheckCircle2, Ticket, Compass } from "lucide-react";

import Link from "next/link";

// (Stubbing the TripCard here so the file runs stand-alone, 
// but in reality you'd import this from your components folder!)
const ProfileTripCard = ({ id = 'demo-trip-1', title, route, image, status, rotation }: any) => (
  <Link href={`/trips/${id}/view`} className={`block group relative bg-white p-3 rounded-2xl shadow-lg border-[4px] border-white cursor-pointer hover:z-50 transition-all duration-300 hover:rotate-0 hover:scale-105 hover:-translate-y-2 ${rotation}`}>
    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-5 bg-white/80 backdrop-blur-md shadow-sm rotate-[3deg] z-10 transition-transform group-hover:rotate-[-2deg]"></div>
    <div className="relative w-full h-40 rounded-xl overflow-hidden mb-3 bg-slate-100">
      <img src={image} alt={title} className={`w-full h-full object-cover transition-transform duration-700 ${status === 'completed' ? 'grayscale-[30%]' : 'group-hover:scale-110'}`} />
    </div>
    <div className="px-1">
      <h4 className="text-lg font-bold text-slate-800 font-serif leading-tight">{title}</h4>
      <p className="text-slate-500 text-xs font-bold flex items-center gap-1 mt-1">
        <MapPin size={12} className={status === 'completed' ? 'text-slate-400' : 'text-[#E77A64]'} /> {route}
      </p>
    </div>
  </Link>
);

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="min-h-screen bg-[#E5F0EF] text-slate-800 font-sans pb-32 overflow-hidden selection:bg-[#F6D267] selection:text-slate-900 pt-8">
      
      {/* Animated Topography Background */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-30">
        <svg className="absolute w-[150%] h-[150%] animate-[spin_100s_linear_infinite_reverse] -top-[25%] -left-[25%]" viewBox="0 0 1000 1000">
          <circle cx="500" cy="500" r="350" fill="none" stroke="#8CBDB9" strokeWidth="2" strokeDasharray="10 30" />
        </svg>
      </div>

      <main className="relative z-10 container mx-auto px-4 lg:px-8 max-w-6xl">
        
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          
          {/* LEFT COLUMN: Passport / ID Card */}
          <div className="w-full lg:w-1/3 perspective-1000">
            <div className="relative bg-[#FFFDF8] p-8 rounded-[2rem] border-4 border-slate-100 shadow-[0_30px_60px_rgba(0,0,0,0.12)] rotate-[-2deg] transition-transform duration-500 hover:rotate-0">
              
              {/* Top Clip */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-32 h-8 bg-[#E77A64] rounded-t-xl shadow-md flex items-center justify-center gap-3">
                 <div className="w-2 h-2 rounded-full bg-black/20 shadow-inner"></div>
                 <div className="w-2 h-2 rounded-full bg-black/20 shadow-inner"></div>
              </div>

              {/* Edit Button */}
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className="absolute top-6 right-6 p-2 bg-slate-100 hover:bg-[#F6D267] text-slate-600 hover:text-slate-900 rounded-full transition-colors z-20 shadow-sm"
              >
                <Edit3 size={20} />
              </button>

              <div className="flex flex-col items-center text-center mt-6">
                {/* Avatar Polaroid */}
                <div className="relative bg-white p-2 rounded-xl shadow-lg border-2 border-slate-100 rotate-3 mb-6 group cursor-pointer">
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#8CBDB9] rounded-full border-2 border-white flex items-center justify-center shadow-md z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera size={14} className="text-white" />
                  </div>
                  <div className="w-32 h-32 rounded-lg overflow-hidden bg-slate-200">
                    <img 
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80" 
                      alt="User Avatar" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <h2 className="text-3xl font-black text-[#4A7C77] font-serif tracking-tight">Bhavya Doriya</h2>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-1 bg-slate-100 px-3 py-1 rounded-full">Explorer</p>
              </div>

              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-4 text-slate-600 font-medium p-3 bg-white rounded-xl shadow-sm border-2 border-slate-50 group hover:border-[#8CBDB9] transition-colors">
                  <MapPin size={20} className="text-[#8CBDB9] group-hover:scale-110 transition-transform" />
                  {isEditing ? (
                    <input type="text" defaultValue="Ahmedabad, Gujarat, India" className="w-full bg-transparent focus:outline-none text-slate-800 font-bold" />
                  ) : (
                    <span>Ahmedabad, Gujarat, India</span>
                  )}
                </div>

                <div className="flex items-center gap-4 text-slate-600 font-medium p-3 bg-white rounded-xl shadow-sm border-2 border-slate-50 group hover:border-[#F6D267] transition-colors">
                  <Mail size={20} className="text-[#F6D267] group-hover:scale-110 transition-transform" />
                  {isEditing ? (
                    <input type="email" defaultValue="bhavyadoriya2007@gmail.com" className="w-full bg-transparent focus:outline-none text-slate-800 font-bold" />
                  ) : (
                    <span className="truncate">bhavyadoriya2007@gmail.com</span>
                  )}
                </div>

                <div className="flex items-center gap-4 text-slate-600 font-medium p-3 bg-white rounded-xl shadow-sm border-2 border-slate-50 group hover:border-[#E77A64] transition-colors">
                  <Phone size={20} className="text-[#E77A64] group-hover:scale-110 transition-transform" />
                  {isEditing ? (
                    <input type="text" defaultValue="+91 98765 43210" className="w-full bg-transparent focus:outline-none text-slate-800 font-bold" />
                  ) : (
                    <span>+91 98765 43210</span>
                  )}
                </div>

                <div className="pt-4">
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Travel Bio</label>
                  {isEditing ? (
                    <textarea 
                      className="w-full bg-white p-3 rounded-xl shadow-sm border-2 border-slate-100 focus:border-[#4A7C77] focus:outline-none text-slate-700 font-medium resize-none" 
                      rows={3}
                      defaultValue="Full-stack dev surviving on caffeine. Always looking for the next hackathon or the perfect mountain trail."
                    />
                  ) : (
                    <p className="text-sm text-slate-600 leading-relaxed p-3 bg-slate-50 rounded-xl italic">
                      "Full-stack dev surviving on caffeine. Always looking for the next hackathon or the perfect mountain trail."
                    </p>
                  )}
                </div>
                
                {isEditing && (
                  <button onClick={() => setIsEditing(false)} className="w-full mt-4 bg-[#4A7C77] hover:bg-[#38605c] text-white font-bold py-3 rounded-xl shadow-md transition-colors">
                    Save Details
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: The Corkboard Grid */}
          <div className="w-full lg:w-2/3">
            
            {/* Preplanned Trips */}
            <div className="mb-16">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-[#F6D267] p-2 rounded-lg shadow-sm rotate-3"><Ticket size={20} className="text-slate-800" /></div>
                <h3 className="text-3xl font-black text-[#4A7C77] font-serif">Preplanned Trips</h3>
                <div className="flex-1 h-1 bg-gradient-to-r from-[#F6D267] to-transparent rounded-full ml-2 opacity-50"></div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                <ProfileTripCard 
                  title="Tokyo Drift" 
                  route="Japan" 
                  image="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80" 
                  status="upcoming" 
                  rotation="rotate-[2deg]" 
                />
                <ProfileTripCard 
                  title="Winter Rockies" 
                  route="Canada" 
                  image="https://images.unsplash.com/photo-1600298882283-40b4dcb8b211?auto=format&fit=crop&q=80" 
                  status="upcoming" 
                  rotation="rotate-[-2deg]" 
                />
                
                {/* "Plan another" placeholder polaroid */}
                <Link href="/trips/new" className="block group relative bg-slate-100/50 p-3 rounded-2xl border-4 border-dashed border-slate-300 cursor-pointer hover:border-[#8CBDB9] hover:bg-white transition-all duration-300 flex flex-col items-center justify-center min-h-[220px] rotate-1">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform mb-3">
                    <Compass size={24} className="text-[#8CBDB9]" />
                  </div>
                  <p className="font-bold text-slate-500 group-hover:text-[#8CBDB9] transition-colors">Plan New Trip</p>
                </Link>
              </div>
            </div>

            {/* Previous Trips */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-slate-700 p-2 rounded-lg shadow-sm rotate-[-3deg]"><CheckCircle2 size={20} className="text-white" /></div>
                <h3 className="text-3xl font-black text-slate-800 font-serif opacity-80">Previous Trips</h3>
                <div className="flex-1 h-1 bg-gradient-to-r from-slate-400 to-transparent rounded-full ml-2 opacity-30"></div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 opacity-90">
                <ProfileTripCard 
                  title="Nordic Adventure" 
                  route="Finland" 
                  image="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80" 
                  status="completed" 
                  rotation="rotate-[-1deg]" 
                />
                <ProfileTripCard 
                  title="Dutch Windmills" 
                  route="Netherlands" 
                  image="https://images.unsplash.com/photo-1517487224203-0302b130e5d0?auto=format&fit=crop&q=80" 
                  status="completed" 
                  rotation="rotate-[3deg]" 
                />
                <ProfileTripCard 
                  title="Bali Retreat" 
                  route="Indonesia" 
                  image="https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80" 
                  status="completed" 
                  rotation="rotate-[-2deg]" 
                />
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}