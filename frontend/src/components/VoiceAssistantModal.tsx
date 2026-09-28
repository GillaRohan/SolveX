import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  X, 
  Sparkles, 
  RefreshCw, 
  Globe, 
  ArrowRight,
  Send,
  AlertCircle
} from 'lucide-react';
import { useLanguage, LANGUAGES } from '../context/LanguageContext';
import { api } from '../services/api';
import { AppLanguage } from '../types';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToAssistant?: (query: string) => void;
}

type VoiceState = 'READY' | 'LISTENING' | 'PROCESSING' | 'ANSWER';

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({ 
  isOpen, 
  onClose,
  onNavigateToAssistant 
}) => {
  const { language, setLanguage, t } = useLanguage();
  const [voiceState, setVoiceState] = useState<VoiceState>('READY');
  const [transcript, setTranscript] = useState('');
  const [aiAnswer, setAiAnswer] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechSupported(false);
    }
  }, []);

  const getLangCodeForSpeech = (lang: AppLanguage): string => {
    switch (lang) {
      case 'hi': return 'hi-IN';
      case 'te': return 'te-IN';
      case 'ta': return 'ta-IN';
      case 'kn': return 'kn-IN';
      case 'ml': return 'ml-IN';
      case 'mr': return 'mr-IN';
      case 'bn': return 'bn-IN';
      default: return 'en-IN';
    }
  };

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceState('READY');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.lang = getLangCodeForSpeech(language);
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setVoiceState('LISTENING');
        setTranscript('');
      };

      recognition.onresult = (event: any) => {
        const current = event.resultIndex;
        const text = event.results[current][0].transcript;
        setTranscript(text);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech error:', event.error);
        setVoiceState('READY');
      };

      recognition.onend = () => {
        if (transcript.trim()) {
          processVoiceQuery(transcript.trim());
        } else {
          setVoiceState('READY');
        }
      };

      recognition.start();
    } catch (err) {
      console.warn('Recognition start failed:', err);
      setVoiceState('READY');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    if (transcript.trim()) {
      processVoiceQuery(transcript.trim());
    } else {
      setVoiceState('READY');
    }
  };

  const processVoiceQuery = async (queryText: string) => {
    setVoiceState('PROCESSING');
    try {
      const res = await api.chatAI(queryText, language);
      const answer = res.answer || 'I could not process this request.';
      setAiAnswer(answer);
      setVoiceState('ANSWER');
      speakAnswer(answer);
    } catch (err: any) {
      setAiAnswer('An error occurred while connecting to the BIS AI service.');
      setVoiceState('ANSWER');
    }
  };

  const speakAnswer = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const cleanText = text.replace(/[#*`_]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = getLangCodeForSpeech(language);
      utterance.rate = 1.0;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-[#D4AF37]/50 overflow-hidden flex flex-col text-[#1F2937]">
        {/* Header */}
        <div className="bg-[#FAFAF8] p-5 flex items-center justify-between border-b border-[#E5C066]/30">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#FEF9C3] rounded-xl border border-[#D4AF37]/40 shadow-xs">
              <Sparkles className="w-5 h-5 text-[#996515]" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-[#111827]" style={{ fontFamily: 'Outfit, sans-serif' }}>
                BIS Multilingual Voice Assistant
              </h3>
              <p className="text-[11px] text-[#6B7280]">Interactive voice assistant in 8 Indian languages</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Selector */}
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as AppLanguage)}
              className="bg-white text-[#111827] border border-[#D4AF37]/40 rounded-lg px-2.5 py-1 text-xs outline-none cursor-pointer shadow-2xs font-semibold"
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code} className="text-[#111827]">
                  {l.nativeLabel} ({l.label})
                </option>
              ))}
            </select>

            <button 
              onClick={() => {
                stopSpeaking();
                onClose();
              }}
              className="p-1.5 text-[#6B7280] hover:text-[#111827] hover:bg-gray-100 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 flex flex-col items-center justify-center min-h-[290px] text-center space-y-5 bg-[#FAFAF8]">
          {/* Micro-Animation State Indicator */}
          {voiceState === 'READY' && (
            <div className="space-y-4">
              <div 
                onClick={startListening}
                className="w-24 h-24 rounded-full text-white flex items-center justify-center mx-auto cursor-pointer shadow-xl hover:scale-105 active:scale-95 transition-all"
                style={{
                  background: 'linear-gradient(135deg, #D4AF37 0%, #B8860B 50%, #996515 100%)',
                  boxShadow: '0 8px 30px rgba(201, 162, 39, 0.4)'
                }}
              >
                <Mic className="w-10 h-10 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#111827]">Tap microphone to speak</p>
                <p className="text-xs text-[#6B7280] max-w-xs mx-auto mt-1">
                  Ask in {LANGUAGES.find(l => l.code === language)?.nativeLabel}: "Which standard applies to electric kettles?"
                </p>
              </div>

              {!speechSupported && (
                <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-800 flex items-center justify-center gap-1.5 max-w-xs mx-auto">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>Speech recognition in fallback mode. Type query below.</span>
                </div>
              )}
            </div>
          )}

          {voiceState === 'LISTENING' && (
            <div className="space-y-4 w-full">
              <div 
                onClick={stopListening}
                className="w-24 h-24 rounded-full bg-rose-600 text-white flex items-center justify-center mx-auto cursor-pointer shadow-xl shadow-rose-500/30 animate-pulse"
              >
                <Mic className="w-10 h-10" />
              </div>
              <div className="inline-block px-3 py-1 bg-rose-100 text-rose-800 border border-rose-200 text-xs font-bold rounded-full animate-bounce">
                Listening... Tap to finish
              </div>
              <p className="text-sm text-[#111827] font-medium italic min-h-[40px] px-4">
                "{transcript || 'Speak now...'}"
              </p>
            </div>
          )}

          {voiceState === 'PROCESSING' && (
            <div className="space-y-4">
              <div className="w-20 h-20 rounded-full bg-white border-2 border-[#D4AF37] text-[#996515] flex items-center justify-center mx-auto shadow-sm">
                <RefreshCw className="w-8 h-8 animate-spin text-[#C9A227]" />
              </div>
              <p className="text-sm font-bold text-[#111827]">Grounding query with BIS knowledge...</p>
              <p className="text-xs text-[#6B7280]">"{transcript}"</p>
            </div>
          )}

          {voiceState === 'ANSWER' && (
            <div className="space-y-4 text-left w-full max-h-80 overflow-y-auto pr-1">
              <div className="p-3 bg-white rounded-xl border border-gray-200 text-xs text-[#4B5563] shadow-2xs">
                <span className="font-bold text-[#111827]">You asked:</span> "{transcript}"
              </div>

              <div className="p-4 bg-white border border-[#D4AF37]/40 rounded-2xl text-xs leading-relaxed text-[#1F2937] space-y-2 shadow-xs">
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <span className="font-bold text-[#996515] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#C9A227]" />
                    AI Spoken Response
                  </span>
                  {isSpeaking ? (
                    <button 
                      onClick={stopSpeaking}
                      className="p-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg flex items-center gap-1 text-[10px] font-bold border border-rose-200 cursor-pointer"
                    >
                      <VolumeX className="w-3.5 h-3.5" /> Stop Voice
                    </button>
                  ) : (
                    <button 
                      onClick={() => speakAnswer(aiAnswer)}
                      className="p-1.5 bg-[#FEF9C3] text-[#854D0E] hover:bg-[#FEF08A] rounded-lg flex items-center gap-1 text-[10px] font-bold border border-[#D4AF37]/40 cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-[#996515]" /> Play Voice
                    </button>
                  )}
                </div>
                <div className="whitespace-pre-wrap max-h-52 overflow-y-auto text-[#1F2937]">
                  {aiAnswer}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={() => setVoiceState('READY')}
                  className="px-4 py-2 bg-white hover:bg-gray-50 text-[#374151] rounded-xl text-xs font-semibold border border-gray-200 shadow-2xs cursor-pointer"
                >
                  Ask Another Question
                </button>
                {onNavigateToAssistant && (
                  <button
                    onClick={() => {
                      stopSpeaking();
                      onClose();
                      onNavigateToAssistant(transcript);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 btn-primary text-xs font-bold cursor-pointer"
                  >
                    <span>Open in Full Chat</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Typed Fallback Input */}
        <div className="p-4 bg-white border-t border-gray-100">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              if (transcript.trim()) processVoiceQuery(transcript.trim());
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="Or type voice query here..."
              className="flex-1 px-3.5 py-2 text-xs bg-[#FAFAF8] border border-[#D4AF37]/35 focus:border-[#C9A227] focus:bg-white rounded-xl text-[#111827] placeholder-[#9CA3AF] outline-none shadow-2xs"
            />
            <button
              type="submit"
              disabled={!transcript.trim()}
              className="px-4 py-2 btn-primary text-xs font-bold disabled:opacity-50 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
