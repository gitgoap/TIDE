'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  MessageCircle, Mic, Shield, Heart, Sparkles,
  Network, Crown, Scale, Activity, ChevronDown,
  ArrowRight
} from 'lucide-react';
import ChatInterface from '@/components/ChatInterface';
import ManagerTwin from '@/components/ManagerTwin';
import EmergencyRelief from '@/components/EmergencyRelief';
import StressMap from '@/components/StressMap';
import RealityCheck from '@/components/RealityCheck';
import RecoveryLab from '@/components/RecoveryLab';

const FEATURES = [
  {
    icon: Network,
    title: 'Life–Work Stress Map',
    description: 'See how your stressors connect across work, relationships, family, and personal life.',
    color: 'from-[#7A4B2A] to-[#A5673F]',
    borderColor: 'border-[#E6DACF]',
    iconBg: 'bg-[#F3EBE3] text-[#7A4B2A]',
  },
  {
    icon: Crown,
    title: 'Manager Twin',
    description: 'Practice tough conversations or hilariously roast a fictional version of your boss.',
    color: 'from-[#8C5832] to-[#B3784A]',
    borderColor: 'border-[#E6DACF]',
    iconBg: 'bg-[#F5EDE5] text-[#8C5832]',
  },
  {
    icon: Heart,
    title: 'Emergency Relief',
    description: 'Quick 2-minute guided support for those "I need a break RIGHT NOW" moments.',
    color: 'from-[#5D7052] to-[#7B9270]',
    borderColor: 'border-[#E2E8DF]',
    iconBg: 'bg-[#EFF5EC] text-[#4E6144]',
  },
  {
    icon: Scale,
    title: 'Reality Check',
    description: 'Separate what happened from what you\'re assuming. Find a practical next step.',
    color: 'from-[#55697A] to-[#72899C]',
    borderColor: 'border-[#DEE6ED]',
    iconBg: 'bg-[#EDF3F7] text-[#475C6E]',
  },
  {
    icon: Activity,
    title: 'Personal Recovery Lab',
    description: 'Track your mood, stressors, and recovery journey with AI-powered reflections.',
    color: 'from-[#73526B] to-[#966E8D]',
    borderColor: 'border-[#EADEE6]',
    iconBg: 'bg-[#F6EEF3] text-[#694861]',
  },
];

