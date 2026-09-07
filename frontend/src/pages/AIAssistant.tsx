import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Award, 
  ExternalLink, 
  ArrowRight, 
  RefreshCw, 
  ShieldCheck, 
  AlertCircle, 
  Plus, 
  MessageSquare,
  Copy,
  Check,
  FlaskConical,
  CheckCircle2
} from 'lucide-react';
import { api } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { ChatMessage, ChatSource } from '../types';

interface AIAssistantProps {
  initialQuery?: string;
  onNavigateToStandard?: (stdNumber: string) => void;
  onNavigateToCompliance?: () => void;
  onNavigateToLabs?: () => void;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ 
  initialQuery, 
  onNavigateToStandard,
  onNavigateToCompliance,
  onNavigateToLabs
}) => {
  const { language } = useLanguage();
  const { user } = useAuth();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | undefined>(undefined);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const starterPrompts = [
    'I manufacture electric kettles. Which Indian Standard applies to my product?',
    'What are the mandatory testing requirements for protective motorcycle helmets under IS 4151?',
    'How does Compulsory Registration Scheme (CRS) differ from Scheme I ISI Mark?',
    'What microbiological parameters must packaged drinking water pass under IS 14543?'
  ];

  useEffect(() => {
    // Initial greeting message
    if (messages.length === 0) {
      setMessages([
        {
          id: 'm-welcome',
          role: 'assistant',
          content: `Namaste! I am **SolveX**, your **AI Assistant for Indian Standards & BIS Services**.\n\nI can help you:\n1. **Identify Applicable Standards:** Discover which IS standards govern your products.\n2. **Understand Technical Clauses:** Clarify test methods, tolerances, and design criteria.\n3. **Prepare for Certification:** Navigate Scheme I (ISI Mark), Scheme II (CRS), or Hallmarking.\n4. **Find Accredited Labs:** Locate BIS and NABL laboratories for pre-compliance testing.\n\nAsk me about your product or select a recommended query below.`,
          sources: [
            {
              documentTitle: 'Bureau of Indian Standards Act, 2016 & Conformity Assessment Rules',
              sourceUrl: 'https://www.bis.gov.in',
              isOfficial: true
            }
          ],
          relatedQuestions: [
            'Which Indian Standard applies to domestic pressure cookers?',
            'What is the fee concession for MSMEs under ManakOnline?',
            'How to verify a 6-digit gold hallmark HUID code?'
          ],
          recommendedAction: 'Enter your product specifications or industry category',
          createdAt: new Date().toISOString()
        }
      ]);
    }

    if (initialQuery && initialQuery !== inputQuery) {
      sendMessage(initialQuery);
    }
  }, [initialQuery]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: text,
      createdAt: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setLoading(true);

    try {
      const res = await api.chatAI(text, language, conversationId);
      if (res.conversationId) setConversationId(res.conversationId);

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
      const errorMsg: ChatMessage = {
        id: `e-${Date.now()}`,
        role: 'assistant',
        content: `I could not complete your request at this moment: ${err.message}. Please check your connection or try another query.`,
        createdAt: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const startNewChat = () => {
    setConversationId(undefined);
    setMessages([
      {
        id: `m-${Date.now()}`,
        role: 'assistant',
        content: 'New consultation started. Describe your product or question regarding Indian Standards, testing schedules, or BIS schemes.',
        createdAt: new Date().toISOString()
      }
    ]);
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden flex flex-col h-[calc(100vh-8.5rem)] animate-in fade-in">
      {/* Top Header */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-[#071D33] via-[#0A2540] to-bis-800 text-white flex items-center justify-between shrink-0 border-b border-[#143B63]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-bis-500 to-cyan-400 flex items-center justify-center shadow-md">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-base text-white">AI BIS Standards Expert</h2>
              <span className="text-[10px] uppercase font-extrabold bg-cyan-400/20 text-cyan-300 border border-cyan-400/30 px-2 py-0.5 rounded-full">
                Grounded Knowledge RAG
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Citing official Indian Standards, Gazette QCOs, and testing protocols
            </p>
          </div>
        </div>

        <button
          onClick={startNewChat}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors border border-white/15"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Chat</span>
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-[#F8FAFC]">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            {/* Message Bubble */}
            <div
              className={`max-w-3xl rounded-2xl p-4 sm:p-5 space-y-3 shadow-sm ${
                msg.role === 'user'
                  ? 'bg-bis-600 text-white rounded-br-none ml-8'
                  : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none mr-8'
              }`}
            >
              {/* Role Header / Label */}
              <div className="flex items-center justify-between gap-4 text-[11px] opacity-80 border-b pb-2 border-slate-100">
                <span className="font-bold flex items-center gap-1.5">
                  {msg.role === 'user' ? (
                    'You'
                  ) : (
                    <>
                      <Bot className="w-3.5 h-3.5 text-bis-600" />
                      SolveX AI Assistant
                    </>
                  )}
                </span>
                <div className="flex items-center gap-2">
                  <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  {msg.role === 'assistant' && (
                    <button
                      onClick={() => handleCopy(msg.id, msg.content)}
                      title="Copy response"
                      className="hover:text-bis-600 transition-colors"
                    >
                      {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  )}
                </div>
              </div>

              {/* Message Content */}
              <div className={`text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-sans ${
                msg.role === 'user' ? 'text-white' : 'text-slate-800'
              }`}>
                {msg.content}
              </div>

              {/* Authoritative Sources Citations */}
              {msg.sources && msg.sources.length > 0 && (
                <div className="pt-2 border-t border-slate-100 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Authoritative Citations & Sources:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {msg.sources.map((src, i) => (
                      <div
                        key={i}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-700 font-medium"
                      >
                        {src.standardNumber && (
                          <span className="font-mono font-bold text-bis-700">
                            {src.standardNumber}
                          </span>
                        )}
                        {src.clause && <span className="text-slate-500">({src.clause})</span>}
                        {src.documentTitle && !src.standardNumber && (
                          <span>{src.documentTitle}</span>
                        )}
                        <span className="ml-1 text-[9px] font-bold px-1 rounded bg-emerald-100 text-emerald-800">
                          Verified Source
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Next Step Guidance Action Card */}
              {msg.recommendedAction && (
                <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200/80 text-xs flex items-center justify-between gap-3 text-blue-900">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-bis-600 shrink-0" />
                    <div>
                      <strong className="block text-[11px] uppercase tracking-wider text-blue-800">Recommended Next Step:</strong>
                      <span>{msg.recommendedAction}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {onNavigateToStandard && (
                      <button
                        onClick={() => onNavigateToStandard('IS 302-2-15')}
                        className="px-2.5 py-1 bg-bis-600 hover:bg-bis-700 text-white rounded-lg text-[11px] font-bold shadow-sm"
                      >
                        View Standard
                      </button>
                    )}
                    {onNavigateToCompliance && (
                      <button
                        onClick={onNavigateToCompliance}
                        className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-lg text-[11px] font-bold"
                      >
                        Checklist
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Related Questions Chips */}
              {msg.relatedQuestions && msg.relatedQuestions.length > 0 && (
                <div className="pt-2 border-t border-slate-100 space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Related Follow-up Questions:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {msg.relatedQuestions.map((q, i) => (
                      <button
                        key={i}
                        onClick={() => sendMessage(q)}
                        className="text-left text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                      >
                        ↳ {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Official Disclaimer */}
              {msg.role === 'assistant' && (
                <div className="pt-2 text-[10px] text-slate-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 text-amber-500 shrink-0" />
                  <span>
                    AI Guidance: Grounded in BIS knowledge. Always verify applicable requirements against the latest official Gazette QCOs before legal or financial commitments.
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Loading Bubble */}
        {loading && (
          <div className="flex flex-col items-start mr-8">
            <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-none p-4 shadow-sm flex items-center gap-3">
              <RefreshCw className="w-4 h-4 text-bis-600 animate-spin" />
              <span className="text-xs font-medium text-slate-600">
                Searching BIS standards catalog & synthesizing grounded response...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Bottom Starter Prompts (if only welcome message) */}
      {messages.length === 1 && (
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 flex flex-wrap gap-2 items-center">
          <span className="text-[11px] font-semibold text-slate-400">Suggested:</span>
          {starterPrompts.map((p) => (
            <button
              key={p}
              onClick={() => sendMessage(p)}
              className="text-[11px] px-3 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg transition-colors truncate max-w-xs"
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Input Bar */}
      <div className="p-4 bg-white border-t border-slate-200 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage(inputQuery);
          }}
          className="flex items-center gap-2 max-w-4xl mx-auto"
        >
          <div className="relative flex-1">
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask about Indian Standards, testing requirements, or compliance..."
              className="w-full pl-4 pr-10 py-3 text-xs sm:text-sm bg-slate-100/90 focus:bg-white border border-slate-200 focus:border-bis-600 rounded-2xl outline-none transition-all shadow-inner"
            />
          </div>

          <button
            type="submit"
            disabled={!inputQuery.trim() || loading}
            className="px-5 py-3 bg-gradient-to-r from-bis-600 to-bis-800 hover:from-bis-700 hover:to-bis-900 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-md shadow-bis-600/20 transition-all disabled:opacity-40 flex items-center gap-1.5 shrink-0"
          >
            <span>Send</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
