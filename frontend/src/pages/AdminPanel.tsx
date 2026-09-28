import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Users, 
  Award, 
  FileText, 
  FlaskConical, 
  TrendingUp, 
  Plus, 
  Trash2, 
  Bell, 
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { api, API_BASE } from '../services/api';

export const AdminPanel: React.FC = () => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // New standard form state
  const [stdNum, setStdNum] = useState('');
  const [stdTitle, setStdTitle] = useState('');
  const [stdCategory, setStdCategory] = useState('Electrical & Electronics');
  const [stdDesc, setStdDesc] = useState('');
  const [stdMandatory, setStdMandatory] = useState(true);
  const [stdSuccess, setStdSuccess] = useState(false);

  // New notification form state
  const [notifTitle, setNotifTitle] = useState('');
  const [notifContent, setNotifContent] = useState('');
  const [notifCategory, setNotifCategory] = useState('Gazette Order');
  const [notifUrgent, setNotifUrgent] = useState(false);
  const [notifSuccess, setNotifSuccess] = useState(false);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const data = await api.getAdminAnalytics();
      setAnalytics(data);
    } catch (e) {
      console.warn('Admin analytics fetch failed:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStandard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stdNum.trim() || !stdTitle.trim()) return;

    try {
      await fetch(`${API_BASE}/admin/standards`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          standardNumber: stdNum.trim(),
          title: stdTitle.trim(),
          category: stdCategory,
          description: stdDesc.trim(),
          isMandatory: stdMandatory
        })
      });

      setStdSuccess(true);
      setStdNum('');
      setStdTitle('');
      setStdDesc('');
      fetchAdminData();
      setTimeout(() => setStdSuccess(false), 3000);
    } catch (err) {
      console.warn('Failed to add standard:', err);
    }
  };

  const handleAddNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifTitle.trim() || !notifContent.trim()) return;

    try {
      await fetch(`${API_BASE}/notifications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: notifTitle.trim(),
          content: notifContent.trim(),
          category: notifCategory,
          isUrgent: notifUrgent
        })
      });

      setNotifSuccess(true);
      setNotifTitle('');
      setNotifContent('');
      setTimeout(() => setNotifSuccess(false), 3000);
    } catch (err) {
      console.warn('Failed to add notification:', err);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in text-[#1F2937]">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-6 rounded-sm bg-[#DC2626]" />
          <h1 className="text-2xl font-extrabold text-[#111827] tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
            BIS Officer &amp; Admin Command Center
          </h1>
        </div>
        <p className="text-xs text-[#6B7280]">
          Supervise knowledge ingestion, catalog standards, issue gazette alerts, and inspect national telemetry
        </p>
      </div>

      {/* Analytics Grid */}
      {analytics && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="card p-4 bg-white border border-[#D4AF37]/35 shadow-sm">
            <span className="text-xs text-[#6B7280] font-bold block">Active Users</span>
            <div className="text-2xl font-black text-[#111827] mt-1" style={{ fontFamily: 'Outfit, sans-serif' }}>
              {analytics.stats.activeUsers}
            </div>
            <span className="text-[10px] text-[#996515] font-bold">Pan-India portal telemetry</span>
          </div>

          <div className="card p-4 bg-white border border-[#D4AF37]/35 shadow-sm">
            <span className="text-xs text-[#6B7280] font-bold block">Standards Indexed</span>
            <div className="text-2xl font-black text-[#996515] mt-1" style={{ fontFamily: 'Outfit, sans-serif' }}>
              {analytics.stats.standardsIndexed}
            </div>
            <span className="text-[10px] text-[#854D0E] font-bold">Authoritative database</span>
          </div>

          <div className="card p-4 bg-white border border-[#D4AF37]/35 shadow-sm">
            <span className="text-xs text-[#6B7280] font-bold block">Documents Analyzed</span>
            <div className="text-2xl font-black text-[#111827] mt-1" style={{ fontFamily: 'Outfit, sans-serif' }}>
              {analytics.stats.documentsAnalyzed}
            </div>
            <span className="text-[10px] text-[#7C3AED] font-bold">Technical specs parsed</span>
          </div>

          <div className="card p-4 bg-white border border-[#D4AF37]/35 shadow-sm">
            <span className="text-xs text-[#6B7280] font-bold block">AI Consultations</span>
            <div className="text-2xl font-black text-[#996515] mt-1" style={{ fontFamily: 'Outfit, sans-serif' }}>
              {analytics.stats.aiConsultations}
            </div>
            <span className="text-[10px] text-emerald-700 font-bold">Grounded RAG interactions</span>
          </div>
        </div>
      )}

      {/* Forms Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form 1: Publish Standard */}
        <div className="card p-6 space-y-4 bg-white border border-[#D4AF37]/35 shadow-sm">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
            <div className="p-1.5 rounded-lg bg-[#FEF9C3] text-[#996515] border border-[#D4AF37]/40 shadow-xs">
              <Award className="w-5 h-5" />
            </div>
            <h2 className="font-bold text-[#111827] text-sm sm:text-base" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Publish New Indian Standard
            </h2>
          </div>

          {stdSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              Standard published to registry successfully!
            </div>
          )}

          <form onSubmit={handleAddStandard} className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-[#374151] mb-1">Standard Number</label>
              <input
                type="text"
                required
                value={stdNum}
                onChange={(e) => setStdNum(e.target.value)}
                placeholder="e.g. IS 15885"
                className="w-full px-3.5 py-2 border border-[#D4AF37]/40 rounded-xl font-mono uppercase outline-none text-[#111827] bg-[#FAFAF8] focus:bg-white focus:border-[#C9A227] shadow-2xs"
              />
            </div>

            <div>
              <label className="block font-bold text-[#374151] mb-1">Title</label>
              <input
                type="text"
                required
                value={stdTitle}
                onChange={(e) => setStdTitle(e.target.value)}
                placeholder="Title / Description of Standard"
                className="w-full px-3.5 py-2 border border-[#D4AF37]/40 rounded-xl outline-none text-[#111827] bg-[#FAFAF8] focus:bg-white focus:border-[#C9A227] shadow-2xs"
              />
            </div>

            <div>
              <label className="block font-bold text-[#374151] mb-1">Category</label>
              <select
                value={stdCategory}
                onChange={(e) => setStdCategory(e.target.value)}
                className="w-full px-3.5 py-2 border border-[#D4AF37]/40 rounded-xl bg-[#FAFAF8] focus:bg-white text-[#111827] outline-none focus:border-[#C9A227] shadow-2xs font-medium"
              >
                <option value="Electrical & Electronics">Electrical &amp; Electronics</option>
                <option value="Mechanical & Automotive">Mechanical &amp; Automotive</option>
                <option value="Food, Water & Agriculture">Food, Water &amp; Agriculture</option>
                <option value="Electronics & IT Goods">Electronics &amp; IT Goods</option>
                <option value="Gold & Hallmarking">Gold &amp; Hallmarking</option>
                <option value="Toys & Children Products">Toys &amp; Children Products</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-[#374151] mb-1">Description</label>
              <textarea
                value={stdDesc}
                onChange={(e) => setStdDesc(e.target.value)}
                rows={2}
                placeholder="Scope and requirements summary..."
                className="w-full px-3.5 py-2 border border-[#D4AF37]/40 rounded-xl outline-none text-[#111827] bg-[#FAFAF8] focus:bg-white focus:border-[#C9A227] shadow-2xs"
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer pt-1 select-none">
              <input
                type="checkbox"
                checked={stdMandatory}
                onChange={(e) => setStdMandatory(e.target.checked)}
                className="rounded text-[#C9A227] focus:ring-[#D4AF37]"
              />
              <span className="font-bold text-[#374151]">Mandatory Quality Control Order (QCO)</span>
            </label>

            <button
              type="submit"
              className="w-full py-2.5 btn-primary font-bold transition-all shadow-sm cursor-pointer"
            >
              Publish to Registry
            </button>
          </form>
        </div>

        {/* Form 2: Issue Gazette Notification */}
        <div className="card p-6 space-y-4 bg-white border border-[#D4AF37]/35 shadow-sm">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
            <div className="p-1.5 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 shadow-xs">
              <Bell className="w-5 h-5 text-amber-600" />
            </div>
            <h2 className="font-bold text-[#111827] text-sm sm:text-base" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Issue Gazette Notification
            </h2>
          </div>

          {notifSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              Notification published to alerts stream!
            </div>
          )}

          <form onSubmit={handleAddNotification} className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-[#374151] mb-1">Alert Title</label>
              <input
                type="text"
                required
                value={notifTitle}
                onChange={(e) => setNotifTitle(e.target.value)}
                placeholder="e.g. Gazette Order: Mandatory ISI Mark on Toys..."
                className="w-full px-3.5 py-2 border border-[#D4AF37]/40 rounded-xl outline-none text-[#111827] bg-[#FAFAF8] focus:bg-white focus:border-[#C9A227] shadow-2xs"
              />
            </div>

            <div>
              <label className="block font-bold text-[#374151] mb-1">Category</label>
              <select
                value={notifCategory}
                onChange={(e) => setNotifCategory(e.target.value)}
                className="w-full px-3.5 py-2 border border-[#D4AF37]/40 rounded-xl bg-[#FAFAF8] focus:bg-white text-[#111827] outline-none focus:border-[#C9A227] shadow-2xs font-medium"
              >
                <option value="Gazette Order">Gazette Order</option>
                <option value="Technical Revision">Technical Revision</option>
                <option value="MSME Policy">MSME Policy</option>
                <option value="Hallmarking Notice">Hallmarking Notice</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-[#374151] mb-1">Notification Body</label>
              <textarea
                required
                value={notifContent}
                onChange={(e) => setNotifContent(e.target.value)}
                rows={3}
                placeholder="Full text of gazette order or regulatory advisory..."
                className="w-full px-3.5 py-2 border border-[#D4AF37]/40 rounded-xl outline-none text-[#111827] bg-[#FAFAF8] focus:bg-white focus:border-[#C9A227] shadow-2xs"
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer pt-1 select-none">
              <input
                type="checkbox"
                checked={notifUrgent}
                onChange={(e) => setNotifUrgent(e.target.checked)}
                className="rounded text-rose-500 focus:ring-rose-500"
              />
              <span className="font-bold text-[#374151]">Flag as Urgent Statutory Enforcement</span>
            </label>

            <button
              type="submit"
              className="w-full py-2.5 btn-primary font-bold transition-all shadow-sm cursor-pointer"
            >
              Broadcast Notification
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
