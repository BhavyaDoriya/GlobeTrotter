"use client";

import React, { useState, useEffect } from "react";
import { Search, SlidersHorizontal, Plus, Plane, User, LogOut, LogIn, UserPlus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiClient, getAuthToken, clearAuthTokens } from "@/lib/api-client";

export default function Navbar() {
  const router = Router();
  const [showFilters, setShowFilters] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  function Router() {
    try {
      return useRouter();
    } catch {
      return null;
    }
  }

  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      apiClient.users
        .getMe()
        .then((user) => setCurrentUser(user))
        .catch(() => {
          clearAuthTokens();
          setCurrentUser(null);
        })
        .finally(() => setLoadingUser(false));
    } else {
      setLoadingUser(false);
    }
  }, []);

  const handleLogout = () => {
    clearAuthTokens();
    setCurrentUser(null);
    if (router) router.push("/login");
    else window.location.href = "/login";
  };

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
              <div className="relative group flex-1 md:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4A7C77] group-focus-within:text-[#E77A64] transition-colors" size={18} />
                <input 
                  type="text" 
                  placeholder="Where is your next adventure?" 
                  className="w-full pl-11 pr-4 py-2.5 rounded-full bg-slate-100/50 border-2 border-transparent focus:bg-white focus:border-[#F6D267] focus:outline-none focus:ring-4 focus:ring-[#F6D267]/20 transition-all font-bold text-xs text-slate-700 placeholder-slate-400"
                />
              </div>
              
              <div className="relative">
                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className={`p-2.5 rounded-full border-4 shadow-sm transition-all ${showFilters ? 'bg-[#F6D267] border-white text-slate-900 rotate-12' : 'bg-slate-100 border-transparent text-[#4A7C77] hover:bg-[#F6D267] hover:text-slate-900 hover:rotate-12'}`}
                >
                  <SlidersHorizontal size={18} />
                </button>

                {showFilters && (
                  <div className="absolute right-0 top-16 w-72 bg-[#FFFDF8] border-4 border-white shadow-[0_20px_40px_rgba(0,0,0,0.1)] rounded-2xl p-5 z-50 origin-top-right animate-in fade-in zoom-in duration-200">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-4 bg-white/80 backdrop-blur-md shadow-sm rotate-2 border-b border-slate-200"></div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-black uppercase tracking-widest text-[#4A7C77] mb-2 block">Sort By</label>
                        <select className="w-full bg-slate-100 text-slate-700 font-bold p-2 rounded-lg outline-none border-2 border-transparent focus:border-[#F6D267] cursor-pointer text-xs">
                          <option>Latest First</option>
                          <option>Upcoming Dates</option>
                          <option>Budget (Low to High)</option>
                        </select>
                      </div>
                      <button 
                        onClick={() => setShowFilters(false)}
                        className="w-full mt-2 bg-[#4A7C77] hover:bg-[#38605c] text-white font-bold py-2 rounded-xl transition-colors text-xs"
                      >
                        Apply View
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Dynamic Auth & Profile Navigation */}
              <div className="flex items-center gap-2 border-l-2 border-slate-200 pl-3">
                {!loadingUser && currentUser ? (
                  <div className="flex items-center gap-2">
                    <Link
                      href="/profile"
                      className="flex items-center gap-2 bg-[#E5F0EF] hover:bg-[#8CBDB9]/30 p-1.5 pr-3 rounded-full border-2 border-white shadow-sm transition-all"
                      title="View Explorer Profile"
                    >
                      <div className="w-8 h-8 rounded-full bg-[#4A7C77] text-white flex items-center justify-center font-black text-sm shadow-inner">
                        {currentUser.firstName?.[0]?.toUpperCase() || <User size={16} />}
                      </div>
                      <span className="text-xs font-black text-[#4A7C77] hidden sm:inline">
                        {currentUser.firstName || "Profile"}
                      </span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="p-2 rounded-full bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-600 transition-colors"
                      title="Log Out"
                    >
                      <LogOut size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Link
                      href="/login"
                      className="flex items-center gap-1 px-3.5 py-2 rounded-full text-xs font-bold text-[#4A7C77] hover:bg-slate-100 transition-colors"
                    >
                      <LogIn size={14} /> Log In
                    </Link>
                    <Link
                      href="/register"
                      className="flex items-center gap-1 px-4 py-2 rounded-full text-xs font-black bg-[#4A7C77] hover:bg-[#38605c] text-white shadow-sm transition-all"
                    >
                      <UserPlus size={14} /> Sign Up
                    </Link>
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