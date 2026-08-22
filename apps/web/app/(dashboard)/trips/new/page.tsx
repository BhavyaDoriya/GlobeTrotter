"use client";

import React, { useState, useEffect, Suspense } from "react";
import { MapPin, Calendar, Sparkles, Navigation, ArrowRight, Star } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiClient } from "@/lib/api-client";

const FALLBACK_CITIES = [
  { id: "c-1", name: "Tokyo", country: "Japan", region: "Asia", popularityScore: 97 },
  { id: "c-2", name: "Paris", country: "France", region: "Europe", popularityScore: 98 },
  { id: "c-3", name: "Rome", country: "Italy", region: "Europe", popularityScore: 95 },
  { id: "c-4", name: "New York", country: "United States", region: "North America", popularityScore: 96 },
  { id: "c-5", name: "Barcelona", country: "Spain", region: "Europe", popularityScore: 92 },
  { id: "c-6", name: "Bali", country: "Indonesia", region: "Asia", popularityScore: 94 },
  { id: "c-7", name: "London", country: "United Kingdom", region: "Europe", popularityScore: 95 },
  { id: "c-8", name: "Dubai", country: "United Arab Emirates", region: "Middle East", popularityScore: 93 },
  { id: "c-9", name: "Ahmedabad", country: "India", region: "Asia", popularityScore: 85 },
  { id: "c-10", name: "Goa", country: "India", region: "Asia", popularityScore: 88 },
  { id: "c-11", name: "Mumbai", country: "India", region: "Asia", popularityScore: 86 },
];

const SuggestionPolaroid = ({ delay, rotation, title, city }: { delay: string; rotation: string; title: string; city: string }) => (
  <div
    className={`group relative bg-white p-3 rounded-2xl shadow-xl border-[6px] border-white cursor-pointer hover:z-50 transition-all duration-500 hover:rotate-0 hover:scale-110 hover:-translate-y-4 ${rotation}`}
    style={{ animationDelay: delay, animation: "fadeInUp 0.6s ease-out backwards" }}
  >
    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-5 bg-white/70 backdrop-blur-sm shadow-sm rotate-[-5deg] z-10 transition-transform group-hover:rotate-[2deg]"></div>
    <div className="w-full aspect-square rounded-xl overflow-hidden mb-3 bg-slate-100 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 group-hover:border-[#F6D267] transition-colors p-2 text-center">
      <MapPin size={24} className="text-[#E77A64] mb-1" />
      <span className="text-xs font-black text-slate-700">{city}</span>
    </div>
    <div className="px-1 pb-1">
      <div className="text-xs font-black text-[#4A7C77] truncate">{title}</div>
    </div>
  </div>
);

function CreateTripForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCity = searchParams?.get("city") || "";

  const [tripName, setTripName] = useState("");
  const [place, setPlace] = useState(initialCity);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [allCities, setAllCities] = useState<any[]>(FALLBACK_CITIES);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (initialCity && !tripName) {
      setTripName(`Adventure in ${initialCity}`);
    }
  }, [initialCity]);

  useEffect(() => {
    apiClient.cities
      .list()
      .then((cities) => {
        if (Array.isArray(cities) && cities.length > 0) {
          setAllCities(cities);
        }
      })
      .catch(() => {});
  }, []);

  const filteredSuggestions = place.trim()
    ? allCities.filter(
        (c) =>
          c.name.toLowerCase().includes(place.toLowerCase()) ||
          c.country.toLowerCase().includes(place.toLowerCase()) ||
          c.region?.toLowerCase().includes(place.toLowerCase())
      )
    : allCities;

  const selectCity = (city: any) => {
    const selectedLocation = `${city.name}, ${city.country}`;
    setPlace(selectedLocation);
    if (!tripName) {
      setTripName(`${city.name} Explorer`);
    }
    setShowDropdown(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tripName || submitting) return;

    setSubmitting(true);
    try {
      const newTrip = await apiClient.trips.create({
        name: tripName,
        startDate: startDate || new Date().toISOString().slice(0, 10),
        endDate: endDate || new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
        description: place ? `Primary Destination: ${place}` : undefined,
      });
      router.push(`/trips/${newTrip.id}/build`);
    } catch (err: any) {
      console.log("Create trip API error:", err.message);
      router.push("/trips");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-16 items-start">
      {/* LEFT COLUMN: The Notepad Form */}
      <div className="w-full lg:w-5/12 perspective-1000">
        <div className="relative bg-[#FFFDF8] p-8 md:p-10 rounded-[2rem] border-4 border-slate-100 shadow-[0_30px_60px_rgba(0,0,0,0.12)] rotate-[-1.5deg] hover:rotate-0 transition-transform duration-500 ease-out">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-40 h-8 bg-slate-800 rounded-t-xl shadow-md border-b-4 border-slate-600 flex items-center justify-center gap-4">
            <div className="w-3 h-3 rounded-full bg-slate-500 shadow-inner"></div>
            <div className="w-3 h-3 rounded-full bg-slate-500 shadow-inner"></div>
          </div>

          <div className="absolute -right-6 -bottom-6 bg-[#F6D267] p-4 rounded-full border-[6px] border-white shadow-xl rotate-12 animate-[bounce_4s_infinite]">
            <Navigation size={28} className="text-slate-800" fill="currentColor" />
          </div>

          <h2 className="text-4xl font-extrabold text-[#4A7C77] mb-8 font-serif tracking-tight mt-4">
            Draft your <br />
            <span className="text-[#E77A64] italic underline decoration-[#F6D267] decoration-4 underline-offset-4">Adventure.</span>
          </h2>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="group">
              <label className="block text-sm font-black uppercase tracking-widest text-slate-400 mb-2 group-focus-within:text-[#E77A64] transition-colors">
                Name the Journey *
              </label>
              <input
                type="text"
                required
                value={tripName}
                onChange={(e) => setTripName(e.target.value)}
                className="w-full px-0 py-2 bg-transparent border-b-4 border-slate-200 focus:border-[#E77A64] focus:outline-none transition-all font-serif text-2xl font-bold text-slate-700 placeholder-slate-300"
                placeholder="e.g., Euro Summer '24"
              />
            </div>

            <div className="group pt-4 relative">
              <label className="block text-sm font-black uppercase tracking-widest text-slate-400 mb-2 group-focus-within:text-[#8CBDB9] transition-colors">
                Primary Destination
              </label>
              <div className="relative flex items-center">
                <MapPin className="absolute left-0 text-slate-400 group-focus-within:text-[#8CBDB9] transition-colors" size={24} />
                <input
                  type="text"
                  value={place}
                  onFocus={() => setShowDropdown(true)}
                  onChange={(e) => {
                    setPlace(e.target.value);
                    setShowDropdown(true);
                  }}
                  className="w-full pl-10 pr-4 py-2 bg-transparent border-b-4 border-slate-200 focus:border-[#8CBDB9] focus:outline-none transition-all font-serif text-2xl font-bold text-slate-700 placeholder-slate-300"
                  placeholder="Type or click for destinations..."
                />
              </div>

              {/* Autocomplete Dropdown List */}
              {showDropdown && filteredSuggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-20 bg-white border-4 border-slate-100 shadow-2xl rounded-2xl p-2 z-50 max-h-64 overflow-y-auto">
                  <div className="text-[10px] font-black uppercase tracking-widest text-[#4A7C77] px-3 py-1.5 border-b border-slate-100 flex items-center justify-between">
                    <span>Select Global Destination</span>
                    <span className="text-slate-400">{filteredSuggestions.length} found</span>
                  </div>
                  {filteredSuggestions.map((c) => (
                    <div
                      key={c.id || c.name}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        selectCity(c);
                      }}
                      className="flex items-center justify-between p-3 hover:bg-[#E5F0EF] rounded-xl cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-[#E77A64]" />
                        <span className="font-bold text-slate-800 text-sm">{c.name}</span>
                        <span className="text-xs text-slate-400 font-medium">({c.country})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-[#4A7C77] bg-slate-100 px-2 py-0.5 rounded-full">
                          {c.region}
                        </span>
                        {c.popularityScore && (
                          <span className="text-xs font-bold text-amber-500 flex items-center gap-0.5">
                            <Star size={12} className="fill-amber-400" /> {c.popularityScore}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-8 pt-4">
              <div className="group">
                <label className="block text-sm font-black uppercase tracking-widest text-slate-400 mb-2 group-focus-within:text-[#F6D267] transition-colors">
                  Takeoff
                </label>
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
                <label className="block text-sm font-black uppercase tracking-widest text-slate-400 mb-2 group-focus-within:text-[#F6D267] transition-colors">
                  Return
                </label>
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
              <button
                type="submit"
                disabled={submitting}
                className="w-full flex justify-center items-center gap-3 bg-[#4A7C77] hover:bg-[#38605c] text-white text-xl font-black py-5 rounded-2xl shadow-[0_8px_0_#2D4C49] active:shadow-[0_0px_0_#2D4C49] active:translate-y-2 transition-all cursor-pointer group"
              >
                <Sparkles size={24} className="group-hover:rotate-12 transition-transform" />
                {submitting ? "Creating Trip..." : "Build Itinerary"}
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
            Seeded Destinations
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-10 pl-2">
          <SuggestionPolaroid rotation="rotate-[3deg]" delay="0ms" title="Cherry Blossoms" city="Tokyo, Japan" />
          <SuggestionPolaroid rotation="rotate-[-4deg] translate-y-6" delay="100ms" title="Eiffel Tower" city="Paris, France" />
          <SuggestionPolaroid rotation="rotate-[2deg] -translate-y-4" delay="200ms" title="Colosseum Walk" city="Rome, Italy" />
          <SuggestionPolaroid rotation="rotate-[-2deg] translate-y-2" delay="300ms" title="Central Park" city="New York, USA" />
          <SuggestionPolaroid rotation="rotate-[5deg]" delay="400ms" title="Sagrada Família" city="Barcelona, Spain" />
          <SuggestionPolaroid rotation="rotate-[-3deg] translate-y-8" delay="500ms" title="Big Ben & Thames" city="London, UK" />
        </div>
      </div>
    </div>
  );
}

export default function CreateTripPage() {
  return (
    <div className="min-h-screen bg-[#E5F0EF] text-slate-800 font-sans pb-32 overflow-hidden selection:bg-[#F6D267] selection:text-slate-900 pt-12">
      <div className="fixed inset-0 pointer-events-none z-0 opacity-30">
        <svg className="absolute w-[150%] h-[150%] animate-[spin_90s_linear_infinite] -top-[25%] -left-[25%]" viewBox="0 0 1000 1000">
          <circle cx="500" cy="500" r="300" fill="none" stroke="#8CBDB9" strokeWidth="2" strokeDasharray="15 15" />
          <path d="M 200 500 Q 500 200 800 500 T 1400 500" fill="none" stroke="#E77A64" strokeWidth="2" strokeDasharray="10 10" opacity="0.5" />
        </svg>
      </div>

      <main className="relative z-10 container mx-auto px-4 lg:px-8 max-w-7xl">
        <Suspense fallback={<div className="py-20 text-center font-bold text-slate-500">Loading Form...</div>}>
          <CreateTripForm />
        </Suspense>
      </main>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px) scale(0.9); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}