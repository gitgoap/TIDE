'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Activity, Smile, TrendingUp, Lightbulb, BookOpen, Trash2, Sparkles } from 'lucide-react';
import { XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import {
  getMoodData, saveMoodEntry, getReflections, getCopingStrategies,
  getStressMap, clearAllData, resetToDemoData, MoodEntry
} from '@/lib/storage';

export default function RecoveryLab() {
  const [moodData, setMoodData] = useState<MoodEntry[]>([]);
  const [todayMood, setTodayMood] = useState<number>(0);
  const [reflections, setReflections] = useState<string[]>([]);
  const [copingStrategies, setCopingStrategies] = useState<string[]>([]);
  const [topStressors, setTopStressors] = useState<string[]>([]);
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  useEffect(() => {
    const mood = getMoodData();
    setMoodData(mood);

    const today = new Date().toISOString().split('T')[0];
    const todayEntry = mood.find(m => m.date === today);
    if (todayEntry) setTodayMood(todayEntry.score);

    setReflections(getReflections());
    setCopingStrategies(getCopingStrategies());

    const stressMap = getStressMap();
    if (stressMap.categories.length > 0) {
      setTopStressors(
        stressMap.categories
          .sort((a, b) => b.level - a.level)
          .slice(0, 3)
          .map(c => c.name)
      );
    }
  }, []);

  const handleMoodCheck = (score: number) => {
    const today = new Date().toISOString().split('T')[0];
    saveMoodEntry({ date: today, score });
    setTodayMood(score);
    setMoodData(getMoodData());
  };

  const handleClearAll = () => {
    clearAllData();
    setMoodData([]);
    setTodayMood(0);
    setReflections([]);
    setCopingStrategies([]);
    setTopStressors([]);
    setShowConfirmClear(false);
  };

  const handleRestoreDemo = () => {
    resetToDemoData();
    const data = getMoodData();
    setMoodData(data);
    const today = new Date().toISOString().split('T')[0];
    const todayEntry = data.find(m => m.date === today);
    if (todayEntry) setTodayMood(todayEntry.score);
    setReflections(getReflections());
    setCopingStrategies(getCopingStrategies());
    const stressMap = getStressMap();
    if (stressMap.categories.length > 0) {
      setTopStressors(
        stressMap.categories
          .sort((a, b) => b.level - a.level)
          .slice(0, 3)
          .map(c => c.name)
      );
    }
    setShowConfirmClear(false);
  };

  const chartData = moodData.map(m => ({
    date: new Date(m.date).toLocaleDateString('en', { month: 'short', day: 'numeric' }),
    mood: m.score,
  }));

  const moodEmoji = (score: number) => {
    if (score <= 2) return '😢';
    if (score <= 4) return '😕';
    if (score <= 6) return '😐';
    if (score <= 8) return '🙂';
    return '😄';
  };

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E8DFD5] shadow-xs relative overflow-hidden">
      {/* Soft background warm gradient blob */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-[#8D5B3A]/10 to-transparent rounded-bl-full pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-6 relative">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6F4E37] to-[#A06742] flex items-center justify-center text-white shadow-xs">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-[#2D1E14] font-bold text-lg">Personal Recovery Lab</h3>
            <p className="text-[#7D6656] text-xs">Self-reported wellness trends & AI reflections</p>
          </div>
        </div>

        <button
          onClick={() => setShowConfirmClear(!showConfirmClear)}
          className="text-stone-400 hover:text-[#6F4E37] transition-colors p-2 rounded-lg hover:bg-[#FAF6F0] cursor-pointer"
          title="Manage data & demo states"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {showConfirmClear && (
        <div className="mb-5 bg-[#FAF6F0] border border-[#E8DFD5] rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
          <p className="text-[#5C3D28] text-xs font-medium">Manage dashboard data:</p>
          <div className="flex gap-2">
            <button
              onClick={handleRestoreDemo}
              className="px-3 py-1.5 bg-[#6F4E37] text-white text-xs font-semibold rounded-lg hover:bg-[#5C3D28] cursor-pointer shadow-2xs"
            >
              Reset to Sample Demo Data
            </button>
            <button
              onClick={handleClearAll}
              className="px-3 py-1.5 bg-red-600 text-white text-xs font-semibold rounded-lg hover:bg-red-700 cursor-pointer shadow-2xs"
            >
              Clear All Data
            </button>
            <button
              onClick={() => setShowConfirmClear(false)}
              className="px-3 py-1.5 text-stone-600 text-xs font-medium hover:text-stone-900 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Grid: Visual Trend Mockup + Interactive Check-in & Live Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6 items-start">
        {/* Visual Graphic Preview */}
        <div className="lg:col-span-5 bg-[#FAF6F0] rounded-2xl p-2.5 border border-[#E8DFD5] shadow-2xs overflow-hidden group">
          <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-white">
            <Image
              src="/mood-trend.png"
              alt="Your Mood Trend visualization showing 14-day progression and sleep/workload correlation"
              fill
              className="object-contain p-2 transition-transform duration-300 group-hover:scale-[1.02]"
              priority
            />
          </div>
          <div className="mt-2.5 p-3 bg-white/90 rounded-xl border border-[#E8DFD5]/80">
            <p className="text-[#6F4E37] text-xs font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#8D5B3A]" />
              Pattern Recognition
            </p>
            <p className="text-[#7D6656] text-[11px] mt-0.5 leading-relaxed">
              TIDE connects daily check-in ratings with conversational debriefs to highlight what recharges or depletes you over time.
            </p>
          </div>
        </div>

        {/* Right side: Daily Mood Check-In & Live Graph */}
        <div className="lg:col-span-7 space-y-4">
          {/* Mood check-in */}
          <div className="bg-[#F5EDE5]/70 rounded-xl p-5 border border-[#E6DACF]">
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center gap-2">
                <Smile className="w-4.5 h-4.5 text-[#8D5B3A]" />
                <span className="text-[#2D1E14] text-sm font-bold">How are you feeling today? (Daily check-in)</span>
              </div>
              {todayMood > 0 && (
                <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-full border border-[#E8DFD5] shadow-2xs">
                  <span className="text-lg">{moodEmoji(todayMood)}</span>
                  <span className="text-xs font-bold text-[#5C3D28]">{todayMood}/10</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
                <button
                  key={score}
                  onClick={() => handleMoodCheck(score)}
                  className={`flex-1 h-9 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    todayMood === score
                      ? 'bg-gradient-to-r from-[#6F4E37] to-[#8D5B3A] text-white scale-105 shadow-md shadow-[#6F4E37]/25'
                      : score <= todayMood && todayMood > 0
                      ? 'bg-[#EAE0D5] text-[#5C3D28] font-bold hover:bg-[#E3D6C9]'
                      : 'bg-white text-[#6B5547] hover:bg-[#FAF6F0] hover:text-[#2D1E14] border border-[#E8DFD5]'
                  }`}
                >
                  {score}
                </button>
              ))}
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-[#9E8675] text-[11px] font-semibold">1 = Overwhelmed / Burned out</span>
              <span className="text-[#9E8675] text-[11px] font-semibold">10 = Centered & Energized</span>
            </div>
          </div>

          {/* Live Recharts Mood progression */}
          {chartData.length >= 2 ? (
            <div className="bg-[#FAF6F0] rounded-xl p-4 border border-[#E8DFD5]">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-[#8D5B3A]" />
                <span className="text-[#6B5547] text-xs font-bold uppercase tracking-wider">Live Progression Chart</span>
              </div>
              <div className="h-36">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8D5B3A" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#8D5B3A" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="date"
                      tick={{ fill: '#8D7B6F', fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      domain={[1, 10]}
                      tick={{ fill: '#8D7B6F', fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                      width={25}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #E8DFD5',
                        borderRadius: '12px',
                        color: '#2D1E14',
                        fontSize: '12px',
                        boxShadow: '0 8px 16px rgba(92,61,40,0.08)'
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="mood"
                      stroke="#6F4E37"
                      strokeWidth={2.5}
                      fill="url(#moodGradient)"
                      dot={{ fill: '#6F4E37', strokeWidth: 0, r: 4 }}
                      activeDot={{ r: 6, fill: '#8D5B3A' }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          ) : (
            <div className="bg-[#FAF6F0] rounded-xl p-4 border border-[#E8DFD5] text-center">
              <p className="text-[#6B5547] text-xs leading-relaxed">
                Tap your rating today and again tomorrow to generate your live interactive progression curve.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Top stressors */}
      {topStressors.length > 0 && (
        <div className="bg-stone-50/60 rounded-xl p-4 border border-stone-200/80 mb-4">
          <h4 className="text-stone-600 text-xs font-bold uppercase tracking-wider mb-2.5">Key Identified Stressors</h4>
          <div className="flex flex-wrap gap-2">
            {topStressors.map((s, i) => (
              <span key={i} className="px-3 py-1 bg-rose-50 text-rose-700 text-xs font-bold rounded-full border border-rose-200 shadow-2xs">
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Coping strategies */}
      {copingStrategies.length > 0 && (
        <div className="bg-stone-50/60 rounded-xl p-4 border border-stone-200/80 mb-4">
          <div className="flex items-center gap-2 mb-2.5">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <h4 className="text-stone-700 text-xs font-bold uppercase tracking-wider">Helpful Coping Strategies</h4>
          </div>
          <ul className="space-y-1.5">
            {copingStrategies.slice(-5).map((s, i) => (
              <li key={i} className="text-stone-700 text-sm flex items-start gap-2 leading-relaxed">
                <span className="text-amber-500 font-bold">✦</span>
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* AI Reflections */}
      {reflections.length > 0 && (
        <div className="bg-gradient-to-r from-purple-50/60 to-pink-50/60 rounded-xl p-4.5 border border-purple-100 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-4 h-4 text-purple-600" />
            <h4 className="text-purple-900 text-xs font-bold uppercase tracking-wider">AI Emotional Reflection</h4>
          </div>
          <p className="text-stone-700 text-sm italic leading-relaxed">
            &ldquo;{reflections[reflections.length - 1]}&rdquo;
          </p>
        </div>
      )}

      {moodData.length === 0 && reflections.length === 0 && (
        <div className="text-center py-3">
          <p className="text-stone-400 text-sm">
            Chat with TIDE and check in with your mood above to watch your recovery dashboard populate. ✨
          </p>
        </div>
      )}

      <p className="text-stone-400 text-[11px] text-center mt-4">
        This is not a diagnostic tool. All numbers reflect self-reported check-ins stored locally in your browser.
      </p>
    </div>
  );
}
