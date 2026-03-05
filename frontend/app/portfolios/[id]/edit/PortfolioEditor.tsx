'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Portfolio, Project } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Save, Loader2, ExternalLink, Trash2, CheckCircle2, ArrowLeft,
  Github, Plus, Search, Check, X, Library, Copy, ClipboardCheck, Upload, ImageIcon,
} from 'lucide-react';
import Link from 'next/link';

interface PortfolioEditorProps {
  portfolio: Portfolio;
  userId: string;
}

// --- Types ---
interface ImportableRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  topics: string[];
}

// --- Theme config ---
const themes = [
  {
    id: 'minimal', name: 'Minimal Clean',
    preview: (
      <div className="w-full h-16 bg-stone-50 border border-stone-200 rounded-lg p-2 flex flex-col gap-1">
        <div className="w-10 h-1.5 bg-stone-300 rounded" />
        <div className="w-16 h-2.5 bg-stone-700 rounded" />
        <div className="w-full h-1 bg-stone-200 rounded" />
      </div>
    ),
  },
  {
    id: 'midnight', name: 'Midnight Dark',
    preview: (
      <div className="w-full h-16 bg-slate-950 border border-slate-800 rounded-lg p-2 flex flex-col gap-1">
        <div className="w-10 h-1.5 bg-slate-700 rounded" />
        <div className="w-16 h-2.5 bg-indigo-400 rounded" />
        <div className="w-full h-1 bg-slate-800 rounded" />
      </div>
    ),
  },
  {
    id: 'vibrant', name: 'Vibrant Pop',
    preview: (
      <div className="w-full h-16 bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 border border-purple-400 rounded-lg p-2 flex flex-col gap-1">
        <div className="w-10 h-1.5 bg-white/40 rounded" />
        <div className="w-16 h-2.5 bg-white rounded" />
        <div className="w-full h-1 bg-white/30 rounded" />
      </div>
    ),
  },
];

