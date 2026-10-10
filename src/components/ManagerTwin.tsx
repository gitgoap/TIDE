'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Crown, Flame, Theater, ArrowLeft, UserCog } from 'lucide-react';
import ChatInterface from './ChatInterface';

export default function ManagerTwin() {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'select' | 'setup' | 'practice' | 'roast'>('select');
  const [managerDescription, setManagerDescription] = useState('');
  const [selectedMode, setSelectedMode] = useState<'practice' | 'roast'>('practice');

  const handleStart = () => {
    if (!managerDescription.trim()) {
      setManagerDescription('A micromanaging boss who schedules meetings about meetings and sends emails at 3 AM');
    }
    setMode(selectedMode);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setMode('select');
  };

  return (
    <>
      <div className="bg-white rounded-2xl p-6 border border-[#E8DFD5] shadow-xs overflow-hidden relative">
        {/* Soft background warm gradient blob */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl from-[#8D5B3A]/10 to-transparent rounded-bl-full pointer-events-none" />

        <div className="flex items-center gap-3 mb-4 relative">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6F4E37] to-[#A06742] flex items-center justify-center text-white shadow-xs">
            <Crown className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-[#2D1E14] font-bold text-lg">Manager Twin (Fun Mode)</h3>
            <p className="text-[#7D6656] text-xs">Rehearse difficult conversations or roast your virtual manager</p>
          </div>
        </div>

        {mode === 'select' && (
          <div className="space-y-4 relative">
            {/* Visual Graphic Preview */}
            <div className="relative w-full max-w-xs sm:max-w-sm mx-auto bg-[#FAF6F0] rounded-2xl p-2 border border-[#E8DFD5] shadow-2xs overflow-hidden">
              <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-white">
                <Image
                  src="/manager-twin.png"
                  alt="Manager Twin Fun Mode illustration showing Practice and Roast conversation preview"
                  fill
                  className="object-contain p-2"
                  priority
                />
              </div>
            </div>

            <p className="text-[#6B5547] text-sm leading-relaxed font-medium text-center">
              Choose your mode below to practice tough workplace discussions or release steam in Roast Mode.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <button
                onClick={() => { setSelectedMode('practice'); setMode('setup'); }}
                className="group relative bg-[#F5EFEB] border border-[#E0D3C5] rounded-xl p-4 text-left hover:border-[#8D5B3A]/40 hover:bg-[#EFE6DD] transition-all hover:scale-[1.02] cursor-pointer shadow-2xs"
              >
                <div className="w-8 h-8 rounded-lg bg-[#EAE0D5] text-[#5C3D28] flex items-center justify-center mb-2.5 font-bold">
                  <Theater className="w-5 h-5" />
                </div>
                <h4 className="text-[#2D1E14] font-bold text-sm">Practice Mode</h4>
                <p className="text-[#6B5547] text-xs mt-1 leading-relaxed">
                  Rehearse difficult conversations with a realistic AI manager
                </p>
              </button>

              <button
                onClick={() => { setSelectedMode('roast'); setMode('setup'); }}
                className="group relative bg-[#FAF2EB] border border-[#E8D4C4] rounded-xl p-4 text-left hover:border-[#9C4B33]/40 hover:bg-[#F5E8DD] transition-all hover:scale-[1.02] cursor-pointer shadow-2xs"
              >
                <div className="w-8 h-8 rounded-lg bg-[#F2DDD0] text-[#9C4B33] flex items-center justify-center mb-2.5 font-bold">
                  <Flame className="w-5 h-5" />
                </div>
                <h4 className="text-[#2D1E14] font-bold text-sm">Roast Mode</h4>
                <p className="text-[#6B5547] text-xs mt-1 leading-relaxed">
                  Go ahead, tell your &quot;manager&quot; how you really feel 🔥
                </p>
              </button>
            </div>
          </div>
        )}

        {mode === 'setup' && (
          <div className="space-y-4 relative">
            <button
              onClick={() => setMode('select')}
              className="flex items-center gap-1.5 text-[#7D6656] hover:text-[#2D1E14] text-sm font-semibold transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            <div>
              <label className="text-[#2D1E14] text-sm font-bold mb-2 flex items-center gap-2">
                <UserCog className="w-4 h-4 text-[#8D5B3A]" />
                Describe your manager
              </label>
              <textarea
                value={managerDescription}
                onChange={(e) => setManagerDescription(e.target.value)}
                placeholder="e.g., Passive-aggressive, loves saying 'per my last email', takes credit for everything, schedules meetings during lunch"
                className="w-full bg-[#FAF6F0] border border-[#E8DFD5] rounded-xl px-4 py-3 text-stone-800 placeholder-stone-400 resize-none focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#8D5B3A]/30 text-sm h-24 shadow-2xs leading-relaxed"
              />
            </div>

            <button
              onClick={handleStart}
              className={`w-full py-3.5 rounded-xl font-bold text-white transition-all hover:scale-[1.01] cursor-pointer shadow-sm ${
                selectedMode === 'roast'
                  ? 'bg-gradient-to-r from-[#803D29] via-[#9C4B33] to-[#B35E44] hover:shadow-md hover:shadow-[#803D29]/25'
                  : 'bg-gradient-to-r from-[#5C3D28] via-[#784E34] to-[#8D5B3A] hover:shadow-md hover:shadow-[#5C3D28]/25'
              }`}
            >
              {selectedMode === 'roast' ? '🔥 Start Roasting!' : '🎭 Start Practice'}
            </button>

            <p className="text-[#9E8675] text-xs text-center">
              Fictional, lighthearted workplace simulation. No real managers harmed! 😄
            </p>
          </div>
        )}
      </div>

      <ChatInterface
        isOpen={isOpen}
        onClose={handleClose}
        initialMode={selectedMode === 'roast' ? 'manager-roast' : 'manager-practice'}
        managerProfile={managerDescription}
      />
    </>
  );
}
