import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ArrowRight, 
  Sparkles, 
  FileText, 
  Award, 
  ShieldCheck, 
  RefreshCw, 
  Plus, 
  CheckCircle,
  HelpCircle,
  TrendingUp,
  Download
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../services/api';
import { ComplianceProject, ComplianceTask } from '../types';
import { useAuth } from '../context/AuthContext';

export const ComplianceCenter: React.FC = () => {
  const { user, role } = useAuth();
  const [projects, setProjects] = useState<ComplianceProject[]>([]);
  const [activeProject, setActiveProject] = useState<ComplianceProject | null>(null);
  const [loading, setLoading] = useState(true);

  // New Project Form
  const [newProduct, setNewProduct] = useState('');
  const [newStandard, setNewStandard] = useState('IS 302-2-15');
  const [creating, setCreating] = useState(false);
  const [gapAnalysis, setGapAnalysis] = useState<any>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const data = await api.getComplianceProjects();
      setProjects(data);
      if (data.length > 0 && !activeProject) {
        setActiveProject(data[0]);
        loadGapAnalysis(data[0]);
      }
    } catch (e) {
      console.warn('Failed to load compliance projects:', e);
    } finally {
      setLoading(false);
    }
  };

  const loadGapAnalysis = async (project: ComplianceProject) => {
    const completed = project.tasks.filter(t => t.status === 'COMPLETED').length;
    try {
      const analysis = await api.analyzeGaps(project.id, completed, project.tasks.length);
      setGapAnalysis(analysis);
    } catch (e) {
      console.warn('Gap analysis failed:', e);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.trim()) return;

    setCreating(true);
    try {
      const created = await api.createComplianceProject(newProduct.trim(), newStandard.trim());
      setProjects(prev => [created, ...prev]);
      setActiveProject(created);
      loadGapAnalysis(created);
      setNewProduct('');
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    } catch (err: any) {
      console.warn('Creation failed:', err);
    } finally {
      setCreating(false);
    }
  };

  const toggleTask = async (taskId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
    try {
      const res = await api.updateTaskStatus(taskId, nextStatus);
      if (activeProject) {
        const updatedTasks = activeProject.tasks.map(t => 
          t.id === taskId ? { ...t, status: nextStatus as any } : t
        );
        const updatedProject = {
          ...activeProject,
          score: res.newProjectScore,
          tasks: updatedTasks
        };
        setActiveProject(updatedProject);
        loadGapAnalysis(updatedProject);

        if (nextStatus === 'COMPLETED') {
          confetti({ particleCount: 30, spread: 50, origin: { y: 0.8 } });
        }
      }
    } catch (e) {
      console.warn('Task update failed:', e);
    }
  };

  const stages = [
    { num: '01', key: 'IDENTIFY', label: 'Identify Product', desc: 'Determine classification & scope' },
    { num: '02', key: 'DISCOVER', label: 'Discover Standard', desc: 'Applicable IS & Gazette QCO' },
    { num: '03', key: 'UNDERSTAND', label: 'Understand Clauses', desc: 'Safety tolerances & BOM criteria' },
    { num: '04', key: 'TEST', label: 'Pre-Compliance Test', desc: 'Sample testing in accredited lab' },
    { num: '05', key: 'CERTIFY', label: 'Certify & Audit', desc: 'Form-V filing & factory inspection' },
    { num: '06', key: 'COMPLY', label: 'Routine Compliance', desc: 'Scheme of Inspection & Testing (SIT)' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in text-[#1F2937]">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-6 rounded-sm bg-[#D4AF37]" />
            <h1 className="text-2xl font-extrabold text-[#111827] tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Personalized Compliance Center
            </h1>
          </div>
          <p className="text-xs text-[#6B7280]">
            Track statutory certification roadmaps, manage task checklists, and evaluate compliance readiness
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-3.5 py-1 rounded-full bg-[#FEF9C3] text-[#996515] border border-[#D4AF37]/40 shadow-2xs">
            Industry / MSME Compliance Mode
          </span>
        </div>
      </div>

      {/* ===================== ROADMAP SELECTOR / CREATOR ===================== */}
      <div className="card p-5 sm:p-6 space-y-4 bg-white border border-[#D4AF37]/35 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
          <span className="text-xs font-bold text-[#374151] uppercase tracking-wider">
            Active Compliance Projects ({projects.length})
          </span>

          {/* Quick Select Project Buttons */}
          <div className="flex flex-wrap gap-2">
            {projects.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  setActiveProject(p);
                  loadGapAnalysis(p);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeProject?.id === p.id
                    ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-white shadow-xs'
                    : 'bg-[#FAFAF8] text-[#374151] border border-gray-200 hover:bg-[#FEF9C3]'
                }`}
              >
                {p.product} ({p.standardNumber})
              </button>
            ))}
          </div>
        </div>

        {/* Create New Project Form */}
        <form onSubmit={handleCreateProject} className="flex flex-col sm:flex-row items-center gap-3 pt-1">
          <input
            type="text"
            value={newProduct}
            onChange={(e) => setNewProduct(e.target.value)}
            placeholder="Launch new roadmap for product (e.g. Smart LED Downlight 12W)..."
            className="flex-1 px-4 py-2.5 text-xs sm:text-sm border border-[#D4AF37]/40 rounded-xl focus:border-[#C9A227] outline-none text-[#111827] placeholder-[#9CA3AF] bg-[#FAFAF8] focus:bg-white w-full shadow-2xs transition-all"
          />

          <select
            value={newStandard}
            onChange={(e) => setNewStandard(e.target.value)}
            className="px-3 py-2.5 text-xs border border-[#D4AF37]/40 rounded-xl bg-[#FAFAF8] font-mono font-bold text-[#111827] outline-none focus:border-[#C9A227] w-full sm:w-auto shadow-2xs"
          >
            <option value="IS 302-2-15">IS 302-2-15 (Electric Kettles)</option>
            <option value="IS 4151">IS 4151 (Two Wheeler Helmets)</option>
            <option value="IS 14543">IS 14543 (Packaged Water)</option>
            <option value="IS 16046">IS 16046 (Lithium Batteries)</option>
            <option value="IS 2347">IS 2347 (Pressure Cookers)</option>
          </select>

          <button
            type="submit"
            disabled={creating || !newProduct.trim()}
            className="px-6 py-2.5 btn-primary text-xs font-bold transition-all disabled:opacity-50 shrink-0 w-full sm:w-auto flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>Generate Roadmap</span>
          </button>
        </form>
      </div>

      {activeProject ? (
        <div className="space-y-6">
          {/* ===================== VISUAL 6-STAGE ROADMAP JOURNEY ===================== */}
          <div className="card p-6 space-y-4 bg-white border border-[#D4AF37]/35 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <span className="text-[10px] font-extrabold text-[#996515] uppercase tracking-wider bg-[#FEF9C3] px-2.5 py-0.5 rounded-full border border-[#D4AF37]/40">
                  Statutory 6-Stage Certification Journey
                </span>
                <h2 className="text-lg font-extrabold text-[#111827] mt-1.5" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  {activeProject.product} • {activeProject.standardNumber}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#6B7280]">Readiness Score:</span>
                <span className={`text-base font-black px-3.5 py-1 rounded-xl border ${
                  activeProject.score >= 80 
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
                    : 'bg-[#FEF9C3] text-[#854D0E] border-[#D4AF37]/40'
                }`}>
                  {activeProject.score} / 100
                </span>
              </div>
            </div>

            {/* Stages Flow */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
              {stages.map((stage) => {
                const stageTasks = activeProject.tasks.filter(t => t.category === stage.key);
                const isAllDone = stageTasks.length > 0 && stageTasks.every(t => t.status === 'COMPLETED');
                const isAnyDone = stageTasks.some(t => t.status === 'COMPLETED');

                let statusBadge = 'Pending';
                let cardClass = 'bg-[#FAFAF8] border-gray-200 text-[#4B5563]';

                if (isAllDone) {
                  statusBadge = 'Completed';
                  cardClass = 'bg-emerald-50 border-emerald-300 text-emerald-900 shadow-2xs';
                } else if (isAnyDone) {
                  statusBadge = 'In Progress';
                  cardClass = 'bg-[#FEF9C3] border-[#D4AF37]/50 text-[#854D0E] shadow-2xs';
                }

                return (
                  <div key={stage.key} className={`p-4 rounded-2xl border ${cardClass} flex flex-col justify-between space-y-2 relative overflow-hidden transition-all hover:scale-[1.02]`}>
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-black text-xs text-[#996515]">{stage.num}</span>
                        <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-white/80 border border-gray-200 text-[#374151]">
                          {statusBadge}
                        </span>
                      </div>
                      <h4 className="font-bold text-xs mt-1.5 leading-snug text-[#111827]">{stage.label}</h4>
                      <p className="text-[10px] opacity-75 mt-0.5 text-[#4B5563]">{stage.desc}</p>
                    </div>

                    <div className="pt-2 text-[10px] font-bold border-t border-gray-200 text-[#6B7280]">
                      {stageTasks.filter(t => t.status === 'COMPLETED').length} / {stageTasks.length} tasks
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ===================== CHECKLIST & GAP ANALYSIS GRID ===================== */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Interactive Checklist (2 cols) */}
            <div className="lg:col-span-2 card p-6 space-y-4 bg-white border border-[#D4AF37]/35 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-[#FEF9C3] text-[#996515] rounded-lg border border-[#D4AF37]/40 shadow-xs">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <h3 className="font-extrabold text-[#111827] text-sm sm:text-base" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    Actionable Compliance Tasks
                  </h3>
                </div>
                <span className="text-xs text-[#6B7280]">
                  Tap checkboxes to mark progress
                </span>
              </div>

              <div className="space-y-2.5">
                {activeProject.tasks.map((task) => {
                  const isDone = task.status === 'COMPLETED';
                  return (
                    <div
                      key={task.id}
                      onClick={() => toggleTask(task.id, task.status)}
                      className={`p-3.5 rounded-2xl border text-xs cursor-pointer transition-all flex items-start gap-3 select-none ${
                        isDone
                          ? 'bg-[#F9FAFB] border-gray-200 text-gray-400 line-through'
                          : 'bg-white hover:bg-[#FEF9C3]/30 border-[#E5C066]/30 text-[#111827] hover:border-[#D4AF37] shadow-2xs'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                        isDone ? 'bg-[#D4AF37] border-[#D4AF37] text-white' : 'border-gray-300 bg-white'
                      }`}>
                        {isDone && <CheckCircle className="w-3.5 h-3.5" />}
                      </div>

                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className={`font-semibold ${isDone ? 'text-gray-400' : 'text-[#111827]'}`}>
                            {task.title}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#FEF9C3] text-[#996515] border border-[#D4AF37]/35 shrink-0">
                            {task.category}
                          </span>
                        </div>
                        {task.notes && (
                          <p className="text-[11px] text-[#6B7280]">{task.notes}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Gap Detector & Readiness Score Breakdown (1 col) */}
            <div className="card p-6 space-y-5 flex flex-col justify-between bg-white border border-[#D4AF37]/35 shadow-sm">
              <div>
                <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                  <div className="p-1.5 bg-[#FEF9C3] text-[#996515] rounded-lg border border-[#D4AF37]/40 shadow-xs">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <h3 className="font-extrabold text-[#111827] text-sm sm:text-base" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    Compliance Gap Detector
                  </h3>
                </div>

                {gapAnalysis && (
                  <div className="space-y-4 pt-3 text-xs">
                    {/* Score Bar */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold text-[#111827]">
                        <span>Readiness Maturity</span>
                        <span className="text-[#996515]">{gapAnalysis.score}%</span>
                      </div>
                      <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden border border-gray-200">
                        <div
                          className="bg-gradient-to-r from-[#D4AF37] to-[#996515] h-3 rounded-full transition-all duration-500 shadow-xs"
                          style={{ width: `${gapAnalysis.score}%` }}
                        />
                      </div>
                      <p className="text-[10px] text-[#6B7280] pt-1">{gapAnalysis.scoreExplanation}</p>
                    </div>

                    {/* Missing Requirements Callout */}
                    <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl space-y-1.5 text-amber-900">
                      <span className="font-bold flex items-center gap-1 text-[11px] text-amber-800">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                        Missing Prerequisites:
                      </span>
                      <ul className="space-y-1 text-[11px] text-[#4B5563] list-disc list-inside">
                        {gapAnalysis.missingRequirements.slice(0, 2).map((m: string, i: number) => (
                          <li key={i}>{m}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Recommended Actions */}
                    <div className="p-3.5 bg-[#FEF9C3] border border-[#D4AF37]/40 rounded-2xl space-y-1.5 text-[#854D0E]">
                      <span className="font-bold flex items-center gap-1 text-[11px] text-[#996515]">
                        <Sparkles className="w-3.5 h-3.5 text-[#C9A227]" />
                        Recommended Next Action:
                      </span>
                      <p className="text-[11px] text-[#4B5563]">
                        {gapAnalysis.recommendedActions[0]}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-gray-100">
                <button
                  onClick={() => window.print()}
                  className="w-full py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-[#111827] text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                >
                  <Download className="w-4 h-4 text-[#996515]" />
                  Print / Export Roadmap PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center text-[#6B7280]">
          Loading active compliance project...
        </div>
      )}
    </div>
  );
};
