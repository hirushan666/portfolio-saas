'use client';

import { PortfolioBuilderState } from '@/types/portfolio-builder';
import { User } from 'next-auth';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Upload, Github } from 'lucide-react';

interface BasicInfoStepProps {
  state: PortfolioBuilderState;
  updateState: (updates: Partial<PortfolioBuilderState>) => void;
  user: User;
}

export function BasicInfoStep({ state, updateState, user }: BasicInfoStepProps) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">Basic Information</h2>
        <p className="text-gray-500">Tell us a bit about yourself. This will be the first thing people see.</p>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Display Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-700 font-medium">Display Name</Label>
            <Input
              id="name"
              placeholder="e.g. John Doe"
              value={state.name}
              onChange={(e) => updateState({ name: e.target.value })}
              className="bg-gray-50 border-gray-200 focus:bg-white transition-colors"
            />
          </div>

          {/* Headline / Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-gray-700 font-medium">Headline / Job Title</Label>
            <Input
              id="title"
              placeholder="e.g. Full Stack Developer"
              value={state.title}
              onChange={(e) => updateState({ title: e.target.value })}
              className="bg-gray-50 border-gray-200 focus:bg-white transition-colors"
            />
          </div>
        </div>

        {/* Bio */}
        <div className="space-y-2">
          <Label htmlFor="bio" className="text-gray-700 font-medium">Short Bio</Label>
          <Textarea
            id="bio"
            placeholder="Write a few sentences about what you do, your passions, and your experience..."
            value={state.bio}
            onChange={(e) => updateState({ bio: e.target.value })}
            className="min-h-[120px] bg-gray-50 border-gray-200 focus:bg-white transition-colors resize-y"
          />
        </div>

        {/* Avatar Selection */}
        <div className="space-y-4 pt-4 border-t border-gray-100">
          <Label className="text-gray-700 font-medium text-lg">Profile Photo Source</Label>
          
          <RadioGroup
            value={state.avatarSource}
            onValueChange={(val) => updateState({ avatarSource: val as 'github' | 'upload' })}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {/* GitHub Avatar Option */}
            <div>
              <RadioGroupItem
                value="github"
                id="github"
                className="peer sr-only"
              />
              <Label
                htmlFor="github"
                className={`flex flex-col items-center justify-center rounded-xl border-2 p-6 cursor-pointer hover:bg-indigo-50/50 transition-all ${
                  state.avatarSource === 'github'
                    ? 'border-indigo-600 bg-indigo-50/30 shadow-sm'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <Avatar className="h-16 w-16 border-2 border-indigo-100 mb-4 shadow-sm">
                  <AvatarImage src={`https://avatars.githubusercontent.com/${user.githubUsername}`} />
                  <AvatarFallback className="bg-indigo-100 text-indigo-700"><Github className="w-8 h-8" /></AvatarFallback>
                </Avatar>
                <div className="font-semibold text-gray-900 flex items-center gap-2">
                  <Github className="w-4 h-4 text-indigo-600" />
                  Use GitHub Avatar
                </div>
                <div className="text-xs text-gray-500 mt-1">Automatic sync</div>
              </Label>
            </div>

            {/* Upload Option */}
            <div>
              <RadioGroupItem
                value="upload"
                id="upload"
                className="peer sr-only"
              />
              <Label
                htmlFor="upload"
                className={`flex flex-col items-center justify-center rounded-xl border-2 p-6 cursor-pointer hover:bg-slate-50 transition-all ${
                  state.avatarSource === 'upload'
                    ? 'border-slate-800 bg-slate-50 shadow-sm'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <div className={`h-16 w-16 rounded-full border-2 border-dashed flex items-center justify-center mb-4 transition-colors ${
                  state.avatarSource === 'upload' ? 'border-slate-400 bg-white' : 'border-gray-300'
                }`}>
                  <Upload className={`w-6 h-6 ${state.avatarSource === 'upload' ? 'text-slate-700' : 'text-gray-400'}`} />
                </div>
                <div className="font-semibold text-gray-900">Upload Custom Image</div>
                <div className="text-xs text-gray-500 mt-1">S3 implementation coming soon</div>
              </Label>
            </div>
          </RadioGroup>
        </div>
      </div>
    </div>
  );
}
