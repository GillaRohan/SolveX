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
      content: 'Namaste! I am your **BIS AI Assistant**. Ask me about Indian Standards (IS), mandatory QCOs, testing labs, or certification roadmaps.',
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
        <div className="relative mb-3 w-[360px] sm:w-[400px] h-[520px] bg-white rounded-3xl shadow-2xl border border-[#D4AF37]/45 overflow-hidden flex flex-col animate-in slide-in-from-bottom-5 duration-200 text-[#1F2937]">
          {/* Header */}
          <div className="p-4 bg-[#FAFAF8] text-[#111827] flex items-center justify-between border-b border-[#E5C066]/30">
            <div className="flex items-center gap-2.5">
              <div 
                className="w-8 h-8 rounded-xl flex items-center justify-center shadow-xs"
                style={{ background: 'linear-gradient(135deg, #D4AF37, #996515)' }}
              >
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-extrabold text-xs text-[#111827]" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    BIS AI Quick Agent
                  </h3>
                  <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
                </div>
                <p className="text-[10px] text-[#6B7280]">Grounded Standards Knowledge</p>
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
                  className="p-1 text-[#6B7280] hover:text-[#111827] rounded-lg transition-colors cursor-pointer"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                title="Minimize"
                className="p-1 text-[#6B7280] hover:text-[#111827] rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FAFAF8]">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-white rounded-br-none shadow-xs font-medium'
                      : 'bg-white text-[#1F2937] border border-[#E5C066]/35 rounded-bl-none shadow-xs'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{m.content}</div>

                  {m.sources && m.sources.length > 0 && (
                    <div className="mt-2 pt-1.5 border-t border-gray-100 flex flex-wrap gap-1">
                      {m.sources.slice(0, 2).map((s, i) => (
                        <span key={i} className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#FEF9C3] text-[#996515] border border-[#D4AF37]/30">
                          {s.standardNumber || s.documentTitle}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-xs text-[#6B7280] bg-white p-2.5 rounded-xl border border-gray-200 max-w-[75%]">
                <RefreshCw className="w-3 h-3 animate-spin text-[#C9A227]" />
                <span>Grounding response...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="px-3 py-1.5 bg-white border-t border-gray-100 flex gap-1.5 overflow-x-auto text-[10px]">
            {quickChips.map((chip) => (
              <button
                key={chip}
                onClick={() => handleSend(chip)}
                className="px-2 py-0.5 rounded-md bg-[#FAFAF8] border border-[#E5C066]/30 text-[#374151] hover:bg-[#FEF9C3] hover:text-[#996515] shrink-0 transition-colors cursor-pointer"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <div className="p-3 bg-white border-t border-[#D4AF37]/30">
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
                className="flex-1 px-3 py-2 text-xs bg-[#FAFAF8] border border-[#D4AF37]/40 focus:border-[#C9A227] focus:bg-white rounded-xl text-[#111827] placeholder-[#9CA3AF] outline-none shadow-2xs"
              />

              {onOpenVoice && (
                <button
                  type="button"
                  onClick={onOpenVoice}
                  title="Voice Input"
                  className="p-2 rounded-xl bg-[#FEF9C3] border border-[#D4AF37]/40 text-[#996515] hover:bg-[#FEF08A] transition-colors cursor-pointer"
                >
                  <Mic className="w-3.5 h-3.5" />
                </button>
              )}

              <button
                type="submit"
                disabled={!inputQuery.trim() || loading}
                className="p-2 rounded-xl btn-primary disabled:opacity-40 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5 text-white" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ===================== FLOATING LAUNCHER BUTTON ===================== */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="relative group flex items-center justify-center w-14 h-14 rounded-2xl text-white transition-all shadow-xl hover:scale-105 active:scale-95 cursor-pointer"
          style={{
            background: 'linear-gradient(135deg, #D4AF37 0%, #B8860B 50%, #996515 100%)',
            boxShadow: '0 8px 25px rgba(201, 162, 39, 0.4)'
          }}
        >
          <Bot className="w-6 h-6 text-white" />
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F5D77F] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#D4AF37]"></span>
          </span>
        </button>
      )}
    </div>
  );
};
