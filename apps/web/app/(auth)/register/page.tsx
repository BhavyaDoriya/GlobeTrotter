"use client";

import React, { useState } from "react";
import { Camera, Plane, Map, Heart, Navigation } from "lucide-react";
import Link from "next/link";

import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Mock photo upload handler
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="min-h-screen bg-[#E5F0EF] text-slate-800 font-sans overflow-x-hidden selection:bg-[#F6D267] selection:text-slate-900 py-12 flex items-center justify-center relative">
      
      {/* Background Doodles */}
      <svg className="fixed inset-0 w-full h-full pointer-events-none opacity-20 z-0" xmlns="http://www.w3.org/2000/svg">
        <path d="M-100,200 Q400,50 800,300 T1600,100" fill="none" stroke="#4A7C77" strokeWidth="3" strokeDasharray="10 10" />
      </svg>
      
      {/* Floating Background Stickers */}
      <div className="absolute top-20 left-10 lg:left-32 animate-[bounce_6s_infinite] bg-[#F6D267] p-4 rounded-full border-[6px] border-white shadow-xl rotate-[-12deg] z-0">
        <Map size={32} className="text-amber-700" />
      </div>
      <div className="absolute bottom-20 right-10 lg:right-32 animate-[bounce_8s_infinite] bg-[#8CBDB9] p-4 rounded-2xl border-[6px] border-white shadow-xl rotate-[15deg] z-0 delay-150">
        <Navigation size={40} className="text-white" fill="white" />
      </div>

      <div className="relative z-10 w-full max-w-2xl px-4">
        <div className="relative bg-[#FFFDF8] p-8 md:p-12 rounded-[2rem] border-8 border-white shadow-[0_30px_60px_rgba(0,0,0,0.1)] rotate-[1deg] hover:rotate-0 transition-transform duration-500">
          
          {/* Tape */}
          <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-32 h-8 bg-white/70 backdrop-blur-md border border-white/50 shadow-sm rotate-[-2deg]"></div>

          <div className="text-center mb-8">
            <h2 className="text-4xl font-extrabold text-[#4A7C77] mb-2 font-serif tracking-tight">Join GlobeTrotter</h2>
            <p className="text-slate-500 font-medium">Create your traveler profile to start planning.</p>
          </div>

          <form className="space-y-6" onSubmit={async (e) => {
            e.preventDefault();
            try {
              const res = await fetch("http://localhost:4000/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  firstName,
                  lastName,
                  email,
                  password,
                }),
              });
              if (res.ok) {
                router.push('/login');
              } else {
                const data = await res.json();
                alert(`Error: ${data.message || 'Registration failed'}`);
              }
            } catch (err) {
              console.error(err);
              alert("Registration failed");
            }
          }}>
            
            {/* Photo Upload (Matches Wireframe) */}
            <div className="flex justify-center mb-6">
              <div className="relative group cursor-pointer">
                <div className="w-28 h-28 bg-slate-100 rounded-full border-4 border-slate-200 overflow-hidden flex items-center justify-center group-hover:border-[#E77A64] transition-colors shadow-inner">
                  {photoPreview ? (
                    <img src={photoPreview} alt="Profile preview" className="w-full h-full object-cover" />
                  ) : (
                    <Camera size={32} className="text-slate-400 group-hover:text-[#E77A64] transition-colors" />
                  )}
                </div>
                <div className="absolute bottom-0 right-0 bg-[#E77A64] p-2 rounded-full border-2 border-white shadow-md group-hover:scale-110 transition-transform">
                  <Heart size={14} className="text-white" fill="white" />
                </div>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </div>

            {/* Form Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">First Name</label>
                <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} required className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-slate-100 focus:border-[#8CBDB9] focus:bg-white focus:outline-none font-bold text-slate-700 transition-all" placeholder="Jane" />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Last Name</label>
                <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} required className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-slate-100 focus:border-[#8CBDB9] focus:bg-white focus:outline-none font-bold text-slate-700 transition-all" placeholder="Doe" />
              </div>
              
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Email Address</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-slate-100 focus:border-[#8CBDB9] focus:bg-white focus:outline-none font-bold text-slate-700 transition-all" placeholder="traveler@world.com" />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={8} className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-slate-100 focus:border-[#8CBDB9] focus:bg-white focus:outline-none font-bold text-slate-700 transition-all" placeholder="Minimum 8 characters" />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">City</label>
                <input type="text" className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-slate-100 focus:border-[#8CBDB9] focus:bg-white focus:outline-none font-bold text-slate-700 transition-all" placeholder="e.g., Ahmedabad" />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Country</label>
                <input type="text" className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-slate-100 focus:border-[#8CBDB9] focus:bg-white focus:outline-none font-bold text-slate-700 transition-all" placeholder="e.g., India" />
              </div>
            </div>

            <button type="submit" className="w-full mt-4 flex items-center justify-center gap-2 bg-[#E77A64] hover:bg-[#d66752] text-white text-lg font-black py-4 rounded-2xl shadow-[0_8px_0_#b55140] active:shadow-[0_0px_0_#b55140] active:translate-y-2 transition-all group">
               Register Account <Plane size={20} className="group-hover:translate-x-2 transition-transform" />
            </button>
          </form>

          <div className="mt-8 text-center text-slate-500 font-medium">
            Already have an account? <Link href="/login" className="text-[#4A7C77] font-bold hover:underline">Log in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}