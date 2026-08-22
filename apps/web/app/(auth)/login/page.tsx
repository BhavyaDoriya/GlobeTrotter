"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Camera, Luggage, Map, Navigation, Heart, Sun } from "lucide-react";
import { apiClient, setAuthTokens } from "@/lib/api-client";

export default function IntroAndAuthPage() {
  const router = useRouter();
  const [showIntro, setShowIntro] = useState(true);
  const [isLeaving, setIsLeaving] = useState(false);

  const [email, setEmail] = useState("traveler@world.com");
  const [password, setPassword] = useState("Password123!");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const enterSite = () => {
    if (isLeaving) return;
    setIsLeaving(true);
    setTimeout(() => setShowIntro(false), 1050);
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let res;
      try {
        res = await apiClient.auth.login({ email, password });
      } catch (loginErr: any) {
        res = await apiClient.auth.register({
          email,
          password,
          firstName: "Globe",
          lastName: "Trotter",
        });
      }

      if (res?.accessToken) {
        setAuthTokens(res.accessToken, res.refreshToken);
        router.push("/trips");
      }
    } catch (err: any) {
      setError(err.message || "Failed to log in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ============ INTRO SCENE ============ */}
      {showIntro && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-1000 ease-[cubic-bezier(.6,0,.2,1)] overflow-hidden ${
            isLeaving ? "scale-110 opacity-0 pointer-events-none" : "scale-100 opacity-100"
          }`}
          style={{
            background: "radial-gradient(120% 100% at 50% 0%, #C3DFDD 0%, #8CBDB9 55%, #4A7C77 100%)",
          }}
        >
          <style>{`
            .orbit-ring { position:absolute; inset:6%; border-radius:50%; border:2px dashed rgba(255,255,255,0.4); }
            .globe-anim { position:relative; width:64%; height:64%; border-radius:50%; background: radial-gradient(circle at 32% 28%, #E5F0EF, #4A7C77 70%); box-shadow: inset -18px -18px 40px rgba(0,0,0,0.15), 0 22px 40px rgba(0,0,0,0.1); animation: spin 24s linear infinite; }
            @keyframes spin { to { transform: rotate(360deg); } }
            .flight-path { position:absolute; inset:0; fill:none; stroke: white; stroke-width:2.5; stroke-dasharray:1 10; stroke-linecap:round; opacity:0.55; }
            .plane-svg { position:absolute; width:46px; height:46px; left:0; top:0; offset-path: path('M 280,40 C 480,90 500,300 280,340 C 60,380 40,150 280,40'); offset-rotate: auto; animation: fly 5.5s linear infinite; filter: drop-shadow(1.4px 0 0 white) drop-shadow(-1.4px 0 0 white) drop-shadow(0 1.4px 0 white) drop-shadow(0 -1.4px 0 white) drop-shadow(0 6px 10px rgba(0,0,0,0.2)); }
            @keyframes fly { from { offset-distance:0%; } to { offset-distance:100%; } }
            .wordmark { position:absolute; bottom:6%; left:0; right:0; text-align:center; opacity:0; animation: reveal 1s ease forwards 2.6s; color: white; }
            @keyframes reveal { to { opacity:1; transform:translateY(0); } from { transform:translateY(10px); } }
            .enter-btn { position:absolute; bottom:-3%; left:50%; transform: translate(-50%, 140%); display:inline-flex; align-items:center; gap:10px; background: #E77A64; color: white; border: 3px solid white; padding:14px 26px; border-radius:999px; font-weight:700; font-size:14px; cursor:pointer; opacity:0; box-shadow: 0 12px 24px rgba(0,0,0,0.2); transition: transform 0.25s ease, box-shadow 0.25s ease; }
            .enter-btn:hover { transform: translate(-50%, 140%) scale(1.04); box-shadow: 0 16px 30px rgba(0,0,0,0.3); }
            @keyframes reveal-btn { to { opacity:1; transform: translate(-50%, 210%); } }
            @keyframes pulse-btn { 0%,100%{transform: translate(-50%, 210%) scale(1);} 50%{transform: translate(-50%, 210%) scale(1.04);} }
            .pulse-active { animation: reveal-btn 1s ease forwards, pulse-btn 1.8s ease-in-out infinite 4.4s !important; }
            .sticker-float { position:absolute; filter: drop-shadow(1.4px 0 0 white) drop-shadow(-1.4px 0 0 white) drop-shadow(0 1.4px 0 white) drop-shadow(0 -1.4px 0 white) drop-shadow(0 6px 10px rgba(0,0,0,0.25)); animation: bob 4.5s ease-in-out infinite; }
            @keyframes bob { 0%,100%{ transform: translateY(0) rotate(var(--r,0deg)); } 50%{ transform: translateY(-10px) rotate(var(--r,0deg)); } }
          `}</style>

          <button className="absolute top-6 right-6 bg-white/20 hover:bg-white/30 text-white px-5 py-2.5 rounded-full font-bold text-sm tracking-wide transition-all z-50" onClick={enterSite}>
            Skip intro
          </button>

          <div className="relative w-[min(90vw,560px)] aspect-square flex items-center justify-center">
            <div className="orbit-ring"></div>

            <div className="globe-anim">
              <svg viewBox="0 0 200 200" className="w-full h-full block">
                <path d="M40 60c30-20 60 10 90-4s40-14 40-14v130s-20 10-50 0-60-24-90-4-20-10-20-10V70s10-6 30-10z" fill="#4A7C77" opacity="0.55"/>
                <path d="M10 120c20-16 40 8 70 0s45-20 70-6v70H10z" fill="#2D4C49" opacity="0.5"/>
              </svg>
            </div>

            <svg className="flight-path" viewBox="0 0 560 560" preserveAspectRatio="none">
              <path d="M 280,40 C 480,90 500,300 280,340 C 60,380 40,150 280,40" />
            </svg>

            <svg className="plane-svg" viewBox="0 0 48 48">
              <path d="M44 24 30 18 20 4 15 6 20 20 6 22 2 18 0 20 6 26 0 30 2 32 6 28 20 30 15 44 20 46 30 32 44 26Z" fill="#E77A64"/>
            </svg>

            <div className="wordmark">
              <h1 className="font-serif font-bold text-4xl md:text-5xl tracking-tight">GlobeTrotter</h1>
              <p className="mt-1 text-xs font-bold tracking-[0.2em] uppercase text-white/80">Time to Travel</p>
            </div>

            <button className="enter-btn pulse-active z-50" onClick={enterSite}>
              Begin the journey
            </button>
          </div>
        </div>
      )}

      {/* ============ MAIN AUTH SITE ============ */}
      <div className="min-h-screen bg-[#E5F0EF] text-slate-800 font-sans overflow-x-hidden selection:bg-[#F6D267] selection:text-slate-900">
        <svg className="fixed inset-0 w-full h-full pointer-events-none opacity-20" xmlns="http://www.w3.org/2000/svg">
          <path d="M-100,200 Q400,50 800,300 T1600,100" fill="none" stroke="#4A7C77" strokeWidth="3" strokeDasharray="10 10" />
          <path d="M-100,600 Q300,800 900,500 T1800,700" fill="none" stroke="#4A7C77" strokeWidth="3" strokeDasharray="10 10" />
        </svg>

        <div className="flex min-h-screen relative z-10 container mx-auto px-4 lg:px-8">
          
          <div className="w-full lg:w-1/2 flex items-center justify-center py-12">
            <div className="relative w-full max-w-md bg-white p-8 md:p-10 rounded-3xl border-8 border-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] rotate-[-1deg] hover:rotate-0 transition-transform duration-300">
              
              <div className="absolute -top-6 -left-6 bg-[#F6D267] p-3 rounded-full border-4 border-white shadow-md rotate-12">
                <Sun size={32} className="text-amber-600" />
              </div>

              <div className="text-center mb-8">
                <h2 className="text-4xl font-extrabold text-[#4A7C77] mb-2 font-serif tracking-tight">Time to Travel</h2>
                <p className="text-slate-500 font-medium">Log in to build your itinerary.</p>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-xl text-sm font-bold">
                  {error}
                </div>
              )}

              <form className="space-y-5" onSubmit={handleAuthSubmit}>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2" htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-slate-100 focus:border-[#8CBDB9] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#8CBDB9]/20 transition-all font-medium"
                    placeholder="traveler@world.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2" htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-slate-100 focus:border-[#8CBDB9] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#8CBDB9]/20 transition-all font-medium"
                    placeholder="••••••••"
                    required
                  />
                </div>
                
                <div className="flex items-center justify-between mt-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-[#E77A64] focus:ring-[#E77A64]" defaultChecked />
                    <span className="text-sm font-medium text-slate-600">Remember me</span>
                  </label>
                  <a href="#" className="text-sm font-bold text-[#E77A64] hover:underline hover:text-[#d66752]">Forgot password?</a>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-6 bg-[#E77A64] hover:bg-[#d66752] text-white text-lg font-bold py-4 rounded-2xl shadow-[0_8px_0_#b55140] active:shadow-[0_0px_0_#b55140] active:translate-y-2 transition-all disabled:opacity-50"
                >
                  {loading ? "Connecting..." : "Let's Go! ✈️"}
                </button>
              </form>

              <div className="mt-8 text-center text-slate-500 font-medium">
                Don't have an account? <Link href="/register" className="text-[#4A7C77] font-bold hover:underline">Sign up</Link>
              </div>
            </div>
          </div>

          <div className="hidden lg:flex w-1/2 relative items-center justify-center perspective-1000">
            <div className="relative w-[500px] h-[500px]">
              <div className="absolute inset-0 m-auto w-96 h-96 bg-[#F6D267] rounded-full shadow-inner opacity-90"></div>
              <div className="absolute top-10 left-10 bg-[#8CBDB9] p-4 rounded-2xl border-[6px] border-white shadow-xl rotate-[-15deg] hover:rotate-[-5deg] hover:scale-110 transition-all duration-300 cursor-pointer">
                <Camera size={64} className="text-white" fill="white" />
              </div>
              <div className="absolute bottom-20 left-4 bg-[#E77A64] p-3 rounded-xl border-[6px] border-white shadow-xl rotate-[10deg] hover:rotate-[0deg] hover:scale-110 transition-all duration-300 cursor-pointer">
                <Map size={48} className="text-white" />
              </div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#4A7C77] p-6 rounded-3xl border-[8px] border-white shadow-2xl rotate-3 z-20">
                <Luggage size={100} className="text-white" fill="white" />
              </div>
              <div className="absolute bottom-32 right-10 bg-red-500 p-3 rounded-full border-[5px] border-white shadow-xl rotate-[-12deg] hover:scale-110 transition-all z-30">
                <Navigation size={32} className="text-white" fill="white" />
              </div>
              <div className="absolute top-0 right-1/3 bg-white p-2 rounded-full shadow-sm rotate-45">
                <Heart size={20} className="text-pink-400" fill="#f472b6" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}