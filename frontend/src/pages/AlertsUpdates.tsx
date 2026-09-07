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
    <div className="space-y-6 animate-in fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Alerts & Gazette QCO Updates</h1>
        <p className="text-xs text-slate-500">
          Stay informed on Quality Control Orders (QCOs), standard revisions, and Atmanirbhar Bharat MSME policies
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
        {[
          { id: 'ALL', label: 'All Notifications' },
          { id: 'QCO_UPDATE', label: 'Mandatory QCOs' },
          { id: 'STANDARD_REVISION', label: 'Standard Amendments' },
          { id: 'SYSTEM', label: 'Policy & MSME Concessions' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterType(tab.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filterType === tab.id
                ? 'bg-bis-600 text-white font-bold shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications Stream */}
      <div className="space-y-3">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            Loading gazette updates...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 bg-white rounded-2xl border border-slate-200 text-center text-slate-500 text-xs">
            No notifications in this category.
          </div>
        ) : (
          filtered.map((item) => {
            const isSaved = savedIds.includes(item.id);
            return (
              <div
                key={item.id}
                className={`p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-4 ${
                  item.isUrgent
                    ? 'bg-amber-50/60 border-amber-200 shadow-sm'
                    : 'bg-white border-slate-200 shadow-sm hover:shadow-md'
                }`}
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 uppercase">
                      {item.category}
                    </span>
                    {item.isUrgent && (
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-red-100 text-red-700 flex items-center gap-1">
                        <ShieldAlert className="w-3 h-3" /> Mandatory Enforcement
                      </span>
                    )}
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(item.publishedAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm sm:text-base text-slate-900 leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {item.content}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-start">
                  <button
                    onClick={() => toggleSave(item.id)}
                    className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1 transition-colors ${
                      isSaved
                        ? 'bg-bis-50 border-bis-200 text-bis-700'
                        : 'border-slate-200 text-slate-500 hover:bg-slate-50'
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
