"use client";

import React, { useState, useEffect } from "react";
import { MapPin, Mail, Phone, Edit3, Camera, Ticket, Compass, User, Lock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiClient, getAuthToken } from "@/lib/api-client";

const ProfileTripCard = ({ id = "demo-trip-1", title, route, image, status, rotation }: any) => (
  <Link
    href={`/trips/${id}/view`}
    className={`block group relative bg-white p-3 rounded-2xl shadow-lg border-[4px] border-white cursor-pointer hover:z-50 transition-all duration-300 hover:rotate-0 hover:scale-105 hover:-translate-y-2 ${rotation}`}
  >
    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-5 bg-white/80 backdrop-blur-md shadow-sm rotate-[3deg] z-10 transition-transform group-hover:rotate-[-2deg]"></div>
    <div className="relative w-full h-40 rounded-xl overflow-hidden mb-3 bg-slate-100">
      <img
        src={image || "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80"}
        alt={title}
        className={`w-full h-full object-cover transition-transform duration-700 ${
          status === "completed" ? "grayscale-[30%]" : "group-hover:scale-110"
        }`}
      />
    </div>
    <div className="px-1">
      <h4 className="text-lg font-bold text-slate-800 font-serif leading-tight">{title}</h4>
      <p className="text-slate-500 text-xs font-bold flex items-center gap-1 mt-1">
        <MapPin size={12} className={status === "completed" ? "text-slate-400" : "text-[#E77A64]"} /> {route}
      </p>
    </div>
  </Link>
);

