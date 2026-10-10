'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Network, AlertCircle, Sparkles, ChevronRight } from 'lucide-react';
import { getStressMap, StressMap as StressMapType } from '@/lib/storage';

const CATEGORY_COLORS: Record<string, { bg: string; border: string; text: string; bar: string }> = {
  'Work': { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', bar: 'bg-blue-500' },
  'Relationships': { bg: 'bg-pink-50', border: 'border-pink-200', text: 'text-pink-700', bar: 'bg-pink-500' },
  'Family': { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', bar: 'bg-amber-500' },
  'Personal Life': { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', bar: 'bg-emerald-500' },
  'Personal': { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', bar: 'bg-emerald-500' },
  'Well-being': { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', bar: 'bg-purple-500' },
  'Emotional': { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', bar: 'bg-purple-500' },
};

const CATEGORY_EMOJIS: Record<string, string> = {
  'Work': '💼',
  'Relationships': '💕',
  'Family': '👨‍👩‍👧‍👦',
  'Personal Life': '🍃',
  'Personal': '🍃',
  'Well-being': '🌙',
  'Emotional': '🌙',
};

export default function StressMap() {
  const [stressMap, setStressMap] = useState<StressMapType | null>(null);

  useEffect(() => {
    const map = getStressMap();
    if (map.categories.length > 0) {
      setStressMap(map);
    }
  }, []);

  return (
    <div className="bg-white rounded-2xl p-6 border border-[#E8DFD5] shadow-xs overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6F4E37] to-[#A06742] flex items-center justify-center text-white shadow-xs">
          <Network className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-[#2D1E14] font-bold text-lg">Life–Work Stress Map</h3>
          <p className="text-[#7D6656] text-xs">See how different parts of your life are connected</p>
        </div>
      </div>

      {/* Primary Visual Map Graphic */}
      <div className="relative w-full max-w-xs sm:max-w-sm mx-auto mb-5 bg-[#FAF6F0] rounded-2xl p-2 border border-[#E8DFD5] shadow-2xs overflow-hidden">
        <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-white">
          <Image
            src="/stress-map.png"
            alt="Life-Work Stress Map showing connected spheres of Work, Relationships, Family, Personal Life, and Well-being"
            fill
            className="object-contain p-2"
            priority
          />
        </div>
      </div>

      {/* Dynamic Extracted Categories from conversations (if any exist) */}
      {stressMap && stressMap.categories.length > 0 && (
        <div className="mb-4 space-y-3">
          <h4 className="text-[#7D6656] text-xs font-bold uppercase tracking-wider">
            Your Extracted Stressor Levels
          </h4>
          <div className="grid grid-cols-2 gap-2.5">
            {stressMap.categories.map((cat) => {
              const color = CATEGORY_COLORS[cat.name] || {
                bg: 'bg-stone-50', border: 'border-stone-200', text: 'text-stone-700', bar: 'bg-stone-500'
              };
              return (
                <div
                  key={cat.name}
                  className={`rounded-xl p-3 border shadow-2xs ${color.bg} ${color.border}`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-[#2D1E14] flex items-center gap-1">
                      <span>{CATEGORY_EMOJIS[cat.name] || '📌'}</span>
                      {cat.name}
                    </span>
                    <span className="text-[10px] font-bold text-[#7D6656]">{cat.level}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/80 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${color.bar}`}
                      style={{ width: `${cat.level}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Connections */}
          {stressMap.connections.length > 0 && (
            <div className="space-y-1.5 pt-1">
              {stressMap.connections.map((conn, i) => (
                <div key={i} className="flex items-center gap-2 bg-[#FAF6F0] border border-[#E8DFD5] rounded-xl px-3 py-2 text-xs">
                  <span className="font-bold text-[#5C3D28]">{conn.from}</span>
                  <span className="text-[#9E8675]">↔</span>
                  <span className="font-bold text-[#5C3D28]">{conn.to}</span>
                  <span className="text-[#6B5547] ml-auto italic text-[11px]">{conn.note}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Insight Highlight Card */}
      <div className="bg-[#FAF6F0] border border-[#E8DFD5] rounded-xl p-3.5 flex items-start gap-3 shadow-2xs">
        <div className="w-7 h-7 rounded-lg bg-[#EFE6DD] text-[#6F4E37] flex items-center justify-center shrink-0 mt-0.5">
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="flex-1">
          <p className="text-[#3D2817] text-xs font-semibold leading-relaxed">
            Work stress seems connected with lower sleep and higher irritability.
          </p>
          <p className="text-[#8D7B6F] text-[10px] mt-0.5">
            Patterns observed across conversations. Non-clinical observation.
          </p>
        </div>
      </div>
    </div>
  );
}
