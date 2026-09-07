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
  Send
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
  const { language, setLanguage } = useLanguage();
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
      window.speechSynthesis.cancel(); // cancel prior speech
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0A2540] to-bis-800 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 rounded-xl">
              <Sparkles className="w-5 h-5 text-cyan-300" />
            </div>
            <div>
              <h3 className="font-bold text-base">BIS Voice Assistant</h3>
              <p className="text-[11px] text-slate-300">Natural voice interaction in 6 Indian languages</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Pill */}
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as AppLanguage)}
              className="bg-white/10 text-white border border-white/20 rounded-lg px-2 py-1 text-xs outline-none cursor-pointer"
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code} className="text-slate-800">
                  {l.nativeLabel} ({l.label})
                </option>
              ))}
            </select>

            <button 
              onClick={() => {
                stopSpeaking();
                onClose();
              }}
              className="p-1.5 text-slate-300 hover:text-white rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 flex flex-col items-center justify-center min-h-[300px] text-center space-y-6">
          {/* Micro-Animation State Indicator */}
          {voiceState === 'READY' && (
            <div className="space-y-4">
              <div 
                onClick={startListening}
                className="w-24 h-24 rounded-full bg-gradient-to-tr from-bis-600 to-cyan-500 text-white flex items-center justify-center mx-auto cursor-pointer shadow-xl shadow-bis-600/30 hover:scale-105 active:scale-95 transition-all animate-pulse-ring"
              >
                <Mic className="w-10 h-10" />
              </div>
              <p className="text-sm font-semibold text-slate-700">Tap microphone to speak</p>
              <p className="text-xs text-slate-400 max-w-xs">
                Ask in {LANGUAGES.find(l => l.code === language)?.label}: "Which Indian Standard applies to electric kettles?"
              </p>
            </div>
          )}

          {voiceState === 'LISTENING' && (
            <div className="space-y-4 w-full">
              <div 
                onClick={stopListening}
                className="w-24 h-24 rounded-full bg-red-500 text-white flex items-center justify-center mx-auto cursor-pointer shadow-xl shadow-red-500/40 animate-pulse"
              >
                <Mic className="w-10 h-10" />
              </div>
              <div className="inline-block px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full animate-bounce">
                Listening... Tap to finish
              </div>
              <p className="text-sm text-slate-800 font-medium italic min-h-[40px] px-4">
                "{transcript || 'Speak now...'}"
              </p>
            </div>
          )}

          {voiceState === 'PROCESSING' && (
            <div className="space-y-4">
              <div className="w-20 h-20 rounded-full bg-bis-50 border-2 border-bis-600 text-bis-600 flex items-center justify-center mx-auto">
                <RefreshCw className="w-8 h-8 animate-spin text-bis-600" />
              </div>
              <p className="text-sm font-semibold text-slate-800">Grounding query with BIS knowledge...</p>
              <p className="text-xs text-slate-400">"{transcript}"</p>
            </div>
          )}

          {voiceState === 'ANSWER' && (
            <div className="space-y-4 text-left w-full max-h-80 overflow-y-auto pr-1">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
                <span className="font-bold text-slate-700">You asked:</span> "{transcript}"
              </div>

              <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-2xl text-xs leading-relaxed text-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-bis-800 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-bis-600" />
                    AI Spoken Response
                  </span>
                  {isSpeaking ? (
                    <button 
                      onClick={stopSpeaking}
                      className="p-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg flex items-center gap-1 text-[10px] font-bold"
                    >
                      <VolumeX className="w-3.5 h-3.5" /> Stop Voice
                    </button>
                  ) : (
                    <button 
                      onClick={() => speakAnswer(aiAnswer)}
                      className="p-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg flex items-center gap-1 text-[10px] font-bold"
                    >
                      <Volume2 className="w-3.5 h-3.5" /> Play Voice
                    </button>
                  )}
                </div>
                <div className="whitespace-pre-wrap max-h-52 overflow-y-auto">
                  {aiAnswer}
                </div>
              </div>

              {/* Action */}
              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={() => setVoiceState('READY')}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
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
                    className="flex items-center gap-1.5 px-4 py-2 bg-bis-600 hover:bg-bis-700 text-white rounded-xl text-xs font-bold"
                  >
                    Open in Full Chat
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Typed Fallback Input */}
        <div className="p-4 bg-slate-50 border-t border-slate-200">
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
              className="flex-1 px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:border-bis-600 outline-none"
            />
            <button
              type="submit"
              disabled={!transcript.trim()}
              className="px-4 py-2 bg-bis-600 hover:bg-bis-700 text-white rounded-xl text-xs font-bold disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