export default function ProfilePage() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [userTrips, setUserTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      router.push("/login");
      return;
    }

    setLoading(true);
    Promise.all([
      apiClient.users.getMe().catch(() => null),
      apiClient.trips.list().catch(() => []),
    ]).then(([userData, tripsData]) => {
      if (!userData) {
        router.push("/login");
        return;
      }
      setProfile(userData);
      setFirstName(userData.firstName || "");
      setLastName(userData.lastName || "");
      if (Array.isArray(tripsData)) {
        setUserTrips(tripsData);
      }
      setLoading(false);
    });
  }, [router]);

  const handleSave = async () => {
    try {
      const updated = await apiClient.users.updateMe({ firstName, lastName });
      setProfile(updated);
      setIsEditing(false);
    } catch (err: any) {
      console.log("Update profile note:", err.message);
      setIsEditing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#E5F0EF] flex items-center justify-center p-4 text-center">
        <div className="bg-white p-8 rounded-3xl border-4 border-white shadow-xl">
          <Lock className="animate-bounce text-[#4A7C77] mx-auto mb-4" size={40} />
          <h2 className="text-xl font-bold font-serif text-[#4A7C77]">Authenticating Passport...</h2>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  const displayName = `${profile.firstName || "Traveler"} ${profile.lastName || ""}`;
  const displayEmail = profile.email;

  return (
    <div className="min-h-screen bg-[#E5F0EF] text-slate-800 font-sans pb-32 overflow-hidden selection:bg-[#F6D267] selection:text-slate-900 pt-8">
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
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-32 h-8 bg-[#E77A64] rounded-t-xl shadow-md flex items-center justify-center gap-3">
                <div className="w-2 h-2 rounded-full bg-black/20 shadow-inner"></div>
                <div className="w-2 h-2 rounded-full bg-black/20 shadow-inner"></div>
              </div>

              <button
                onClick={() => setIsEditing(!isEditing)}
                className="absolute top-6 right-6 p-2 bg-slate-100 hover:bg-[#F6D267] text-slate-600 hover:text-slate-900 rounded-full transition-colors z-20 shadow-sm"
              >
                <Edit3 size={20} />
              </button>

              <div className="flex flex-col items-center text-center mt-6">
                <div className="relative bg-white p-2 rounded-xl shadow-lg border-2 border-slate-100 rotate-3 mb-6 group cursor-pointer">
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#8CBDB9] rounded-full border-2 border-white flex items-center justify-center shadow-md z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera size={14} className="text-white" />
                  </div>
                  <div className="w-32 h-32 rounded-lg overflow-hidden bg-[#4A7C77] text-white flex items-center justify-center font-black text-4xl">
                    {profile.firstName?.[0]?.toUpperCase() || <User size={48} />}
                  </div>
                </div>

                {isEditing ? (
                  <div className="space-y-2 mb-2 w-full">
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="First Name"
                      className="w-full px-3 py-1.5 rounded-lg border text-center font-bold text-slate-800"
                    />
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Last Name"
                      className="w-full px-3 py-1.5 rounded-lg border text-center font-bold text-slate-800"
                    />
                  </div>
                ) : (
                  <h2 className="text-3xl font-black text-[#4A7C77] font-serif tracking-tight">{displayName}</h2>
                )}
                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-1 bg-slate-100 px-3 py-1 rounded-full">
                  Verified Explorer
                </p>
              </div>

              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-4 text-slate-600 font-medium p-3 bg-white rounded-xl shadow-sm border-2 border-slate-50">
                  <MapPin size={20} className="text-[#8CBDB9]" />
                  <span>Member Traveler</span>
                </div>

                <div className="flex items-center gap-4 text-slate-600 font-medium p-3 bg-white rounded-xl shadow-sm border-2 border-slate-50">
                  <Mail size={20} className="text-[#F6D267]" />
                  <span className="truncate">{displayEmail}</span>
                </div>

                {isEditing && (
                  <button
                    onClick={handleSave}
                    className="w-full mt-4 bg-[#4A7C77] hover:bg-[#38605c] text-white font-bold py-3 rounded-xl shadow-md transition-colors cursor-pointer"
                  >
                    Save Details
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: The Corkboard Grid */}
          <div className="w-full lg:w-2/3">
            <div className="mb-16">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-[#F6D267] p-2 rounded-lg shadow-sm rotate-3">
                  <Ticket size={20} className="text-slate-800" />
                </div>
                <h3 className="text-3xl font-black text-[#4A7C77] font-serif">Your Travel Scrapbooks</h3>
                <div className="flex-1 h-1 bg-gradient-to-r from-[#F6D267] to-transparent rounded-full ml-2 opacity-50"></div>
              </div>

              {userTrips.length === 0 ? (
                <div className="p-8 bg-white rounded-3xl border-4 border-white shadow-lg text-center">
                  <Compass className="text-slate-300 mx-auto mb-3" size={48} />
                  <h4 className="text-xl font-bold text-slate-700 font-serif">No trips created yet</h4>
                  <p className="text-slate-400 text-sm font-bold mt-1 mb-4">Start planning your first adventure!</p>
                  <Link
                    href="/trips/new"
                    className="inline-block bg-[#E77A64] hover:bg-[#d66752] text-white font-bold px-6 py-2.5 rounded-full shadow-md transition-colors"
                  >
                    + Plan a Trip
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {userTrips.map((t, idx) => (
                    <ProfileTripCard
                      key={t.id}
                      id={t.id}
                      title={t.name}
                      route={t.stops?.[0]?.city?.name || "Destination"}
                      image={t.coverPhotoUrl || "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80"}
                      status="upcoming"
                      rotation={idx % 2 === 0 ? "rotate-[2deg]" : "rotate-[-2deg]"}
                    />
                  ))}
                  <Link
                    href="/trips/new"
                    className="block group relative bg-slate-100/50 p-3 rounded-2xl border-4 border-dashed border-slate-300 cursor-pointer hover:border-[#8CBDB9] hover:bg-white transition-all duration-300 flex flex-col items-center justify-center min-h-[220px] rotate-1"
                  >
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform mb-3">
                      <Compass size={24} className="text-[#8CBDB9]" />
                    </div>
                    <p className="font-bold text-slate-500 group-hover:text-[#8CBDB9] transition-colors">Plan New Trip</p>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}