export default function Home() {
  const [chatOpen, setChatOpen] = useState(false);

  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen hero-gradient relative z-10 text-[#2D1E14]">
      {/* ═══════════════════════════════════════════ */}
      {/* HERO SECTION */}
      {/* ═══════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-10 pb-16 overflow-hidden">
        {/* Soft decorative background orbs with warm mocha/caramel hues */}
        <div className="absolute top-16 left-8 w-80 h-80 bg-[#8D5B3A]/10 rounded-full blur-[90px] pointer-events-none" />
        <div className="absolute bottom-16 right-8 w-96 h-96 bg-[#B57951]/12 rounded-full blur-[110px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-[#E8DFD5]/40 rounded-full blur-[140px] pointer-events-none" />

        {/* Logo / Brand */}
        <div className="relative z-10 flex items-center gap-3 mb-8 bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-[#E8DFD5] shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6F4E37] to-[#A06742] flex items-center justify-center shadow-md shadow-[#6F4E37]/20 text-white">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[#2D1E14] font-extrabold text-xl tracking-wider">TIDE</span>
            <span className="text-[#7D6656] text-[10px] tracking-widest uppercase font-bold -mt-0.5">This Too Shall Pass</span>
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative z-10 mb-8 float-animation">
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96">
            <div className="absolute inset-0 bg-gradient-to-b from-[#8D5B3A]/20 to-[#B57951]/20 rounded-full blur-2xl" />
            <Image
              src="/hero.png"
              alt="A person hugging AI — your supportive companion"
              fill
              className="object-contain hero-image-mask relative z-10 drop-shadow-xl"
              priority
            />
          </div>
        </div>

        {/* Hero Copy */}
        <div className="relative z-10 text-center max-w-2xl mx-auto mb-10">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 leading-tight tracking-tight">
            <span className="bg-gradient-to-r from-[#5C3D28] via-[#8D5B3A] to-[#6F4E37] bg-clip-text text-transparent">
              Work is stressful.
            </span>
            <br />
            <span className="text-[#2D1E14]">Life is messy.</span>
            <br />
            <span className="bg-gradient-to-r from-[#8D5B3A] via-[#B57951] to-[#6F4E37] bg-clip-text text-transparent">
              Let&apos;s talk.
            </span>
          </h1>
          <p className="text-[#6B5547] text-base sm:text-lg max-w-xl mx-auto leading-relaxed font-medium">
            Your empathetic companion who listens to your rants, helps you navigate challenging days,
            and gently reminds you that this too shall pass. You can even roast your virtual boss. ☕
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-4 mb-12">
          <button
            onClick={() => setChatOpen(true)}
            className="group relative px-8 py-4 bg-gradient-to-r from-[#6F4E37] via-[#855333] to-[#A06742] text-white font-bold rounded-2xl text-lg transition-all hover:scale-105 glow-pulse flex items-center gap-3 cursor-pointer shadow-lg shadow-[#6F4E37]/25"
          >
            <MessageCircle className="w-5 h-5" />
            Talk to TIDE
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => setChatOpen(true)}
            className="px-6 py-4 bg-white/90 backdrop-blur-md border border-[#E8DFD5] text-[#4A3222] font-semibold rounded-2xl text-lg transition-all hover:bg-[#F5EFEB] hover:border-[#D9CABE] hover:scale-105 flex items-center gap-3 shadow-xs cursor-pointer"
          >
            <Mic className="w-5 h-5 text-[#8D5B3A]" />
            Use Voice
          </button>
        </div>

        {/* Trust badges */}
        <div className="relative z-10 flex flex-wrap items-center justify-center gap-3 text-[#6B5547] text-xs mb-8">
          <span className="flex items-center gap-1.5 bg-white/90 backdrop-blur-sm border border-[#E8DFD5] px-3.5 py-1.5 rounded-full shadow-2xs font-semibold">
            <Shield className="w-3.5 h-3.5 text-[#8D5B3A]" /> Private & Secure (LocalStorage)
          </span>
          <span className="flex items-center gap-1.5 bg-white/90 backdrop-blur-sm border border-[#E8DFD5] px-3.5 py-1.5 rounded-full shadow-2xs font-semibold">
            <Heart className="w-3.5 h-3.5 text-[#8D5B3A]" /> Supportive Care — Not Clinical Therapy
          </span>
          <span className="flex items-center gap-1.5 bg-white/90 backdrop-blur-sm border border-[#E8DFD5] px-3.5 py-1.5 rounded-full shadow-2xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-[#B57951]" /> Empathetic AI Companion
          </span>
        </div>

        {/* Scroll indicator */}
        <button
          onClick={scrollToFeatures}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[#9E8675] hover:text-[#5C3D28] transition-colors animate-bounce cursor-pointer p-2"
          aria-label="Scroll to features"
        >
          <ChevronDown className="w-6 h-6" />
        </button>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* FEATURES OVERVIEW */}
      {/* ═══════════════════════════════════════════ */}
      <section id="features" className="px-4 py-16 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#2D1E14] mb-3 tracking-tight">
            Everything you need to
            <span className="bg-gradient-to-r from-[#6F4E37] via-[#8D5B3A] to-[#B57951] bg-clip-text text-transparent"> feel better</span>
          </h2>
          <p className="text-[#6B5547] text-lg max-w-xl mx-auto">
            More than just a chat. A complete toolkit designed for real workplace emotional recovery.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className={`feature-card bg-white rounded-2xl p-6 border ${feature.borderColor} shadow-xs relative overflow-hidden group cursor-default`}
              >
                <div className={`w-12 h-12 rounded-xl ${feature.iconBg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-[#2D1E14] font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-[#6B5547] text-sm leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>

        {/* Quick CTA */}
        <div className="text-center">
          <button
            onClick={() => setChatOpen(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-[#E8DFD5] rounded-xl text-[#4A3222] hover:text-[#6F4E37] hover:border-[#8D5B3A]/40 transition-all text-sm font-semibold shadow-xs cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 text-[#8D5B3A]" />
            Start a conversation to unlock all features
          </button>
        </div>
      </section>

      {/* Divider */}
      <div className="section-glow max-w-4xl mx-auto" />

      {/* ═══════════════════════════════════════════ */}
      {/* INTERACTIVE FEATURES & DASHBOARD */}
      {/* ═══════════════════════════════════════════ */}
      <section className="px-4 py-16 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#2D1E14] mb-3 tracking-tight">
            Personalized Wellness
            <span className="bg-gradient-to-r from-[#6F4E37] via-[#8D5B3A] to-[#B57951] bg-clip-text text-transparent"> Dashboard</span>
          </h2>
          <p className="text-[#6B5547] text-lg max-w-xl mx-auto">
            Your self-reported insights, stress patterns, and recovery progress — kept completely private on your device.
          </p>
        </div>

        {/* Features stacked sequentially one by one */}
        <div className="space-y-12 max-w-3xl sm:max-w-4xl mx-auto">
          <StressMap />
          <ManagerTwin />
          <EmergencyRelief />
          <RealityCheck />
          <RecoveryLab />
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* FOOTER */}
      {/* ═══════════════════════════════════════════ */}
      <footer className="px-4 py-12 border-t border-[#E8DFD5] bg-white/60 backdrop-blur-xs">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6F4E37] to-[#A06742] flex items-center justify-center shadow-xs text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-[#2D1E14] font-bold">TIDE — This Too Shall Pass</span>
          </div>
          <p className="text-[#7D6656] text-sm max-w-lg mx-auto mb-4 leading-relaxed">
            TIDE is an emotional support companion, not a licensed therapist or medical professional.
            If you&apos;re in crisis, please reach out to the
            <a href="https://988lifeline.org" target="_blank" rel="noopener noreferrer" className="text-[#8D5B3A] hover:text-[#5C3D28] underline mx-1 font-semibold">988 Suicide & Crisis Lifeline</a>
            or your local emergency services.
          </p>
          <p className="text-[#9E8675] text-xs">
            All conversations and check-ins are stored locally in your browser. No personal data is sent to external servers.
          </p>
          <p className="text-[#9E8675] text-xs mt-2">
            Built with ☕ and empathy for every worker navigating a challenging day.
          </p>
        </div>
      </footer>

      {/* ═══════════════════════════════════════════ */}
      {/* FLOATING ACTION BUTTON */}
      {/* ═══════════════════════════════════════════ */}
      {!chatOpen && (
        <button
          onClick={() => setChatOpen(true)}
          className="fixed bottom-6 right-6 z-40 w-16 h-16 bg-gradient-to-br from-[#6F4E37] via-[#855333] to-[#A06742] rounded-full shadow-xl shadow-[#6F4E37]/35 flex items-center justify-center hover:scale-110 transition-all group cursor-pointer"
          aria-label="Open chat with TIDE"
        >
          <MessageCircle className="w-7 h-7 text-white group-hover:scale-110 transition-transform" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white animate-pulse" />
        </button>
      )}

      {/* Chat Interface Modal */}
      <ChatInterface
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        initialMode="chat"
      />
    </main>
  );
}
