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
    { num: '03', key: 'UNDERSTAND', label: 'Understand Clauses', desc: 'Safety tolerances & BOM requirements' },
    { num: '04', key: 'TEST', label: 'Pre-Compliance Test', desc: 'Sample testing in accredited lab' },
    { num: '05', key: 'CERTIFY', label: 'Certify & Audit', desc: 'Form-V filing & factory audit' },
    { num: '06', key: 'COMPLY', label: 'Routine Compliance', desc: 'Scheme of Inspection & Testing (SIT)' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Personalized Compliance Center</h1>
          <p className="text-xs text-slate-500">
            Track statutory certification roadmaps, manage task checklists, and evaluate compliance readiness
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
            Industry / MSME Compliance Mode
          </span>
        </div>
      </div>

      {/* ===================== ROADMAP SELECTOR / CREATOR ===================== */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
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
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeProject?.id === p.id
                    ? 'bg-bis-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
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
            className="flex-1 px-4 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:border-bis-600 outline-none w-full"
          />

          <select
            value={newStandard}
            onChange={(e) => setNewStandard(e.target.value)}
            className="px-3 py-2.5 text-xs border border-slate-300 rounded-xl bg-white font-mono font-bold text-slate-700 outline-none w-full sm:w-auto"
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
            className="px-6 py-2.5 bg-bis-600 hover:bg-bis-700 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50 shrink-0 w-full sm:w-auto flex items-center justify-center gap-1.5 shadow-md shadow-bis-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>Generate Roadmap</span>
          </button>
        </form>
      </div>

      {activeProject ? (
        <div className="space-y-6">
          {/* ===================== VISUAL 6-STAGE ROADMAP JOURNEY ===================== */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-bis-600 uppercase tracking-wider bg-bis-50 px-2.5 py-0.5 rounded border border-bis-200">
                  Statutory 6-Stage Certification Journey
                </span>
                <h2 className="text-lg font-bold text-slate-900 mt-1">
                  {activeProject.product} • {activeProject.standardNumber}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">Readiness Score:</span>
                <span className={`text-base font-black px-3 py-1 rounded-xl border ${
                  activeProject.score >= 80 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300' 
                    : 'bg-amber-50 text-amber-700 border-amber-300'
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
                let cardClass = 'bg-slate-50 border-slate-200 text-slate-600';

                if (isAllDone) {
                  statusBadge = 'Completed';
                  cardClass = 'bg-emerald-50/80 border-emerald-300 text-emerald-900 shadow-sm';
                } else if (isAnyDone) {
                  statusBadge = 'In Progress';
                  cardClass = 'bg-blue-50/80 border-blue-300 text-blue-900 shadow-sm';
                }

                return (
                  <div key={stage.key} className={`p-4 rounded-2xl border ${cardClass} flex flex-col justify-between space-y-2 relative overflow-hidden transition-all`}>
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-black text-xs opacity-60">{stage.num}</span>
                        <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-white/60">
                          {statusBadge}
                        </span>
                      </div>
                      <h4 className="font-bold text-xs mt-1.5 leading-snug">{stage.label}</h4>
                      <p className="text-[10px] opacity-75 mt-0.5">{stage.desc}</p>
                    </div>

                    <div className="pt-2 text-[10px] font-semibold border-t border-black/5">
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
            <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-bis-600" />
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                    Actionable Compliance Tasks
                  </h3>
                </div>
                <span className="text-xs text-slate-400">
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
                          ? 'bg-slate-50/60 border-slate-200 text-slate-400 line-through'
                          : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800 shadow-sm'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                        isDone ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
                      }`}>
                        {isDone && <CheckCircle className="w-3.5 h-3.5" />}
                      </div>

                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className={`font-semibold ${isDone ? 'text-slate-400' : 'text-slate-900'}`}>
                            {task.title}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 shrink-0">
                            {task.category}
                          </span>
                        </div>
                        {task.notes && (
                          <p className="text-[11px] text-slate-500">{task.notes}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Gap Detector & Readiness Score Breakdown (1 col) */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                    Compliance Gap Detector
                  </h3>
                </div>

                {gapAnalysis && (
                  <div className="space-y-4 pt-3 text-xs">
                    {/* Score Bar */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold text-slate-700">
                        <span>Readiness Maturity</span>
                        <span>{gapAnalysis.score}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-bis-600 to-emerald-500 h-2.5 rounded-full transition-all duration-500"
                          style={{ width: `${gapAnalysis.score}%` }}
                        />
                      </div>
                      <p className="text-[10px] text-slate-400 pt-1">{gapAnalysis.scoreExplanation}</p>
                    </div>

                    {/* Missing Requirements Callout */}
                    <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1.5 text-amber-900">
                      <span className="font-bold flex items-center gap-1 text-[11px]">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                        Missing Prerequisites:
                      </span>
                      <ul className="space-y-1 text-[11px] text-slate-700 list-disc list-inside">
                        {gapAnalysis.missingRequirements.slice(0, 2).map((m: string, i: number) => (
                          <li key={i}>{m}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Recommended Actions */}
                    <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl space-y-1.5 text-blue-900">
                      <span className="font-bold flex items-center gap-1 text-[11px]">
                        <Sparkles className="w-3.5 h-3.5 text-bis-600" />
                        Recommended Next Action:
                      </span>
                      <p className="text-[11px] text-slate-700">
                        {gapAnalysis.recommendedActions[0]}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100">
                <button
                  onClick={() => window.print()}
                  className="w-full py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Print / Export Roadmap PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center text-slate-400">
          Loading active compliance project...
        </div>
      )}
    </div>
  );
};
