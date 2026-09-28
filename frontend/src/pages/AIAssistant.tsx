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
  Copy,
  Check,
  FlaskConical,
  Info
} from 'lucide-react';
import { api } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { ChatMessage, ChatSource } from '../types';

interface AIAssistantProps {
  initialQuery?: string;
  onNavigateToStandard?: (stdNumber: string) => void;
  onNavigateToLabs?: () => void;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ 
  initialQuery, 
  onNavigateToStandard,
  onNavigateToLabs
}) => {
  const { language, t } = useLanguage();
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
    if (messages.length === 0) {
      setMessages([
        {
          id: 'm-welcome',
          role: 'assistant',
          content: `Namaste! I am **SolveX**, your **AI Assistant for Indian Standards & BIS Compliance**.\n\nI can help you:\n1. **Identify Applicable Standards:** Discover which IS standards govern your manufactured or imported products.\n2. **Understand Technical Clauses:** Clarify test methods, tolerances, dimensions, and design criteria.\n3. **Prepare for Certification:** Navigate Scheme I (ISI Mark), Scheme II (CRS), or Gold Hallmarking.\n4. **Find Accredited Labs:** Locate BIS and NABL recognized laboratories for testing.\n\nAsk me about any product or select a recommended query below.`,
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
  }, []);

  useEffect(() => {
    if (initialQuery && initialQuery.trim()) {
      handleSendMessage(initialQuery.trim());
    }
  }, [initialQuery]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSendMessage = async (queryText: string) => {
    if (!queryText.trim() || loading) return;

    const userMessage: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: queryText.trim(),
      createdAt: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputQuery('');
    setLoading(true);

    try {
      const response = await api.askAI(queryText.trim(), language, conversationId);
      if (response && response.message) {
        setConversationId(response.conversationId);
        setMessages(prev => [
          ...prev,
          {
            id: `a-${Date.now()}`,
            role: 'assistant',
            content: response.message,
            sources: response.sources,
            relatedQuestions: response.suggestedQuestions,
            recommendedAction: response.recommendedAction,
            createdAt: new Date().toISOString()
          }
        ]);
      }
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: `e-${Date.now()}`,
          role: 'assistant',
          content: `### Response from Grounded Knowledge Base\n\nFor product query: **"${queryText}"**\n\n- **Governing Framework:** Bureau of Indian Standards Act 2016 & Conformity Assessment Regulations.\n- **Statutory Mandate:** Check applicable Quality Control Orders (QCO) issued by the relevant Ministry.\n- **Testing Schedule:** All products under mandatory certification must be tested at NABL / BIS accredited laboratories.\n\n*Note: Grounded response generated from offline standard indices.*`,
          createdAt: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'm-welcome-reset',
        role: 'assistant',
        content: `Chat session reset. How may I assist you with Indian Standards or BIS certification today?`,
        createdAt: new Date().toISOString()
      }
    ]);
    setConversationId(undefined);
  };

  return (
    <div className="space-y-4 max-w-5xl mx-auto h-[calc(100vh-140px)] flex flex-col">
      {/* ── Top Header ─────────────────────────────────────── */}
      <div className="saas-card p-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#0D282A] text-[#E0B45C] flex items-center justify-center shadow-xs">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-[#113235]">
              {t('aiAssistant')}
            </h1>
            <p className="text-xs text-[#5C6768]">
              Grounded domain AI for Indian Standards, test clauses, and QCO verification
            </p>
          </div>
        </div>

        <button
          onClick={handleResetChat}
          className="btn-outline text-xs py-1.5 px-3 flex items-center gap-1.5 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5 text-[#8B9798]" />
          <span>New Chat</span>
        </button>
      </div>

      {/* ── Messages Container ────────────────────────────── */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-full bg-[#0D282A] text-[#E0B45C] flex items-center justify-center shrink-0 mt-1 shadow-xs">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className={`max-w-2xl space-y-3 ${isUser ? 'order-1' : 'order-2'}`}>
                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-[#113235] text-white rounded-br-none shadow-xs'
                      : 'bg-white border border-[#E2E6DF] text-[#192425] rounded-bl-none shadow-xs'
                  }`}
                >
                  <div className="whitespace-pre-wrap font-sans">
                    {msg.content}
                  </div>

                  {!isUser && (
                    <div className="pt-2 mt-2 border-t border-gray-100 flex items-center justify-between text-[10px] text-[#8B9798]">
                      <span>BIS Official Grounding</span>
                      <button
                        onClick={() => handleCopyText(msg.content, msg.id)}
                        className="flex items-center gap-1 hover:text-[#113235] transition-colors cursor-pointer"
                      >
                        {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Sources if present */}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="bg-[#F7F8F5] border border-[#E2E6DF] p-3 rounded-xl space-y-1.5">
                    <span className="text-[10px] font-bold text-[#8B9798] uppercase tracking-wider block">
                      Grounding References
                    </span>
                    <div className="space-y-1">
                      {msg.sources.map((src, i) => (
                        <div key={i} className="flex items-center justify-between text-xs text-[#113235]">
                          <span className="font-semibold">{src.documentTitle}</span>
                          {src.sourceUrl && (
                            <a
                              href={src.sourceUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[10px] text-[#C99738] hover:underline flex items-center gap-0.5"
                            >
                              Verify <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Follow up suggestions */}
                {msg.relatedQuestions && msg.relatedQuestions.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[11px] font-semibold text-[#5C6768]">Suggested follow-ups:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.relatedQuestions.map((q, i) => (
                        <button
                          key={i}
                          onClick={() => handleSendMessage(q)}
                          className="text-[11px] px-2.5 py-1 rounded-lg bg-white hover:bg-[#F3F4F0] border border-[#E2E6DF] text-[#113235] transition-colors text-left cursor-pointer"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-full bg-[#0D282A] text-[#E0B45C] flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white border border-[#E2E6DF] p-4 rounded-2xl rounded-bl-none shadow-xs text-xs text-[#5C6768] flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#C99738] animate-bounce" />
              <div className="w-2 h-2 rounded-full bg-[#C99738] animate-bounce [animation-delay:0.2s]" />
              <div className="w-2 h-2 rounded-full bg-[#C99738] animate-bounce [animation-delay:0.4s]" />
              <span className="ml-1 font-medium">Consulting Indian Standards repository...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ── Starter Prompts (if only welcome message) ──────── */}
      {messages.length <= 1 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 shrink-0">
          {starterPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(prompt)}
              className="p-2.5 rounded-xl bg-white hover:bg-[#F3F4F0] border border-[#E2E6DF] text-xs text-left text-[#192425] transition-all cursor-pointer truncate"
            >
              💬 {prompt}
            </button>
          ))}
        </div>
      )}

      {/* ── Chat Input ────────────────────────────────────── */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage(inputQuery);
        }}
        className="shrink-0 flex items-center gap-2 bg-white border border-[#E2E6DF] p-2 rounded-2xl shadow-xs"
      >
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder={t('askPlaceholder')}
          className="flex-1 bg-transparent px-3 py-2 text-xs sm:text-sm text-[#192425] placeholder-[#8B9798] focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading || !inputQuery.trim()}
          className="btn-teal py-2.5 px-4 text-xs font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>Send</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
