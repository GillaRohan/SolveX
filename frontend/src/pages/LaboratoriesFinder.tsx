import React, { useState, useEffect } from 'react';
import { 
  FlaskConical, 
  Search, 
  MapPin, 
  Phone, 
  Mail, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight,
  Filter,
  CheckCircle2,
  AlertTriangle,
  LocateFixed,
  XCircle
} from 'lucide-react';
import { api } from '../services/api';
import { Laboratory } from '../types';

export const LaboratoriesFinder: React.FC = () => {
  const [laboratories, setLaboratories] = useState<Laboratory[]>([]);
  const [search, setSearch] = useState('');
  const [stateFilter, setStateFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  // Smart recommender state
  const [recProduct, setRecProduct] = useState('');
  const [recLocation, setRecLocation] = useState('');
  const [recommendedLabs, setRecommendedLabs] = useState<Laboratory[] | null>(null);
  const [recLoading, setRecLoading] = useState(false);

  // Location validation state
  const [locationError, setLocationError] = useState(false);
  const [locationTouched, setLocationTouched] = useState(false);
  const [detectingLocation, setDetectingLocation] = useState(false);

  useEffect(() => {
    fetchLabs();
  }, [stateFilter]);

  const fetchLabs = async () => {
    setLoading(true);
    try {
      const data = await api.getLaboratories({
        state: stateFilter !== 'ALL' ? stateFilter : undefined,
        search: search.trim() || undefined
      });
      setLaboratories(data);
    } catch (e) {
      console.warn('Failed to fetch labs:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSmartRecommend = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!recProduct.trim()) return;

    if (!recLocation.trim()) {
      setLocationError(true);
      setLocationTouched(true);
      return;
    }

    setLocationError(false);
    setRecLoading(true);
    try {
      const recs = await api.recommendLaboratories(recProduct, undefined, recLocation);
      setRecommendedLabs(recs);
    } catch (e) {
      console.warn('Recommendation failed:', e);
    } finally {
      setRecLoading(false);
    }
  };

  const handleLocationChange = (val: string) => {
    setRecLocation(val);
    if (val.trim()) {
      setLocationError(false);
    }
  };

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`
          );
          const data = await res.json();
          const city = data.address?.city || data.address?.town || data.address?.county || data.address?.state_district || '';
          const state = data.address?.state || '';
          const detected = city ? `${city}, ${state}` : state;
          if (detected) {
            setRecLocation(detected);
            setLocationError(false);
          }
        } catch {
          setRecLocation(`Lat ${position.coords.latitude.toFixed(2)}, Lon ${position.coords.longitude.toFixed(2)}`);
        } finally {
          setDetectingLocation(false);
        }
      },
      () => {
        alert('Unable to retrieve your location. Please enter it manually.');
        setDetectingLocation(false);
      },
      { timeout: 10000 }
    );
  };

  const states = [
    'ALL',
    'Uttar Pradesh',
    'Maharashtra',
    'Tamil Nadu',
    'West Bengal',
    'Karnataka',
    'Telangana',
    'Delhi',
    'Gujarat',
    'Haryana',
    'Rajasthan',
    'Kerala',
    'Punjab',
    'Madhya Pradesh',
    'Bihar',
    'Assam',
    'Uttarakhand'
  ];

  return (
    <div className="space-y-6 animate-in fade-in text-[#1F2937]">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-6 rounded-sm bg-[#D4AF37]" />
          <h1 className="text-2xl font-extrabold text-[#111827] tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
            BIS Licensed &amp; Recognized Testing Laboratories
          </h1>
        </div>
        <p className="text-xs text-[#6B7280]">
          Comprehensive directory of 280+ NABL-accredited &amp; BIS-recognized testing facilities across India
        </p>
      </div>

      {/* ===================== SMART LAB RECOMMENDER CARD ===================== */}
      <div className="card p-6 sm:p-7 space-y-4 bg-white border border-[#D4AF37]/40 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 bg-[#FEF9C3] rounded-2xl border border-[#D4AF37]/40 text-[#996515] shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-extrabold text-base text-[#111827]" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Smart Laboratory Recommender
            </h2>
            <p className="text-xs text-[#6B7280]">
              Enter your product domain and location to find the closest accredited BIS testing center
            </p>
          </div>
        </div>

        <form onSubmit={handleSmartRecommend} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Product Input */}
            <input
              type="text"
              value={recProduct}
              onChange={(e) => setRecProduct(e.target.value)}
              placeholder="Product / Standard (e.g. Electric Kettle, IS 4151)... *"
              className="px-4 py-2.5 bg-[#FAFAF8] text-[#111827] placeholder-[#9CA3AF] border border-[#D4AF37]/35 rounded-xl text-xs outline-none focus:border-[#C9A227] focus:bg-white transition-all shadow-2xs"
            />

            {/* Location Input - MANDATORY */}
            <div className="relative">
              <input
                type="text"
                value={recLocation}
                onChange={(e) => handleLocationChange(e.target.value)}
                onBlur={() => {
                  setLocationTouched(true);
                  if (recProduct.trim() && !recLocation.trim()) {
                    setLocationError(true);
                  }
                }}
                placeholder="Location (City / State / Pincode)... *"
                className={`w-full px-4 py-2.5 bg-[#FAFAF8] text-[#111827] placeholder-[#9CA3AF] border rounded-xl text-xs outline-none transition-all pr-10 shadow-2xs ${
                  locationError
                    ? 'border-rose-400 bg-rose-50'
                    : 'border-[#D4AF37]/35 focus:border-[#C9A227] focus:bg-white'
                }`}
              />
              <button
                type="button"
                onClick={handleDetectLocation}
                disabled={detectingLocation}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-[#996515] cursor-pointer"
                title="Detect my current location (GPS)"
              >
                <LocateFixed className={`w-4 h-4 ${detectingLocation ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={recLoading || !recProduct.trim()}
              className="px-6 py-2.5 btn-primary font-bold rounded-xl text-xs transition-all disabled:opacity-50 flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
            >
              {recLoading ? 'Matching Labs...' : 'Find Matching Labs'}
            </button>
          </div>

          {/* Location error message */}
          {locationError && (
            <div className="flex items-center gap-2 px-3.5 py-2 bg-rose-50 border border-rose-200 rounded-xl animate-in fade-in">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <p className="text-xs text-rose-800 font-medium">
                <strong>Location is required.</strong> Please enter your City, State, or Pincode to locate the nearest accredited BIS laboratory.
              </p>
              <button
                type="button"
                onClick={handleDetectLocation}
                className="ml-auto shrink-0 px-2.5 py-0.5 bg-white text-[#996515] text-[11px] font-bold rounded-lg border border-[#D4AF37]/40 shadow-2xs"
              >
                Use GPS
              </button>
            </div>
          )}
        </form>

        {/* Recommended Results */}
        {recommendedLabs && (
          <div className="pt-4 border-t border-gray-100 space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#996515]">
                {recommendedLabs.length > 0
                  ? `Top ${Math.min(recommendedLabs.length, 4)} Laboratories near "${recLocation}" for "${recProduct}":`
                  : `No matching laboratories found for "${recProduct}" near "${recLocation}"`
                }
              </span>
              {recommendedLabs.length > 0 && (
                <span className="text-[10px] text-[#6B7280] font-semibold">
                  {recommendedLabs.length} total matches
                </span>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {recommendedLabs.slice(0, 4).map((lab, idx) => (
                <div key={lab.id} className="p-3.5 bg-[#FAFAF8] rounded-2xl border border-[#D4AF37]/35 text-xs space-y-1.5 hover:border-[#D4AF37] hover:bg-white shadow-2xs transition-all">
                  <div className="font-bold text-[#111827] flex items-center justify-between">
                    <span className="line-clamp-1">{lab.name}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-lg font-bold shrink-0 ${
                      idx === 0 ? 'bg-[#FEF9C3] text-[#854D0E] border border-[#D4AF37]/40' : 'bg-gray-100 text-[#4B5563]'
                    }`}>
                      {idx === 0 ? '🥇 Best Match' : `#${idx + 1}`}
                    </span>
                  </div>
                  <p className="text-[#4B5563] text-[11px] flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#996515]" /> {lab.location}, {lab.state}
                  </p>
                  <p className="text-[11px] text-[#6B7280] line-clamp-1">
                    Capabilities: {lab.capabilities}
                  </p>
                  {lab.contactPhone && (
                    <p className="text-[11px] text-[#6B7280] flex items-center gap-1 font-mono">
                      <Phone className="w-3 h-3 text-[#996515]" /> {lab.contactPhone}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ===================== SEARCH & FILTER BAR ===================== */}
      <div className="card p-5 space-y-4 bg-white border border-[#D4AF37]/35 shadow-sm">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            fetchLabs();
          }} 
          className="flex flex-col sm:flex-row gap-3"
        >
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#C9A227] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by lab name, test capabilities, or standard number (e.g. IS 302)..."
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm border border-[#D4AF37]/40 rounded-xl focus:border-[#C9A227] outline-none text-[#111827] placeholder-[#9CA3AF] bg-[#FAFAF8] focus:bg-white shadow-xs transition-all"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 btn-primary text-xs font-bold transition-all shadow-sm cursor-pointer"
          >
            Search Labs
          </button>
        </form>

        {/* State filter pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] font-bold text-[#996515] mr-1">Region:</span>
          {states.map((st) => (
            <button
              key={st}
              onClick={() => setStateFilter(st)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                stateFilter === st
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-white shadow-xs font-bold'
                  : 'bg-[#FAFAF8] hover:bg-[#FEF9C3] text-[#374151] border border-gray-200'
              }`}
            >
              {st === 'ALL' ? 'All Regions' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Lab count info */}
      {!loading && (
        <div className="flex items-center gap-2 text-xs text-[#6B7280]">
          <FlaskConical className="w-4 h-4 text-[#996515]" />
          <span>
            Showing <strong className="text-[#111827]">{laboratories.length}</strong> testing laboratories
            {stateFilter !== 'ALL' && <> in <strong className="text-[#111827]">{stateFilter}</strong></>}
          </span>
        </div>
      )}

      {/* ===================== LABORATORIES LIST ===================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <div className="col-span-2 p-12 text-center text-[#6B7280] text-xs">
            Loading testing laboratories...
          </div>
        ) : laboratories.length === 0 ? (
          <div className="col-span-2 p-12 card text-center space-y-2 bg-white border border-[#D4AF37]/30">
            <FlaskConical className="w-10 h-10 text-[#C9A227] mx-auto" />
            <h3 className="font-bold text-[#111827] text-sm">No laboratories found</h3>
            <p className="text-xs text-[#6B7280]">Try broadening your search term or selecting a different region.</p>
          </div>
        ) : (
          laboratories.map((lab) => (
            <div
              key={lab.id}
              className="bg-white rounded-2xl border border-[#D4AF37]/35 p-5 shadow-sm hover:shadow-md hover:border-[#D4AF37] transition-all space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-sm text-[#111827] leading-snug" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    {lab.name}
                  </h3>
                  {lab.isRecommended && (
                    <span className="text-[10px] font-extrabold text-[#854D0E] bg-[#FEF9C3] border border-[#D4AF37]/40 px-2.5 py-0.5 rounded-full shrink-0">
                      Recommended
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-xs text-[#6B7280]">
                  <MapPin className="w-3.5 h-3.5 text-[#996515] shrink-0" />
                  <span>{lab.location}, {lab.state}</span>
                </div>

                <p className="text-xs text-[#4B5563] line-clamp-2">
                  <strong className="text-[#111827]">Capabilities:</strong> {lab.capabilities}
                </p>

                <div className="p-3 rounded-xl bg-[#FAFAF8] border border-gray-200 text-xs">
                  <span className="font-bold text-[#111827] block text-[11px] mb-1.5">
                    Standards Tested:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {lab.standardsCovered.split(',').map((std, i) => (
                      <span key={i} className="px-2 py-0.5 bg-white border border-[#D4AF37]/30 rounded-md font-mono text-[10px] font-bold text-[#996515] shadow-2xs">
                        {std.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Badges & Contact */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  {lab.isNablAccredited && (
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                      NABL Accredited
                    </span>
                  )}
                  {lab.isBisRecognized && (
                    <span className="text-[10px] font-bold text-[#854D0E] bg-[#FEF9C3] px-2 py-0.5 rounded-lg border border-[#D4AF37]/40">
                      BIS Recognized
                    </span>
                  )}
                </div>

                {lab.contactPhone && (
                  <span className="text-[11px] text-[#6B7280] font-mono flex items-center gap-1">
                    <Phone className="w-3 h-3 text-[#996515]" />
                    {lab.contactPhone}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
