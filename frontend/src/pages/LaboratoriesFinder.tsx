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

    // Validate: Product is required
    if (!recProduct.trim()) return;

    // Validate: Location is MANDATORY after filling product
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

  // Clear location error when user types
  const handleLocationChange = (val: string) => {
    setRecLocation(val);
    if (val.trim()) {
      setLocationError(false);
    }
  };

  // Detect user GPS location
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          // Use reverse geocoding with a free service
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
          // Fallback: just set coordinates
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
    <div className="space-y-6 animate-in fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">BIS Licensed Testing Laboratories</h1>
        <p className="text-xs text-slate-500">
          Comprehensive directory of NABL-accredited &amp; BIS-recognized testing facilities across India — sourced from BIS Care &amp; Licensed Portal
        </p>
      </div>

      {/* ===================== SMART LAB RECOMMENDER CARD ===================== */}
      <div className="bg-gradient-to-r from-bis-900 to-[#0A2540] text-white rounded-3xl p-6 shadow-xl border border-[#143B63] space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-white/10 rounded-xl">
            <Sparkles className="w-5 h-5 text-cyan-300" />
          </div>
          <div>
            <h2 className="font-bold text-base text-white">Smart Laboratory Recommender</h2>
            <p className="text-xs text-slate-300">
              Enter your product/item and location — both are required to find the nearest accredited facility
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
              placeholder="Product / Item (e.g. Electric Kettle, Helmet)... *"
              className="px-3.5 py-2.5 bg-white/10 text-white placeholder-slate-400 border border-white/20 rounded-xl text-xs outline-none focus:border-cyan-400"
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
                className={`w-full px-3.5 py-2.5 bg-white/10 text-white placeholder-slate-400 border rounded-xl text-xs outline-none transition-colors pr-10 ${
                  locationError
                    ? 'border-red-400 bg-red-500/10 focus:border-red-400'
                    : 'border-white/20 focus:border-cyan-400'
                }`}
              />
              <button
                type="button"
                onClick={handleDetectLocation}
                disabled={detectingLocation}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-white/10 transition-colors text-slate-300 hover:text-cyan-300"
                title="Detect my current location (GPS)"
              >
                <LocateFixed className={`w-4 h-4 ${detectingLocation ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={recLoading || !recProduct.trim()}
              className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-slate-900 font-bold rounded-xl text-xs transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              {recLoading ? 'Matching Labs...' : 'Find Matching Labs'}
            </button>
          </div>

          {/* Location error message */}
          {locationError && (
            <div className="flex items-center gap-2 px-3 py-2 bg-red-500/15 border border-red-400/30 rounded-xl animate-in fade-in">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              <p className="text-xs text-red-300 font-medium">
                <strong>Location is required.</strong> Please enter your City, State, or Pincode to locate the nearest accredited BIS laboratory.
              </p>
              <button
                type="button"
                onClick={handleDetectLocation}
                className="ml-auto shrink-0 px-3 py-1 bg-white/10 hover:bg-white/20 text-cyan-300 text-[11px] font-bold rounded-lg border border-cyan-400/30 transition-colors flex items-center gap-1"
              >
                <LocateFixed className="w-3 h-3" />
                Use GPS
              </button>
            </div>
          )}
        </form>

        {/* Recommended Results */}
        {recommendedLabs && (
          <div className="pt-3 border-t border-white/15 space-y-2 animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-cyan-300">
                {recommendedLabs.length > 0
                  ? `Top ${Math.min(recommendedLabs.length, 4)} Laboratories near "${recLocation}" for "${recProduct}":`
                  : `No matching laboratories found for "${recProduct}" near "${recLocation}"`
                }
              </span>
              {recommendedLabs.length > 0 && (
                <span className="text-[10px] text-slate-400">
                  {recommendedLabs.length} total matches
                </span>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {recommendedLabs.slice(0, 4).map((lab, idx) => (
                <div key={lab.id} className="p-3 bg-white/10 rounded-xl border border-white/15 text-xs space-y-1">
                  <div className="font-bold text-white flex items-center justify-between">
                    <span className="line-clamp-1">{lab.name}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded shrink-0 ${
                      idx === 0 ? 'bg-cyan-400/20 text-cyan-300' : 'bg-white/10 text-slate-300'
                    }`}>
                      {idx === 0 ? '🥇 Best Match' : `#${idx + 1}`}
                    </span>
                  </div>
                  <p className="text-slate-300 text-[11px] flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-cyan-400" /> {lab.location}, {lab.state}
                  </p>
                  <p className="text-[11px] text-slate-400 line-clamp-1">
                    Capabilities: {lab.capabilities}
                  </p>
                  {lab.contactPhone && (
                    <p className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Phone className="w-3 h-3" /> {lab.contactPhone}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ===================== SEARCH & FILTER BAR ===================== */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            fetchLabs();
          }} 
          className="flex flex-col sm:flex-row gap-3"
        >
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by lab name, test capabilities, or standard number (e.g. IS 302)..."
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:border-bis-600 outline-none"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors"
          >
            Search
          </button>
        </form>

        {/* State filter pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] font-semibold text-slate-400 mr-1">Region:</span>
          {states.map((st) => (
            <button
              key={st}
              onClick={() => setStateFilter(st)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                stateFilter === st
                  ? 'bg-bis-600 text-white font-bold'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {st === 'ALL' ? 'All Regions' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Lab count info */}
      {!loading && (
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <FlaskConical className="w-4 h-4 text-bis-600" />
          <span>
            Showing <strong className="text-slate-700">{laboratories.length}</strong> laboratories
            {stateFilter !== 'ALL' && <> in <strong className="text-slate-700">{stateFilter}</strong></>}
          </span>
        </div>
      )}

      {/* ===================== LABORATORIES LIST ===================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <div className="col-span-2 p-12 text-center text-slate-500 text-xs">
            Loading laboratories...
          </div>
        ) : laboratories.length === 0 ? (
          <div className="col-span-2 p-12 bg-white rounded-2xl border border-slate-200 text-center space-y-2">
            <FlaskConical className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-700 text-sm">No laboratories found</h3>
            <p className="text-xs text-slate-400">Try broadening your search term or selecting a different region.</p>
          </div>
        ) : (
          laboratories.map((lab) => (
            <div
              key={lab.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-sm text-slate-900 leading-snug">
                    {lab.name}
                  </h3>
                  {lab.isRecommended && (
                    <span className="text-[10px] font-bold text-cyan-800 bg-cyan-50 border border-cyan-200 px-2 py-0.5 rounded-full shrink-0">
                      Recommended
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <MapPin className="w-3.5 h-3.5 text-bis-600 shrink-0" />
                  <span>{lab.location}, {lab.state}</span>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2">
                  <strong className="text-slate-700">Capabilities:</strong> {lab.capabilities}
                </p>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <span className="font-semibold text-slate-700 block text-[11px] mb-1">
                    Standards Tested:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {lab.standardsCovered.split(',').map((std, i) => (
                      <span key={i} className="px-2 py-0.5 bg-white border border-slate-200 rounded font-mono text-[10px] font-bold text-bis-700">
                        {std.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Badges & Contact */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  {lab.isNablAccredited && (
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      NABL Accredited
                    </span>
                  )}
                  {lab.isBisRecognized && (
                    <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      BIS Recognized
                    </span>
                  )}
                </div>

                {lab.contactPhone && (
                  <span className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
                    <Phone className="w-3 h-3 text-slate-400" />
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
