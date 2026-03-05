'use client';

import { PortfolioBuilderState } from '@/types/portfolio-builder';
import { Card } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CheckCircle2 } from 'lucide-react';

interface ThemeStepProps {
  state: PortfolioBuilderState;
  updateState: (updates: Partial<PortfolioBuilderState>) => void;
}

const themes = [
  {
    id: 'minimal',
    name: 'Minimal Clean',
    description: 'Clean white background, elegant typography, and plenty of breathing room.',
    preview: (
      <div className="w-full h-32 bg-slate-50 border-b border-gray-100 p-3 flex flex-col gap-2">
        <div className="w-16 h-2 bg-slate-300 rounded" />
        <div className="w-24 h-4 bg-slate-800 rounded mt-2" />
        <div className="w-full h-2 bg-slate-200 rounded" />
        <div className="flex gap-2 mt-auto">
          <div className="w-10 h-10 bg-white shadow-sm border border-slate-100 rounded" />
          <div className="w-10 h-10 bg-white shadow-sm border border-slate-100 rounded" />
        </div>
      </div>
    ),
  },
  {
    id: 'midnight',
    name: 'Midnight Dark',
    description: 'Deep dark backgrounds, subtle neon accents, and sleek glassmorphism.',
    preview: (
      <div className="w-full h-32 bg-slate-950 border-b border-slate-800 p-3 flex flex-col gap-2">
        <div className="w-16 h-2 bg-slate-700 rounded" />
        <div className="w-24 h-4 bg-indigo-400 rounded mt-2" />
        <div className="w-full h-2 bg-slate-800 rounded" />
        <div className="flex gap-2 mt-auto">
          <div className="w-10 h-10 bg-slate-900 shadow-sm border border-slate-800 rounded" />
          <div className="w-10 h-10 bg-slate-900 shadow-sm border border-slate-800 rounded" />
        </div>
      </div>
    ),
  },
  {
    id: 'vibrant',
    name: 'Vibrant Pop',
    description: 'Bold colorful gradients, playful typography, and an energetic layout.',
    preview: (
      <div className="w-full h-32 bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 border-b border-purple-400 p-3 flex flex-col gap-2">
        <div className="w-16 h-2 bg-white/50 rounded" />
        <div className="w-24 h-4 bg-white font-bold rounded mt-2" />
        <div className="w-full h-2 bg-white/30 rounded" />
        <div className="flex gap-2 mt-auto">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-md shadow-sm border border-white/30 rounded" />
          <div className="w-10 h-10 bg-white/20 backdrop-blur-md shadow-sm border border-white/30 rounded" />
        </div>
      </div>
    ),
  },
];

export function ThemeStep({ state, updateState }: ThemeStepProps) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">Choose a Theme</h2>
        <p className="text-gray-500">Pick a visual style for your portfolio. You can always change this later.</p>
      </div>

      <RadioGroup
        value={state.theme}
        onValueChange={(val) => updateState({ theme: val as any })}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {themes.map((theme) => {
          const isSelected = state.theme === theme.id;
          return (
            <div key={theme.id} className="relative">
              <RadioGroupItem
                value={theme.id}
                id={theme.id}
                className="peer sr-only"
              />
              <Label
                htmlFor={theme.id}
                className={`flex flex-col rounded-xl border-2 cursor-pointer transition-all overflow-hidden bg-white ${
                  isSelected
                    ? 'border-indigo-600 shadow-md ring-2 ring-indigo-600/20'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                {/* Theme Preview Box */}
                {theme.preview}
                
                {/* Theme Info */}
                <div className="p-4 flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900">{theme.name}</h3>
                    {isSelected && (
                      <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0" />
                    )}
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {theme.description}
                  </p>
                </div>
              </Label>
            </div>
          );
        })}
      </RadioGroup>
    </div>
  );
}
