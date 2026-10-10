'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Heart, Wind, Brain, Frown, MessageCircle, Play } from 'lucide-react';
import ChatInterface from './ChatInterface';

const RELIEF_OPTIONS = [
  {
    id: 'calm-me-down',
    icon: Wind,
    label: 'Calm me down',
    description: 'Breathing exercise & grounding',
    cardBg: 'bg-emerald-50/70 hover:bg-emerald-50',
    borderColor: 'border-emerald-200/90 hover:border-emerald-300',
    iconBg: 'bg-emerald-100 text-emerald-700',
  },
  {
    id: 'overthinking',
    icon: Brain,
    label: "I'm overthinking",
    description: 'Break the spiral & center',
    cardBg: 'bg-purple-50/70 hover:bg-purple-50',
    borderColor: 'border-purple-200/90 hover:border-purple-300',
    iconBg: 'bg-purple-100 text-purple-700',
  },
  {
    id: 'terrible-meeting',
    icon: Frown,
    label: 'Terrible meeting',
    description: 'Quick emotional debrief',
    cardBg: 'bg-amber-50/70 hover:bg-amber-50',
    borderColor: 'border-amber-200/90 hover:border-amber-300',
    iconBg: 'bg-amber-100 text-amber-700',
  },
  {
    id: 'need-to-vent',
    icon: MessageCircle,
    label: 'I need to vent',
    description: "I'll just listen quietly",
    cardBg: 'bg-rose-50/70 hover:bg-rose-50',
    borderColor: 'border-rose-200/90 hover:border-rose-300',
    iconBg: 'bg-rose-100 text-rose-700',
  },
];

export default function EmergencyRelief() {
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<string>('');

  const handleSelect = (id: string) => {
    setSelectedType(id);
    setChatOpen(true);
  };

  return (
    <>
      <div className="bg-white rounded-2xl p-6 border border-[#E8DFD5] shadow-xs overflow-hidden relative">
        {/* Soft background warm gradient blob */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl from-[#6E8862]/10 to-transparent rounded-bl-full pointer-events-none" />

        <div className="flex items-center gap-3 mb-4 relative">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4E6144] to-[#6E8862] flex items-center justify-center text-white shadow-xs">
            <Heart className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-[#2D1E14] font-bold text-lg">Emergency Relief Mode</h3>
            <p className="text-[#7D6656] text-xs">Get quick, guided support when you feel overwhelmed</p>
          </div>
        </div>

        {/* Visual Graphic Preview */}
        <div className="relative w-full max-w-xs sm:max-w-sm mx-auto mb-5 bg-[#FAF6F0] rounded-2xl p-2 border border-[#E8DFD5] shadow-2xs overflow-hidden group">
          <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-white">
            <Image
              src="/emergency-relief.png"
              alt="Emergency Relief Mode guided breathing circle and quick support"
              fill
              className="object-contain p-2 transition-transform duration-300 group-hover:scale-[1.02]"
              priority
            />
          </div>
          <button
            onClick={() => handleSelect('calm-me-down')}
            className="w-full mt-2 py-2.5 px-3 bg-[#2D1E14] hover:bg-[#422C1D] text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-all shadow-2xs cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            Start Guided Breathing (2 min)
          </button>
        </div>

        <p className="text-[#6B5547] text-xs leading-relaxed font-medium mb-3 text-center">
          Or tap a quick support session below:
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          {RELIEF_OPTIONS.map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.id}
                onClick={() => handleSelect(option.id)}
                className={`${option.cardBg} border ${option.borderColor} rounded-xl p-4 text-left transition-all hover:scale-[1.02] shadow-2xs group cursor-pointer`}
              >
                <div className={`w-8 h-8 rounded-lg ${option.iconBg} flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-4.5 h-4.5" />
                </div>
                <h4 className="text-stone-900 font-bold text-sm">{option.label}</h4>
                <p className="text-stone-600 text-xs mt-0.5 leading-relaxed">{option.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      <ChatInterface
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        initialMode="emergency"
        emergencyType={selectedType}
      />
    </>
  );
}
