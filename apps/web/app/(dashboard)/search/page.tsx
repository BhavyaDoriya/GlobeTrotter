"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { Search, MapPin, Compass, Plus, Star } from "lucide-react";
import { fetchApi } from "@/lib/api";
import { useSearchParams } from "next/navigation";

function SearchContent() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q') || "";
  const [query, setQuery] = useState(q);
  const [cities, setCities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    apiClient.cities
      .list(query)
      .then((data) => {
        if (Array.isArray(data)) setCities(data);
      })
      .catch((err) => console.log("Cities API error:", err.message))
      .finally(() => setLoading(false));
  }, [query]);

  return (
    <div className="min-h-screen bg-[#E5F0EF] text-slate-800 font-sans pb-32 pt-8">
      <main className="container mx-auto px-4 lg:px-8 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-5xl font-black text-[#4A7C77] font-serif tracking-tight mb-2">Explore Destinations</h1>
            <p className="text-lg font-bold text-slate-500">Discover handpicked cities and start planning your next journey.</p>
          </div>

          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search by city or country..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-full bg-white border-4 border-white shadow-md focus:border-[#8CBDB9] focus:outline-none font-bold text-slate-700 placeholder-slate-400"
            />
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center text-slate-500 font-bold text-lg">Loading destinations...</div>
        ) : cities.length === 0 ? (
          <div className="py-20 text-center text-slate-400 font-bold">No cities found matching "{query}"</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cities.map((city) => (
              <div
                key={city.id}
                className="group relative bg-white p-4 rounded-3xl shadow-xl border-4 border-white hover:scale-105 transition-all duration-300"
              >
                <div className="relative h-60 w-full rounded-2xl overflow-hidden mb-4 bg-slate-100">
                  <img
                    src={city.imageUrl || "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&auto=format&fit=crop"}
                    alt={city.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black text-slate-800 shadow flex items-center gap-1">
                    <Star size={14} className="text-amber-500 fill-amber-500" /> {city.popularityScore}
                  </div>
                </div>

                <div className="px-2 pb-2">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-2xl font-bold font-serif text-slate-800">{city.name}</h3>
                    <span className="text-xs font-extrabold text-[#4A7C77] bg-[#E5F0EF] px-2.5 py-1 rounded-full">{city.region}</span>
                  </div>

                  <p className="text-slate-500 font-bold text-sm flex items-center gap-1 mb-4">
                    <MapPin size={16} className="text-[#E77A64]" /> {city.country}
                  </p>

                  <Link
                    href={`/trips/new?city=${encodeURIComponent(city.name)}`}
                    className="w-full bg-[#8CBDB9] hover:bg-[#4A7C77] text-white font-bold py-3 rounded-2xl flex items-center justify-center gap-2 shadow transition-all"
                  >
                    <Plus size={18} /> Plan Trip to {city.name}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default function SearchCitiesPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center">Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}
