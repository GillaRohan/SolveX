import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  Mic, 
  Maximize2, 
  RefreshCw, 
  ChevronDown,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { api } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { ChatMessage } from '../types';

interface FloatingAIAgentProps {
  onOpenFullAssistant?: (initialQuery?: string) => void;
  onOpenVoice?: () => void;
}

export const FloatingAIAgent: React.FC<FloatingAIAgentProps> = ({ 
  onOpenFullAssistant,
  onOpenVoice 
}) => {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'pop-1',
      role: 'assistant',
      content: 'Hello! I am your **BIS AI Assistant**. Ask me about Indian Standards (IS), mandatory QCOs, testing labs, or compliance roadmaps.',
      createdAt: new Date().toISOString()
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: textToSend,
      createdAt: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setLoading(true);

    try {
      const res = await api.chatAI(textToSend, language);
      const assistantMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        content: res.answer,
        sources: res.sources,
        relatedQuestions: res.relatedQuestions,
        recommendedAction: res.recommendedAction,
        createdAt: new Date().toISOString()
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        {
          id: `e-${Date.now()}`,
          role: 'assistant',
          content: 'Could not fetch response. Please try again.',
          createdAt: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickChips = [
    'IS 302 Kettles',
    'IS 4151 Helmets',
    'Gold HUID Hallmark',
    'MSME 50% Concession'
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 select-none">
      {/* ===================== EXPANDED CHAT POPUP ===================== */}
      {isOpen && (
        <div className="relative mb-3 w-[360px] sm:w-[400px] h-[520px] bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden flex flex-col animate-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-[#071D33] via-[#0A2540] to-bis-800 text-white flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-bis-500 to-cyan-400 flex items-center justify-center shadow-sm">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-xs text-white">SolveX BIS Assistant</h3>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <p className="text-[10px] text-slate-300">Grounded Knowledge Agent</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {onOpenFullAssistant && (
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onOpenFullAssistant();
                  }}
                  title="Expand to Full Screen"
                  className="p-1 text-slate-300 hover:text-white rounded-lg transition-colors"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                title="Minimize"
                className="p-1 text-slate-300 hover:text-white rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F8FAFC]">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-bis-600 text-white rounded-br-none'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-sm'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{m.content}</div>

                  {m.sources && m.sources.length > 0 && (
                    <div className="mt-2 pt-1.5 border-t border-slate-100 flex flex-wrap gap-1">
                      {m.sources.slice(0, 2).map((s, i) => (
                        <span key={i} className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-50 text-bis-700 border border-slate-200">
                          {s.standardNumber || s.documentTitle}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-xs text-slate-500 bg-white p-2.5 rounded-xl border border-slate-200 max-w-[70%]">
                <RefreshCw className="w-3 h-3 animate-spin text-bis-600" />
                <span>Grounding response...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="px-3 py-1.5 bg-slate-50 border-t border-slate-200 flex gap-1.5 overflow-x-auto text-[10px]">
            {quickChips.map((chip) => (
              <button
                key={chip}
                onClick={() => handleSend(chip)}
                className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600 hover:bg-bis-50 hover:text-bis-700 shrink-0 transition-colors"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <div className="p-3 bg-white border-t border-slate-200">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(inputQuery);
              }}
              className="flex items-center gap-1.5"
            >
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Ask BIS AI..."
                className="flex-1 px-3 py-2 text-xs bg-slate-100 border border-slate-200 rounded-xl focus:bg-white focus:border-bis-600 outline-none"
              />
              {onOpenVoice && (
                <button
                  type="button"
                  onClick={onOpenVoice}
                  title="Voice Input"
                  className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
                >
                  <Mic className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                type="submit"
                disabled={!inputQuery.trim() || loading}
                className="p-2 bg-bis-600 hover:bg-bis-700 text-white rounded-xl transition-colors disabled:opacity-40"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ===================== FLOATING ACTION BUTTON (FAB) ===================== */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-bis-600 to-cyan-600 hover:from-bis-700 hover:to-cyan-700 text-white rounded-full shadow-2xl shadow-bis-600/40 hover:scale-105 active:scale-95 transition-all duration-200 border border-white/20"
      >
        <div className="relative">
          <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border-2 border-bis-600 rounded-full animate-pulse" />
        </div>

        <div className="text-left hidden sm:block">
          <div className="text-xs font-bold leading-tight">Ask BIS AI</div>
          <div className="text-[10px] text-cyan-200 font-medium leading-none">Instant Assistant</div>
        </div>
      </button>
    </div>
  );
};
