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
import { api } from '../services/api';

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
      await fetch('/api/admin/standards', {
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
      await fetch('/api/notifications', {
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
    <div className="space-y-6 animate-in fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Admin Command Center</h1>
        <p className="text-xs text-slate-500">
          Supervise knowledge ingestion, catalog standards, issue gazette alerts, and inspect telemetry
        </p>
      </div>

      {/* Analytics Grid */}
      {analytics && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs text-slate-400 font-semibold block">Active Users</span>
            <div className="text-2xl font-black text-slate-900 mt-1">
              {analytics.stats.activeUsers}
            </div>
            <span className="text-[10px] text-emerald-600 font-medium">Pan-India portal telemetry</span>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs text-slate-400 font-semibold block">Standards Indexed</span>
            <div className="text-2xl font-black text-slate-900 mt-1">
              {analytics.stats.standardsIndexed}
            </div>
            <span className="text-[10px] text-bis-600 font-medium">Authoritative database</span>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs text-slate-400 font-semibold block">Documents Analyzed</span>
            <div className="text-2xl font-black text-slate-900 mt-1">
              {analytics.stats.documentsAnalyzed}
            </div>
            <span className="text-[10px] text-purple-600 font-medium">Technical specs parsed</span>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs text-slate-400 font-semibold block">AI Consultations</span>
            <div className="text-2xl font-black text-slate-900 mt-1">
              {analytics.stats.aiConsultations}
            </div>
            <span className="text-[10px] text-cyan-600 font-medium">Grounded RAG interactions</span>
          </div>
        </div>
      )}

      {/* Forms Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form 1: Publish Standard */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Award className="w-5 h-5 text-bis-600" />
            <h2 className="font-bold text-slate-900 text-sm">Publish New Indian Standard</h2>
          </div>

          {stdSuccess && (
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              Standard published successfully!
            </div>
          )}

          <form onSubmit={handleAddStandard} className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Standard Number</label>
              <input
                type="text"
                required
                value={stdNum}
                onChange={(e) => setStdNum(e.target.value)}
                placeholder="e.g. IS 15885"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono uppercase focus:border-bis-600 outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Title</label>
              <input
                type="text"
                required
                value={stdTitle}
                onChange={(e) => setStdTitle(e.target.value)}
                placeholder="Title / Description of Standard"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:border-bis-600 outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Category</label>
              <select
                value={stdCategory}
                onChange={(e) => setStdCategory(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white outline-none"
              >
                <option value="Electrical & Electronics">Electrical & Electronics</option>
                <option value="Mechanical & Automotive">Mechanical & Automotive</option>
                <option value="Food, Water & Agriculture">Food, Water & Agriculture</option>
                <option value="Electronics & IT Goods">Electronics & IT Goods</option>
                <option value="Gold & Hallmarking">Gold & Hallmarking</option>
                <option value="Toys & Children Products">Toys & Children Products</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Description</label>
              <textarea
                value={stdDesc}
                onChange={(e) => setStdDesc(e.target.value)}
                rows={2}
                placeholder="Scope and requirements summary..."
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:border-bis-600 outline-none"
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={stdMandatory}
                onChange={(e) => setStdMandatory(e.target.checked)}
                className="rounded text-bis-600"
              />
              <span className="font-semibold text-slate-700">Mandatory Quality Control Order (QCO)</span>
            </label>

            <button
              type="submit"
              className="w-full py-2.5 bg-bis-600 hover:bg-bis-700 text-white rounded-xl font-bold transition-all shadow-sm"
            >
              Publish to Registry
            </button>
          </form>
        </div>

        {/* Form 2: Issue Gazette Notification */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Bell className="w-5 h-5 text-amber-600" />
            <h2 className="font-bold text-slate-900 text-sm">Issue Gazette Notification</h2>
          </div>

          {notifSuccess && (
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              Notification published to alerts stream!
            </div>
          )}

          <form onSubmit={handleAddNotification} className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Alert Title</label>
              <input
                type="text"
                required
                value={notifTitle}
                onChange={(e) => setNotifTitle(e.target.value)}
                placeholder="e.g. Gazette Order: Mandatory ISI Mark on Toys..."
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:border-bis-600 outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Category</label>
              <select
                value={notifCategory}
                onChange={(e) => setNotifCategory(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white outline-none"
              >
                <option value="Gazette Order">Gazette Order</option>
                <option value="Technical Revision">Technical Revision</option>
                <option value="MSME Policy">MSME Policy</option>
                <option value="Hallmarking Notice">Hallmarking Notice</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Notification Body</label>
              <textarea
                required
                value={notifContent}
                onChange={(e) => setNotifContent(e.target.value)}
                rows={3}
                placeholder="Full text of gazette order or regulatory advisory..."
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:border-bis-600 outline-none"
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={notifUrgent}
                onChange={(e) => setNotifUrgent(e.target.checked)}
                className="rounded text-red-600"
              />
              <span className="font-semibold text-slate-700">Flag as Urgent Statutory Enforcement</span>
            </label>

            <button
              type="submit"
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition-all shadow-sm"
            >
              Broadcast Notification
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
