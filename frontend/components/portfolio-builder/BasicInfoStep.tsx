'use client';

import { useRef, useState } from 'react';
import { PortfolioBuilderState } from '@/types/portfolio-builder';
import { User } from 'next-auth';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Upload, Github, Loader2, CheckCircle2 } from 'lucide-react';

interface BasicInfoStepProps {
  state: PortfolioBuilderState;
  updateState: (updates: Partial<PortfolioBuilderState>) => void;
  user: User;
}

export function BasicInfoStep({ state, updateState, user }: BasicInfoStepProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select an image file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image must be under 5MB.');
      return;
    }

    setUploadError(null);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(`${apiUrl}/upload/avatar`, { method: 'POST', body: formData });
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      updateState({ avatarUploadUrl: data.url, avatarSource: 'upload' });
    } catch {
      setUploadError('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const githubAvatarUrl = `https://avatars.githubusercontent.com/${(user as unknown as { githubUsername?: string }).githubUsername || user.name}`;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">Basic Information</h2>
        <p className="text-gray-500">Tell us a bit about yourself. This will be the first thing people see.</p>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          <Label className="text-gray-700 font-medium text-lg">Profile Photo</Label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* GitHub Avatar */}
            <button
              type="button"
              onClick={() => updateState({ avatarSource: 'github' })}
              className={`flex flex-col items-center justify-center rounded-xl border-2 p-6 cursor-pointer hover:bg-indigo-50/50 transition-all ${
                state.avatarSource === 'github'
                  ? 'border-indigo-600 bg-indigo-50/30 shadow-sm'
                  : 'border-gray-200 bg-white'
              }`}
            >
              <Avatar className="h-16 w-16 border-2 border-indigo-100 mb-4 shadow-sm">
                <AvatarImage src={githubAvatarUrl} />
                <AvatarFallback className="bg-indigo-100 text-indigo-700">
                  <Github className="w-8 h-8" />
                </AvatarFallback>
              </Avatar>
              <div className="font-semibold text-gray-900 flex items-center gap-2">
                <Github className="w-4 h-4 text-indigo-600" />
                Use GitHub Avatar
                {state.avatarSource === 'github' && <CheckCircle2 className="w-4 h-4 text-indigo-500" />}
              </div>
              <div className="text-xs text-gray-500 mt-1">Automatic sync</div>
            </button>

            {/* Upload Custom */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className={`flex flex-col items-center justify-center rounded-xl border-2 p-6 cursor-pointer hover:bg-slate-50 transition-all disabled:opacity-60 ${
                state.avatarSource === 'upload'
                  ? 'border-slate-800 bg-slate-50 shadow-sm'
                  : 'border-gray-200 bg-white'
              }`}
            >
              {state.avatarSource === 'upload' && state.avatarUploadUrl ? (
                <img
                  src={state.avatarUploadUrl}
                  alt="Uploaded avatar"
                  className="h-16 w-16 rounded-full object-cover border-2 border-slate-300 mb-4 shadow-sm"
                />
              ) : (
                <div className={`h-16 w-16 rounded-full border-2 border-dashed flex items-center justify-center mb-4 transition-colors ${
                  state.avatarSource === 'upload' ? 'border-slate-400 bg-white' : 'border-gray-300'
                }`}>
                  {isUploading
                    ? <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
                    : <Upload className={`w-6 h-6 ${state.avatarSource === 'upload' ? 'text-slate-700' : 'text-gray-400'}`} />}
                </div>
              )}
              <div className="font-semibold text-gray-900 flex items-center gap-2">
                {isUploading ? 'Uploading...' : 'Upload Custom Image'}
                {state.avatarSource === 'upload' && !isUploading && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {state.avatarUploadUrl ? 'Click to replace' : 'JPG, PNG up to 5MB'}
              </div>
            </button>
          </div>

          {/* Hidden real file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />

          {uploadError && (
            <p className="text-sm text-red-500">⚠️ {uploadError}</p>
          )}

          {state.avatarSource === 'upload' && state.avatarUploadUrl && !isUploading && (
            <p className="text-sm text-emerald-600 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Photo uploaded successfully!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
