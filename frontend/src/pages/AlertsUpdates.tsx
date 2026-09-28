import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  AlertCircle, 
  Calendar, 
  Tag, 
  Filter, 
  Bookmark, 
  Check, 
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { api } from '../services/api';
import { NotificationItem } from '../types';

export const AlertsUpdates: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [filterType, setFilterType] = useState('ALL');
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlerts();
  }, [filterType]);

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const data = await api.getNotifications();
      setNotifications(data);
    } catch (e) {
      console.warn('Error loading notifications:', e);
    } finally {
      setLoading(false);
    }
  };

  const toggleSave = (id: string) => {
    setSavedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const filtered = filterType === 'ALL'
    ? notifications
    : notifications.filter(n => n.type === filterType);

  return (
    <div className="space-y-6 animate-in fade-in text-[#1F2937]">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-6 rounded-sm bg-[#D4AF37]" />
          <h1 className="text-2xl font-extrabold text-[#111827] tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Alerts &amp; Gazette QCO Updates
          </h1>
        </div>
        <p className="text-xs text-[#6B7280]">
          Stay informed on Quality Control Orders (QCOs), standard revisions, and Atmanirbhar Bharat MSME policies
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 bg-white p-3 rounded-2xl border border-[#D4AF37]/35 shadow-xs">
        {[
          { id: 'ALL', label: 'All Notifications' },
          { id: 'QCO_UPDATE', label: 'Mandatory QCOs' },
          { id: 'STANDARD_REVISION', label: 'Standard Amendments' },
          { id: 'SYSTEM', label: 'Policy & MSME Concessions' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterType(tab.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              filterType === tab.id
                ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-white font-bold shadow-xs'
                : 'bg-[#FAFAF8] hover:bg-[#FEF9C3] text-[#374151] border border-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications Stream */}
      <div className="space-y-3">
        {loading ? (
          <div className="p-12 text-center text-[#6B7280] text-xs">
            Loading gazette updates...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 card text-center text-[#6B7280] text-xs bg-white border border-[#D4AF37]/30">
            No notifications in this category.
          </div>
        ) : (
          filtered.map((item) => {
            const isSaved = savedIds.includes(item.id);
            return (
              <div
                key={item.id}
                className={`p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-4 shadow-sm hover:shadow-md ${
                  item.isUrgent
                    ? 'bg-[#FEF9C3]/70 border-[#D4AF37] text-[#1F2937]'
                    : 'bg-white border-[#E5C066]/35 text-[#1F2937] hover:border-[#D4AF37]'
                }`}
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-[#FEF9C3] text-[#996515] border border-[#D4AF37]/40 uppercase">
                      {item.category}
                    </span>
                    {item.isUrgent && (
                      <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
                        <ShieldAlert className="w-3 h-3 text-rose-600" /> Mandatory Enforcement
                      </span>
                    )}
                    <span className="text-[11px] text-[#6B7280] flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-[#996515]" />
                      {new Date(item.publishedAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm sm:text-base text-[#111827] leading-snug" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    {item.title}
                  </h3>

                  <p className="text-xs text-[#4B5563] leading-relaxed font-medium">
                    {item.content}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-start">
                  <button
                    onClick={() => toggleSave(item.id)}
                    className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      isSaved
                        ? 'bg-[#FEF9C3] border-[#D4AF37] text-[#996515] font-bold shadow-2xs'
                        : 'border-gray-200 text-[#6B7280] hover:bg-[#FEF9C3]/50 hover:text-[#111827]'
                    }`}
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{isSaved ? 'Saved' : 'Save'}</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
