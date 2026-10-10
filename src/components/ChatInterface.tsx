'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Mic, MicOff, Send, Volume2, VolumeX, Loader2, Trash2, X,
  Bot, User, Sparkles
} from 'lucide-react';
import {
  ChatMessage, getChatHistory, saveChatHistory, clearChatHistory,
  getInsightsEnabled, setInsightsEnabled
} from '@/lib/storage';
import {
  BUDDY_SYSTEM_PROMPT, MANAGER_PRACTICE_PROMPT,
  MANAGER_ROAST_PROMPT, EMERGENCY_PROMPTS, INSIGHT_EXTRACTION_PROMPT
} from '@/lib/prompts';
import { extractAndSaveInsights } from '@/lib/insights';

type ChatMode = 'chat' | 'manager-practice' | 'manager-roast' | 'emergency';

interface ChatInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: ChatMode;
  emergencyType?: string;
  managerProfile?: string;
}

export default function ChatInterface({
  isOpen, onClose, initialMode = 'chat', emergencyType, managerProfile
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [mode, setMode] = useState<ChatMode>(initialMode);
  const [insightsEnabled, setInsightsEnabledState] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Load saved state
  useEffect(() => {
    if (isOpen) {
      const saved = getChatHistory();
      if (initialMode === 'chat' && saved.length > 0) {
        setMessages(saved);
      } else {
        setMessages([]);
      }
      setInsightsEnabledState(getInsightsEnabled());
      setMode(initialMode);

      // Auto-send emergency message
      if (initialMode === 'emergency' && emergencyType) {
        handleEmergencyStart(emergencyType);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, initialMode]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Save chat on changes (only for buddy mode)
  useEffect(() => {
    if (mode === 'chat' && messages.length > 0) {
      saveChatHistory(messages);
    }
  }, [messages, mode]);

  const getSystemPrompt = useCallback(() => {
    switch (mode) {
      case 'manager-practice':
        return MANAGER_PRACTICE_PROMPT + (managerProfile
          ? `\n\nThe user described their manager as: ${managerProfile}`
          : '');
      case 'manager-roast':
        return MANAGER_ROAST_PROMPT + (managerProfile
          ? `\n\nThe user described their manager as: ${managerProfile}`
          : '');
      case 'emergency':
        return BUDDY_SYSTEM_PROMPT;
      default:
        return BUDDY_SYSTEM_PROMPT;
    }
  }, [mode, managerProfile]);

  const handleEmergencyStart = async (type: string) => {
    const prompt = EMERGENCY_PROMPTS[type];
    if (!prompt) return;

    const userMsg: ChatMessage = {
      role: 'user',
      content: type === 'calm-me-down' ? "I need to calm down right now."
        : type === 'overthinking' ? "I can't stop overthinking everything."
        : type === 'terrible-meeting' ? "I just had the worst meeting ever."
        : "I really need to vent right now.",
      timestamp: Date.now(),
      mode: 'emergency'
    };

    setMessages([userMsg]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: BUDDY_SYSTEM_PROMPT + '\n\n' + prompt },
            { role: 'user', content: userMsg.content }
          ],
          mode: 'emergency'
        }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      const assistantMsg: ChatMessage = {
        role: 'assistant',
        content: data.message,
        timestamp: Date.now(),
        mode: 'emergency'
      };

      setMessages(prev => [...prev, assistantMsg]);
      if (!isMuted) speakText(data.message);
    } catch (error) {
      console.error('Emergency chat error:', error);
      const errorMsg: ChatMessage = {
        role: 'assistant',
        content: "I'm here for you. Take a deep breath — in for 4 counts, hold for 4, out for 4. I'm not going anywhere. 💛",
        timestamp: Date.now(),
        mode: 'emergency'
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      role: 'user',
      content: text.trim(),
      timestamp: Date.now(),
      mode
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      // Build context for API — include last 20 messages for context
      const contextMessages = updatedMessages.slice(-20).map(m => ({
        role: m.role,
        content: m.content
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: getSystemPrompt() },
            ...contextMessages
          ],
          mode
        }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      const assistantMsg: ChatMessage = {
        role: 'assistant',
        content: data.message,
        timestamp: Date.now(),
        mode
      };

      const finalMessages = [...updatedMessages, assistantMsg];
      setMessages(finalMessages);

      // Speak the response if not muted
      if (!isMuted) speakText(data.message);

      // Extract insights if enabled and in buddy mode
      if (insightsEnabled && mode === 'chat' && finalMessages.length >= 4) {
        extractAndSaveInsights(finalMessages);
      }
    } catch (error) {
      console.error('Chat error:', error);
      const detail = error instanceof Error ? error.message : 'Unknown error';
      const errorMsg: ChatMessage = {
        role: 'assistant',
        content: detail.includes('API key')
          ? "⚠️ It looks like an API key is missing or not recognized. Please verify your keys in .env.local and restart the server."
          : `Sorry, I had a little hiccup: ${detail}. Could you try again? 🤔`,
        timestamp: Date.now(),
        mode
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const options = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? { mimeType: 'audio/webm;codecs=opus' }
        : MediaRecorder.isTypeSupported('audio/webm')
        ? { mimeType: 'audio/webm' }
        : {};
      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const mimeType = mediaRecorder.mimeType || 'audio/webm';
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        stream.getTracks().forEach(track => track.stop());
        if (audioBlob.size < 800) {
          setIsLoading(false);
          alert('Recording was too short. Please speak a sentence and click stop.');
          return;
        }
        await transcribeAudio(audioBlob);
      };

      mediaRecorder.start(200);
      setIsRecording(true);
    } catch (error) {
      console.error('Microphone error:', error);
      alert('Could not access microphone. Please allow microphone access in your browser settings and try again.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const transcribeAudio = async (audioBlob: Blob) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');

      const response = await fetch('/api/stt', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      if (data.text && data.text.trim()) {
        await sendMessage(data.text);
      } else {
        setIsLoading(false);
        alert('No speech detected in audio. Please try speaking a bit closer to your mic or type below.');
      }
    } catch (error) {
      console.error('Transcription error:', error);
      setIsLoading(false);
      const msg = error instanceof Error ? error.message : 'Could not transcribe audio';
      alert(`Voice note: ${msg}`);
    }
  };

  const speakText = async (text: string) => {
    try {
      // Stop any existing playback
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      setIsSpeaking(true);

      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        setIsSpeaking(false);
        return;
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onended = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
      };

      audio.onerror = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
      };

      await audio.play();
    } catch {
      setIsSpeaking(false);
    }
  };

  const stopSpeaking = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsSpeaking(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    clearChatHistory();
  };

  const toggleInsights = () => {
    const newValue = !insightsEnabled;
    setInsightsEnabledState(newValue);
    setInsightsEnabled(newValue);
  };

  const getModeLabel = () => {
    switch (mode) {
      case 'manager-practice': return '🎭 Manager Practice Mode';
      case 'manager-roast': return '🔥 Roast Mode';
      case 'emergency': return '🆘 Emergency Relief';
      default: return '💬 TIDE Buddy';
    }
  };

  const getModeColor = () => {
    switch (mode) {
      case 'manager-practice': return 'from-[#4A3B32] to-[#604E42]';
      case 'manager-roast': return 'from-[#803D29] to-[#9C4B33]';
      case 'emergency': return 'from-[#3E5244] to-[#516B58]';
      default: return 'from-[#6F4E37] via-[#855333] to-[#A06742]';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl h-[85vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-stone-200 animate-in">
        {/* Header */}
        <div className={`bg-gradient-to-r ${getModeColor()} px-6 py-4 flex items-center justify-between shrink-0 shadow-xs`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm shadow-xs">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">{getModeLabel()}</h3>
              <p className="text-white/80 text-xs">
                {mode === 'manager-roast' ? 'Let it all out! 😤' : 'I\'m here to listen'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            {mode === 'chat' && (
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="text-white/80 hover:text-white transition-colors p-2 rounded-xl hover:bg-white/15 cursor-pointer"
                title="Settings & Insights"
              >
                <Sparkles className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={handleClearChat}
              className="text-white/80 hover:text-white transition-colors p-2 rounded-xl hover:bg-white/15 cursor-pointer"
              title="Clear chat"
            >
              <Trash2 className="w-5 h-5" />
            </button>
            <button
              onClick={() => { stopSpeaking(); onClose(); }}
              className="text-white/80 hover:text-white transition-colors p-2 rounded-xl hover:bg-white/15 cursor-pointer"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Settings panel */}
        {showSettings && (
          <div className="bg-stone-50 px-6 py-3.5 border-b border-stone-200 shrink-0">
            <label className="flex items-center gap-3 cursor-pointer">
              <div className={`relative w-11 h-6 rounded-full transition-colors ${insightsEnabled ? 'bg-[#6F4E37]' : 'bg-stone-300'}`}>
                <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${insightsEnabled ? 'translate-x-[22px]' : 'translate-x-0.5'}`} />
              </div>
              <div>
                <span className="text-stone-800 text-sm font-semibold">Save insights from conversations</span>
                <p className="text-stone-500 text-xs">Populates your personal dashboard with stress trends and reflections</p>
              </div>
            </label>
            <button onClick={toggleInsights} className="sr-only" aria-label="Toggle insights" />
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4 scrollbar-thin bg-stone-50/50">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4 py-8">
              <div className="w-16 h-16 rounded-2xl bg-[#F5EDE5] flex items-center justify-center border border-[#E6DACF] shadow-xs text-[#6F4E37]">
                <Bot className="w-8 h-8" />
              </div>
              <div className="max-w-md px-4">
                <p className="text-stone-800 text-lg font-bold">
                  {mode === 'manager-roast'
                    ? "Ready to roast your fictional boss? Go for it! 🔥"
                    : mode === 'manager-practice'
                    ? "Describe a situation and I'll respond as your manager"
                    : "Hey there! What's on your mind today?"}
                </p>
                <p className="text-stone-500 text-sm mt-1.5 leading-relaxed">
                  {mode === 'chat'
                    ? "Type a message or press the microphone — I'm right here with you. 🎧"
                    : "Type below to start the interaction."}
                </p>
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''} message-appear`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-xs ${
                msg.role === 'user'
                  ? 'bg-[#3D2817] text-white'
                  : 'bg-gradient-to-br from-[#6F4E37] to-[#A06742] text-white'
              }`}>
                {msg.role === 'user'
                  ? <User className="w-4 h-4" />
                  : <Bot className="w-4 h-4" />
                }
              </div>
              <div className={`max-w-[80%] rounded-2xl px-4.5 py-3.5 shadow-2xs ${
                msg.role === 'user'
                  ? 'bg-gradient-to-r from-[#6F4E37] to-[#8D5B3A] text-white'
                  : 'bg-white text-stone-800 border border-stone-200/80 shadow-xs'
              }`}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                {msg.role === 'assistant' && !isMuted && (
                  <button
                    onClick={() => speakText(msg.content)}
                    className="mt-2 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
                    title="Listen to this message"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 message-appear">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-500 to-amber-500 flex items-center justify-center shrink-0 text-white shadow-xs">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white rounded-2xl px-4 py-3 border border-stone-200 shadow-xs">
                <div className="flex gap-1.5 py-1">
                  <div className="w-2 h-2 rounded-full bg-rose-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 rounded-full bg-rose-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="px-6 py-4 border-t border-stone-200 bg-white shrink-0">
          <div className="flex items-end gap-3">
            {/* Mute toggle */}
            <button
              onClick={() => { setIsMuted(!isMuted); if (isSpeaking) stopSpeaking(); }}
              className={`p-3 rounded-xl transition-all cursor-pointer ${
                isMuted ? 'bg-stone-200 text-stone-500' : 'bg-stone-100 text-stone-600 hover:text-stone-900 hover:bg-stone-200/80'
              }`}
              title={isMuted ? 'Unmute voice' : 'Mute voice'}
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>

            {/* Text input */}
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={isRecording ? "🎤 Listening to your voice..." : "Type your thoughts..."}
                className="w-full bg-[#FAF6F0] border border-[#E8DFD5] rounded-xl px-4 py-3 text-stone-800 placeholder-stone-400 resize-none focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#8D5B3A]/30 focus:border-[#8D5B3A] text-sm max-h-32 transition-all shadow-2xs"
                rows={1}
                disabled={isRecording || isLoading}
              />
            </div>

            {/* Mic button */}
            <button
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isLoading && !isRecording}
              className={`p-3 rounded-xl transition-all cursor-pointer ${
                isRecording
                  ? 'bg-red-600 text-white animate-pulse shadow-md shadow-red-600/30'
                  : 'bg-[#F4ECE3] text-[#6F4E37] hover:bg-[#EAE0D5]'
              }`}
              title={isRecording ? 'Stop recording' : 'Start speaking'}
            >
              {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            {/* Send button */}
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isLoading}
              className={`p-3 rounded-xl transition-all cursor-pointer ${
                input.trim() && !isLoading
                  ? 'bg-gradient-to-r from-[#6F4E37] via-[#855333] to-[#A06742] text-white shadow-md shadow-[#6F4E37]/20 hover:shadow-[#6F4E37]/40 hover:scale-105'
                  : 'bg-stone-100 text-stone-300 cursor-not-allowed'
              }`}
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </button>
          </div>

          {isSpeaking && (
            <div className="mt-2.5 flex items-center gap-2">
              <div className="flex gap-1 items-center">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-1 bg-[#8D5B3A] rounded-full animate-pulse" style={{
                    height: `${8 + Math.random() * 12}px`,
                    animationDelay: `${i * 100}ms`
                  }} />
                ))}
              </div>
              <span className="text-[#6B5547] text-xs font-semibold">TIDE is speaking...</span>
              <button onClick={stopSpeaking} className="text-[#8D5B3A] hover:text-[#5C3D28] text-xs underline font-bold ml-1 cursor-pointer">
                Stop
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

}