export function PortfolioEditor({ portfolio, userId }: PortfolioEditorProps) {
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

  // Basic info state
  const [title, setTitle] = useState(portfolio.title);
  const [bio, setBio] = useState(portfolio.bio || '');
  const [theme, setTheme] = useState(portfolio.theme || 'minimal');
  const [avatarSource, setAvatarSource] = useState<'github' | 'upload'>(
    (portfolio.data?.avatarSource as 'github' | 'upload') || 'github'
  );

  // Projects state
  const [projects, setProjects] = useState<Project[]>(portfolio.projects || []);

  // GitHub import state
  const [githubRepos, setGithubRepos] = useState<ImportableRepo[]>([]);
  const [isLoadingRepos, setIsLoadingRepos] = useState(false);
  const [repoSearch, setRepoSearch] = useState('');
  const [selectedRepoIds, setSelectedRepoIds] = useState<Set<number>>(new Set());
  const [repoError, setRepoError] = useState<string | null>(null);

  // Manual add state
  const [manualTitle, setManualTitle] = useState('');
  const [manualDesc, setManualDesc] = useState('');
  const [manualGithub, setManualGithub] = useState('');
  const [manualLive, setManualLive] = useState('');
  const [manualTechs, setManualTechs] = useState<string[]>([]);
  const [techInput, setTechInput] = useState('');

  // Save state
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isDeletingProjectId, setIsDeletingProjectId] = useState<string | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [uploadedAvatarUrl, setUploadedAvatarUrl] = useState<string | null>(portfolio.avatarUrl || null);

  const publicUrl = portfolio.slug
    ? `/portfolios/${portfolio.slug}`
    : `/portfolios/${portfolio.id}`;

  const githubUsername = portfolio.user?.githubUsername;

  // --- GitHub Repo Fetch ---
  const fetchRepos = async () => {
    if (!githubUsername) {
      setRepoError('GitHub username not found on this account.');
      return;
    }
    setIsLoadingRepos(true);
    setRepoError(null);
    try {
      const res = await fetch(
        `https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=100`
      );
      if (!res.ok) { setRepoError(`GitHub API returned ${res.status}.`); return; }
      const data = await res.json();
      setGithubRepos(data);
    } catch {
      setRepoError('Network error fetching repos.');
    } finally {
      setIsLoadingRepos(false);
    }
  };

  const toggleRepo = (id: number) => {
    const next = new Set(selectedRepoIds);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelectedRepoIds(next);
  };

  const filteredRepos = githubRepos.filter(r =>
    r.name.toLowerCase().includes(repoSearch.toLowerCase()) &&
    !projects.some(p => p.githubUrl === r.html_url)
  );

  const importRepos = async () => {
    const toImport = githubRepos.filter(r => selectedRepoIds.has(r.id));
    for (const repo of toImport) {
      try {
        const res = await fetch(`${apiUrl}/projects`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            portfolioId: portfolio.id,
            title: repo.name,
            description: repo.description || '',
            techStack: repo.topics?.length > 0 ? repo.topics : (repo.language ? [repo.language] : []),
            githubUrl: repo.html_url,
            liveUrl: repo.homepage || '',
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            language: repo.language,
            displayOrder: projects.length,
          }),
        });
        if (res.ok) {
          const newProject = await res.json();
          setProjects(prev => [...prev, newProject]);
        }
      } catch (e) {
        console.error('Failed to import', repo.name, e);
      }
    }
    setSelectedRepoIds(new Set());
  };

  // --- Manual Add ---
  const addManualProject = async () => {
    if (!manualTitle.trim()) return;
    try {
      const res = await fetch(`${apiUrl}/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          portfolioId: portfolio.id,
          title: manualTitle,
          description: manualDesc,
          techStack: manualTechs,
          githubUrl: manualGithub,
          liveUrl: manualLive,
          displayOrder: projects.length,
          featured: false,
        }),
      });
      if (res.ok) {
        const newProject = await res.json();
        setProjects(prev => [...prev, newProject]);
        setManualTitle(''); setManualDesc(''); setManualGithub('');
        setManualLive(''); setManualTechs([]); setTechInput('');
      }
    } catch (e) { console.error(e); }
  };

  // --- Delete Project ---
  const deleteProject = async (projectId: string) => {
    setIsDeletingProjectId(projectId);
    try {
      await fetch(`${apiUrl}/projects/${projectId}`, { method: 'DELETE' });
      setProjects(prev => prev.filter(p => p.id !== projectId));
    } catch (e) { console.error(e); }
    finally { setIsDeletingProjectId(null); }
  };

  // --- Save Portfolio ---
  // --- Upload Avatar ---
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(`${apiUrl}/upload/avatar`, { method: 'POST', body: formData });
      if (res.ok) {
        const data = await res.json();
        setUploadedAvatarUrl(data.url);
        setAvatarSource('upload');
      }
    } catch (e) { console.error(e); }
    finally { setIsUploadingAvatar(false); }
  };

  const handleSave = async () => {
    setIsSaving(true); setSaved(false);
    try {
      const res = await fetch(`${apiUrl}/portfolios/${portfolio.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title, bio, theme,
          data: { ...portfolio.data, avatarSource },
          avatarUrl: avatarSource === 'upload' ? uploadedAvatarUrl : null,
        }),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
        router.refresh();
      }
    } catch (e) { console.error(e); }
    finally { setIsSaving(false); }
  };

  // --- Delete Portfolio ---
  const handleDelete = async () => {
    if (!confirm('Are you sure? This will permanently delete this portfolio and all its projects.')) return;
    setIsDeleting(true);
    try {
      await fetch(`${apiUrl}/portfolios/${portfolio.id}`, { method: 'DELETE' });
      router.push('/dashboard');
      router.refresh();
    } catch (e) { console.error(e); setIsDeleting(false); }
  };

  const avatarUrl = avatarSource === 'github' && githubUsername
    ? `https://avatars.githubusercontent.com/${githubUsername}`
    : '/default-avatar.png';

  // --- Copy URL ---
  const [copied, setCopied] = useState(false);
  const copyUrl = () => {
    const fullUrl = `${window.location.origin}${publicUrl}`;
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Top Bar */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <Link href="/dashboard" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <div className="flex items-center gap-3">
          <Link href={publicUrl} target="_blank"
            className="flex items-center gap-1.5 text-sm text-indigo-600 hover:underline">
            <ExternalLink className="w-3.5 h-3.5" /> Preview
          </Link>
          <Button onClick={handleSave} disabled={isSaving}
            className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200">
            {isSaving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</>
              : saved ? <><CheckCircle2 className="w-4 h-4 mr-2 text-emerald-300" />Saved!</>
                : <><Save className="w-4 h-4 mr-2" />Save Changes</>}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">

          {/* Section 1: Basic Info */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-5">
            <h2 className="text-base font-semibold text-gray-900 border-b border-gray-100 pb-3">Basic Information</h2>
            <div className="space-y-2">
              <Label htmlFor="title">Portfolio Title / Role</Label>
              <Input id="title" value={title} onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Full Stack Developer" className="bg-gray-50 border-gray-200" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea id="bio" value={bio} onChange={e => setBio(e.target.value)}
                placeholder="Tell visitors about yourself..." className="bg-gray-50 border-gray-200 resize-y min-h-[100px]" />
            </div>
          </div>

          {/* Section 2: Avatar */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
            <h2 className="text-base font-semibold text-gray-900 border-b border-gray-100 pb-3">Profile Picture</h2>
            <div className="flex items-center gap-6">
              {/* Live preview */}
              <div className="relative shrink-0">
                <img
                  src={
                    avatarSource === 'upload' && uploadedAvatarUrl
                      ? uploadedAvatarUrl
                      : `https://avatars.githubusercontent.com/${githubUsername}`
                  }
                  alt="Avatar"
                  className="w-20 h-20 rounded-full object-cover shadow border-2 border-indigo-200"
                />
                {isUploadingAvatar && (
                  <div className="absolute inset-0 bg-white/70 rounded-full flex items-center justify-center">
                    <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => setAvatarSource('github')}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${avatarSource === 'github' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                    <Github className="w-4 h-4 shrink-0" />
                    {avatarSource === 'github' && <Check className="w-3.5 h-3.5 text-indigo-500 shrink-0" />}
                    GitHub Avatar
                  </button>
                  <button onClick={() => setAvatarSource('upload')}
                    disabled={!uploadedAvatarUrl}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all disabled:opacity-50 ${avatarSource === 'upload' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                    <ImageIcon className="w-4 h-4 shrink-0" />
                    {avatarSource === 'upload' && <Check className="w-3.5 h-3.5 text-indigo-500 shrink-0" />}
                    Custom
                  </button>
                </div>
                {/* Upload button */}
                <label className={`flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl border-2 border-dashed cursor-pointer transition-all text-sm font-medium ${isUploadingAvatar ? 'border-indigo-300 bg-indigo-50 text-indigo-600' : 'border-gray-300 text-gray-500 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50'}`}>
                  {isUploadingAvatar
                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Uploading...</>
                    : <><Upload className="w-4 h-4" /> {uploadedAvatarUrl ? 'Replace photo' : 'Upload photo'}</>}
                  <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} disabled={isUploadingAvatar} />
                </label>
                {uploadedAvatarUrl && (
                  <p className="text-xs text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Custom photo uploaded — click Save Changes to apply.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Section 3: Theme */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
            <h2 className="text-base font-semibold text-gray-900 border-b border-gray-100 pb-3">Theme</h2>
            <div className="grid grid-cols-3 gap-4">
              {themes.map(t => {
                const isSelected = theme === t.id;
                return (
                  <button key={t.id} onClick={() => setTheme(t.id)}
                    className={`flex flex-col rounded-xl border-2 cursor-pointer transition-all overflow-hidden text-left ${isSelected ? 'border-indigo-600 shadow-md ring-2 ring-indigo-600/20' : 'border-gray-200 hover:border-gray-300'}`}>
                    {t.preview}
                    <div className="p-3 bg-white">
                      <div className="flex justify-between items-center">
                        <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 4: Projects */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-5">
            <h2 className="text-base font-semibold text-gray-900 border-b border-gray-100 pb-3">
              Manage Projects ({projects.length})
            </h2>

            <Tabs defaultValue="github" className="w-full">
              <TabsList className="w-full grid grid-cols-2 p-1 bg-gray-100/80 rounded-xl">
                <TabsTrigger value="github" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-indigo-600 font-medium">
                  <Github className="w-4 h-4 mr-2" /> Import from GitHub
                </TabsTrigger>
                <TabsTrigger value="manual" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-indigo-600 font-medium">
                  <Plus className="w-4 h-4 mr-2" /> Add Manually
                </TabsTrigger>
              </TabsList>

              {/* GitHub Import Tab */}
              <TabsContent value="github" className="mt-4 border border-gray-100 rounded-xl p-5 bg-white shadow-sm space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-gray-900">GitHub Repositories</h3>
                    <p className="text-xs text-gray-500">Import repos not already in your portfolio.</p>
                  </div>
                  {githubRepos.length === 0 ? (
                    <Button onClick={fetchRepos} disabled={isLoadingRepos} variant="outline" size="sm">
                      {isLoadingRepos ? 'Loading...' : 'Fetch Repos'}
                    </Button>
                  ) : (
                    <Button onClick={importRepos} disabled={selectedRepoIds.size === 0}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white" size="sm">
                      Import {selectedRepoIds.size > 0 ? `(${selectedRepoIds.size})` : ''}
                    </Button>
                  )}
                </div>
                {repoError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{repoError}</div>
                )}
                {githubRepos.length > 0 && (
                  <div className="space-y-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input placeholder="Search repos..." className="pl-9 bg-gray-50 border-gray-200"
                        value={repoSearch} onChange={e => setRepoSearch(e.target.value)} />
                    </div>
                    <div className="max-h-[280px] overflow-y-auto space-y-2 pr-1">
                      {filteredRepos.length === 0
                        ? <p className="text-center py-6 text-sm text-gray-400">No repos found.</p>
                        : filteredRepos.map(repo => (
                          <div key={repo.id} onClick={() => toggleRepo(repo.id)}
                            className={`flex items-start p-3 rounded-lg border cursor-pointer transition-all ${selectedRepoIds.has(repo.id) ? 'border-indigo-500 bg-indigo-50/30' : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'}`}>
                            <div className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center border mr-3 shrink-0 ${selectedRepoIds.has(repo.id) ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300 bg-white'}`}>
                              {selectedRepoIds.has(repo.id) && <Check className="w-3.5 h-3.5 text-white" />}
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-gray-900 text-sm truncate">{repo.name}</p>
                              <p className="text-xs text-gray-500 truncate">{repo.description || 'No description'}</p>
                              <div className="flex gap-3 mt-1 text-xs text-gray-400">
                                {repo.language && <span>{repo.language}</span>}
                                <span>★ {repo.stargazers_count}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </TabsContent>

              {/* Manual Tab */}
              <TabsContent value="manual" className="mt-4 border border-gray-100 rounded-xl p-5 bg-white shadow-sm space-y-4">
                <div className="space-y-2">
                  <Label>Project Title *</Label>
                  <Input placeholder="e.g. E-Commerce Platform" value={manualTitle}
                    onChange={e => setManualTitle(e.target.value)} className="bg-gray-50 border-gray-200" />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea placeholder="What does it do?" value={manualDesc}
                    onChange={e => setManualDesc(e.target.value)} className="bg-gray-50 border-gray-200 resize-y min-h-[80px]" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>GitHub URL</Label>
                    <Input placeholder="https://github.com/..." value={manualGithub}
                      onChange={e => setManualGithub(e.target.value)} className="bg-gray-50 border-gray-200" />
                  </div>
                  <div className="space-y-2">
                    <Label>Live URL</Label>
                    <Input placeholder="https://my-project.com" value={manualLive}
                      onChange={e => setManualLive(e.target.value)} className="bg-gray-50 border-gray-200" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Tech Stack</Label>
                  <div className="flex gap-2">
                    <Input placeholder="e.g. React" value={techInput} onChange={e => setTechInput(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); if (techInput.trim()) { setManualTechs(p => [...p, techInput.trim()]); setTechInput(''); } } }}
                      className="bg-gray-50 border-gray-200" />
                    <Button type="button" variant="secondary"
                      onClick={() => { if (techInput.trim()) { setManualTechs(p => [...p, techInput.trim()]); setTechInput(''); } }}>
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {manualTechs.map((t, i) => (
                      <span key={i} className="flex items-center gap-1 bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-md text-sm border border-indigo-100">
                        {t}
                        <button onClick={() => setManualTechs(prev => prev.filter((_, j) => j !== i))} className="ml-1 text-indigo-400 hover:text-indigo-900">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
                <Button onClick={addManualProject} disabled={!manualTitle.trim()}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white">
                  <Plus className="w-4 h-4 mr-2" /> Add Project
                </Button>
              </TabsContent>
            </Tabs>

            {/* Current Projects List */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-3">
                <Library className="w-4 h-4 text-indigo-500" /> Current Projects
              </h3>
              {projects.length === 0
                ? <p className="text-center py-8 text-sm text-gray-400">No projects added yet.</p>
                : <div className="space-y-2.5">
                  {projects.map(project => (
                    <div key={project.id}
                      className="flex items-start gap-3 p-3.5 rounded-xl border border-gray-100 bg-gray-50 group">
                      {project.githubUrl && <Github className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate text-sm">{project.title}</p>
                        <p className="text-xs text-gray-500 truncate mt-0.5">{project.description || 'No description'}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {project.techStack?.slice(0, 4).map(tech => (
                            <span key={tech} className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full">{tech}</span>
                          ))}
                          {(project.techStack?.length ?? 0) > 4 && (
                            <span className="text-[10px] text-gray-400">+{project.techStack!.length - 4} more</span>
                          )}
                        </div>
                      </div>
                      <button onClick={() => deleteProject(project.id)}
                        disabled={isDeletingProjectId === project.id}
                        className="shrink-0 p-1.5 text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                        {isDeletingProjectId === project.id
                          ? <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                          : <Trash2 className="w-4 h-4" />}
                      </button>
                    </div>
                  ))}
                </div>}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-4">
          {/* Public URL */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-3">
            <h3 className="font-semibold text-gray-900 text-sm">🌐 Public URL</h3>
            <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-2.5">
              <p className="font-mono text-xs text-indigo-700 break-all leading-relaxed">
                {typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}{publicUrl}
              </p>
            </div>
            <div className="flex gap-2">
              <Link href={publicUrl} target="_blank"
                className="flex items-center gap-1.5 text-xs text-indigo-600 hover:underline flex-1">
                <ExternalLink className="w-3 h-3" /> Open
              </Link>
              <button onClick={copyUrl}
                className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-all ${
                  copied
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'
                }`}>
                {copied
                  ? <><ClipboardCheck className="w-3 h-3" /> Copied!</>
                  : <><Copy className="w-3 h-3" /> Copy Link</>}
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-3">
            <h3 className="font-semibold text-gray-900 text-sm">📊 Stats</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Total Views</span>
                <span className="font-semibold text-gray-900">{portfolio.viewCount ?? 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Projects</span>
                <span className="font-semibold text-gray-900">{projects.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Theme</span>
                <span className="font-semibold text-gray-900 capitalize">{theme}</span>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-white rounded-2xl border border-red-100 p-5 shadow-sm space-y-3">
            <h3 className="font-semibold text-red-600 text-sm">⚠️ Danger Zone</h3>
            <p className="text-xs text-gray-500">Permanently delete this portfolio and all its projects.</p>
            <Button onClick={handleDelete} disabled={isDeleting} variant="outline"
              className="w-full text-sm text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300">
              {isDeleting
                ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Deleting...</>
                : <><Trash2 className="w-4 h-4 mr-2" />Delete Portfolio</>}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
