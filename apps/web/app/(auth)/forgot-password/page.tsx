"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, ArrowLeft, Send } from "lucide-react";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isSent, setIsSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // MOCK: In a real app we'd hit fetchApi('/auth/forgot-password', { method: 'POST', body: { email } })
    setTimeout(() => {
      setIsSent(true);
      setIsLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#E5F0EF] text-slate-800 font-sans overflow-x-hidden selection:bg-[#F6D267] selection:text-slate-900 py-12 flex items-center justify-center relative">
      
      {/* Background Doodles */}
      <svg className="fixed inset-0 w-full h-full pointer-events-none opacity-20 z-0" xmlns="http://www.w3.org/2000/svg">
        <path d="M-100,200 Q400,50 800,300 T1600,100" fill="none" stroke="#4A7C77" strokeWidth="3" strokeDasharray="10 10" />
      </svg>
      
      <div className="relative z-10 w-full max-w-md px-4">
        <Link href="/login" className="inline-flex items-center gap-2 text-[#4A7C77] font-bold hover:text-[#E77A64] transition-colors mb-6 group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Login
        </Link>
        
        <div className="relative bg-[#FFFDF8] p-8 md:p-10 rounded-[2rem] border-8 border-white shadow-[0_30px_60px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-transform duration-500">
          
          <div className="absolute -top-6 -right-4 bg-[#8CBDB9] p-4 rounded-full border-[4px] border-white shadow-md rotate-12">
            <Mail size={24} className="text-white" />
          </div>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-[#4A7C77] mb-2 font-serif tracking-tight">Forgot Password</h2>
            <p className="text-slate-500 font-medium text-sm">
              Enter your email and we'll send you a link to reset your password.
            </p>
          </div>

          {isSent ? (
            <div className="text-center space-y-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-2">
                <Mail size={32} className="text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Check your inbox!</h3>
                <p className="text-slate-500 text-sm">
                  We've sent a password reset link to <br/>
                  <span className="font-bold text-slate-700">{email}</span>
                </p>
              </div>
              <button 
                onClick={() => router.push('/login')}
                className="w-full mt-6 bg-[#4A7C77] hover:bg-[#38605c] text-white text-lg font-bold py-4 rounded-2xl shadow-[0_8px_0_#2b4a46] active:shadow-[0_0px_0_#2b4a46] active:translate-y-2 transition-all"
              >
                Return to Login
              </button>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Email Address</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  required 
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-slate-100 focus:border-[#8CBDB9] focus:bg-white focus:outline-none font-bold text-slate-700 transition-all" 
                  placeholder="traveler@world.com" 
                />
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-[#E77A64] hover:bg-[#d66752] disabled:bg-[#f3a496] disabled:cursor-not-allowed text-white text-lg font-black py-4 rounded-2xl shadow-[0_8px_0_#b55140] active:shadow-[0_0px_0_#b55140] active:translate-y-2 transition-all group"
              >
                {isLoading ? "Sending..." : "Send Reset Link"}
                {!isLoading && <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}