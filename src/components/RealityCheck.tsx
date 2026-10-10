'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { HelpCircle, ChevronRight, AlertCircle, CheckCircle2, Sparkles, MessageCircle, ArrowRight } from 'lucide-react';
import { getRealityChecks, RealityCheck as RealityCheckType } from '@/lib/storage';
import ChatInterface from './ChatInterface';

export default function RealityCheck() {
  const [checks, setChecks] = useState<RealityCheckType[]>([]);
  const [activeCheck, setActiveCheck] = useState<number>(0);
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    const saved = getRealityChecks();
    if (saved.length > 0) {
      setChecks(saved);
      setActiveCheck(saved.length - 1);
    }
  }, []);

  const check = checks.length > 0 ? checks[activeCheck] : null;

  return (
    <>
      <div className="bg-white rounded-2xl p-6 border border-[#E8DFD5] shadow-xs overflow-hidden relative">
        {/* Soft background warm gradient blob */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl from-[#8D5B3A]/10 to-transparent rounded-bl-full pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between mb-4 relative">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6F4E37] to-[#8D5B3A] flex items-center justify-center text-white shadow-xs">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-[#2D1E14] font-bold text-lg">Am I Overthinking?</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#FAF6F0] text-[#8D5B3A] border border-[#E8DFD5]">
                  Reality Check
                </span>
              </div>
              <p className="text-[#7D6656] text-xs">Separate facts from assumptions and see a clearer picture</p>
            </div>
          </div>

          {checks.length > 1 && (
            <div className="flex items-center gap-1.5">
              {checks.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveCheck(i)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    i === activeCheck ? 'bg-[#8D5B3A] w-5' : 'bg-stone-200 w-2 hover:bg-stone-300'
                  }`}
                  aria-label={`View reality check ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Visual Graphic Preview */}
        <div className="relative w-full max-w-xs sm:max-w-sm mx-auto mb-4 bg-[#FAF6F0] rounded-2xl p-2 border border-[#E8DFD5] shadow-2xs overflow-hidden group">
          <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-white">
            <Image
              src="/reality-check.png"
              alt="Reality Check — Am I Overthinking? Separating facts from assumptions"
              fill
              className="object-contain p-2 transition-transform duration-300 group-hover:scale-[1.02]"
              priority
            />
          </div>
          <button
            onClick={() => setChatOpen(true)}
            className="w-full mt-2 py-2.5 px-3 bg-[#2D1E14] hover:bg-[#422C1D] text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-all shadow-2xs cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 fill-current" />
            Break an Overthinking Spiral with AI
          </button>
        </div>

        {/* Extracted or Saved Reality Check Insights */}
        {check ? (
          <div className="space-y-3 pt-2 border-t border-[#E8DFD5]/60">
            <div className="flex items-center justify-between">
              <span className="text-[#2D1E14] text-xs font-bold uppercase tracking-wider">
                Your Latest Deconstruction
              </span>
              <span className="text-[#8D5B3A] text-[11px] font-medium">
                {new Date(check.timestamp).toLocaleDateString()}
              </span>
            </div>

            {/* What happened */}
            <div className="bg-[#FAF6F0] rounded-xl p-3.5 border border-[#E8DFD5]">
              <h4 className="text-[#2D1E14] text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <ChevronRight className="w-3.5 h-3.5 text-[#8D5B3A]" />
                What Happened (Fact)
              </h4>
              <p className="text-[#4A382A] text-xs leading-relaxed">{check.whatHappened}</p>
            </div>

            {/* Assumptions */}
            {check.assumptions.length > 0 && (
              <div className="bg-amber-50/70 rounded-xl p-3.5 border border-amber-200/80">
                <h4 className="text-amber-900 text-xs font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
                  Possible Interpretation / Assumptions
                </h4>
                <ul className="space-y-1">
                  {check.assumptions.map((a, i) => (
                    <li key={i} className="text-stone-700 text-xs flex items-start gap-1.5 leading-relaxed">
                      <span className="text-amber-600 font-bold">•</span>
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Alternatives */}
            {check.alternatives.length > 0 && (
              <div className="bg-emerald-50/70 rounded-xl p-3.5 border border-emerald-200/80">
                <h4 className="text-emerald-900 text-xs font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                  Alternative View
                </h4>
                <ul className="space-y-1">
                  {check.alternatives.map((a, i) => (
                    <li key={i} className="text-stone-700 text-xs flex items-start gap-1.5 leading-relaxed">
                      <span className="text-emerald-600 font-bold">•</span>
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Next step */}
            {check.nextStep && (
              <div className="bg-[#FAF6F0] rounded-xl p-3.5 border border-[#E8DFD5]">
                <h4 className="text-[#6F4E37] text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                  <ArrowRight className="w-3.5 h-3.5 text-[#8D5B3A]" />
                  Actionable Next Step
                </h4>
                <p className="text-[#2D1E14] text-xs font-semibold leading-relaxed">{check.nextStep}</p>
              </div>
            )}
          </div>
        ) : (
          <p className="text-[#7D6656] text-xs text-center mt-2 leading-relaxed">
            Talk through any office stress or awkward situation — TIDE automatically separates hard facts from runaway assumptions.
          </p>
        )}
      </div>

      <ChatInterface
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        initialMode="emergency"
        emergencyType="overthinking"
      />
    </>
  );
}
