'use client';

import { useState, useEffect } from 'react';
import { PortfolioBuilderState, BuilderProject } from '@/types/portfolio-builder';
import { User } from 'next-auth';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Github, Plus, Trash2, Library, Check, Search, ExternalLink } from 'lucide-react';

interface ProjectsStepProps {
  state: PortfolioBuilderState;
  updateState: (updates: Partial<PortfolioBuilderState>) => void;
  user: User;
}

export function ProjectsStep({ state, updateState, user }: ProjectsStepProps) {
  const [manualProject, setManualProject] = useState<Partial<BuilderProject>>({
    title: '',
    description: '',
    techStack: [],
    githubUrl: '',
    liveUrl: '',
    isGithubImport: false,
  });
  const [techStackInput, setTechStackInput] = useState('');

  const [githubRepos, setGithubRepos] = useState<any[]>([]);
  const [isLoadingRepos, setIsLoadingRepos] = useState(false);
  const [repoError, setRepoError] = useState<string | null>(null);
  const [repoSearch, setRepoSearch] = useState('');
  const [selectedRepoIds, setSelectedRepoIds] = useState<Set<number>>(new Set());

  // Handle adding a manual project
  const handleAddManualProject = () => {
    if (!manualProject.title) return;

    const newProject: BuilderProject = {
      id: crypto.randomUUID(),
      title: manualProject.title,
      description: manualProject.description || '',
      techStack: manualProject.techStack || [],
      githubUrl: manualProject.githubUrl || '',
      liveUrl: manualProject.liveUrl || '',
      isGithubImport: false,
    };

    updateState({ projects: [...state.projects, newProject] });
    
    // Reset form
    setManualProject({
      title: '',
      description: '',
      techStack: [],
      githubUrl: '',
      liveUrl: '',
      isGithubImport: false,
    });
    setTechStackInput('');
  };

  const handleAddTech = () => {
    if (!techStackInput.trim()) return;
    setManualProject((prev) => ({
      ...prev,
      techStack: [...(prev.techStack || []), techStackInput.trim()],
    }));
    setTechStackInput('');
  };

  const handleRemoveTech = (index: number) => {
    setManualProject((prev) => ({
      ...prev,
      techStack: prev.techStack?.filter((_, i) => i !== index),
    }));
  };

  const handleRemoveProject = (id: string) => {
    updateState({
      projects: state.projects.filter(p => p.id !== id),
    });
  };

  // Fetch GitHub repos directly from client (public API, no auth needed)
  const fetchGithubRepos = async () => {
    const username = (user as any).githubUsername;
    console.log('[ProjectsStep] user object:', JSON.stringify(user));
    console.log('[ProjectsStep] githubUsername:', username);

    if (!username) {
      setRepoError('GitHub username not found in your session. Try signing out and signing back in.');
      return;
    }

    setIsLoadingRepos(true);
    setRepoError(null);
    try {
      const url = `https://api.github.com/users/${username}/repos?sort=updated&per_page=100`;
      console.log('[ProjectsStep] Fetching:', url);
      const res = await fetch(url);

      if (!res.ok) {
        const errorText = await res.text();
        console.error('[ProjectsStep] GitHub API error:', res.status, errorText);
        setRepoError(`GitHub API returned ${res.status}. You may be rate-limited. Try again in a minute.`);
        return;
      }

      const data = await res.json();
      console.log('[ProjectsStep] Fetched repos:', data.length);
      setGithubRepos(data);

      if (data.length === 0) {
        setRepoError('No public repositories found for this GitHub account.');
      }
    } catch (e) {
      console.error('[ProjectsStep] Failed to fetch repos:', e);
      setRepoError('Network error fetching repositories. Check your internet connection.');
    } finally {
      setIsLoadingRepos(false);
    }
  };

  const toggleRepoSelection = (repoId: number) => {
    const next = new Set(selectedRepoIds);
    if (next.has(repoId)) {
      next.delete(repoId);
    } else {
      next.add(repoId);
    }
    setSelectedRepoIds(next);
  };

  const importSelectedRepos = () => {
    const reposToImport = githubRepos.filter(repo => selectedRepoIds.has(repo.id));
    
    const newProjects: BuilderProject[] = reposToImport.map(repo => ({
      id: crypto.randomUUID(),
      title: repo.name,
      description: repo.description || '',
      techStack: repo.topics && repo.topics.length > 0 ? repo.topics : (repo.language ? [repo.language] : []),
      githubUrl: repo.html_url,
      liveUrl: repo.homepage || '',
      isGithubImport: true,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      language: repo.language,
    }));

    updateState({ projects: [...state.projects, ...newProjects] });
    setSelectedRepoIds(new Set()); // Clear selection
  };

  const filteredRepos = githubRepos.filter(repo => 
    repo.name.toLowerCase().includes(repoSearch.toLowerCase()) &&
    !state.projects.some(p => p.githubUrl === repo.html_url) // Don't show already imported
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">Projects Showcase</h2>
        <p className="text-gray-500">Add the projects you're most proud of. You can add them manually or import directly from GitHub.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Add Project Forms */}
        <div className="lg:col-span-7 space-y-6">
          <Tabs defaultValue="github" className="w-full">
            <TabsList className="w-full grid grid-cols-2 p-1 bg-gray-100/80 rounded-xl">
              <TabsTrigger value="github" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-indigo-600 font-medium">
                <Github className="w-4 h-4 mr-2" />
                Import from GitHub
              </TabsTrigger>
              <TabsTrigger value="manual" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-indigo-600 font-medium">
                <Plus className="w-4 h-4 mr-2" />
                Add Manually
              </TabsTrigger>
            </TabsList>

            {/* GITHUB IMPORT TAB */}
            <TabsContent value="github" className="mt-4 border border-gray-100 rounded-xl p-6 bg-white shadow-sm space-y-4">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Your GitHub Repositories</h3>
                  <p className="text-sm text-gray-500">Select public repositories to feature.</p>
                </div>
                {githubRepos.length === 0 ? (
                  <Button onClick={fetchGithubRepos} disabled={isLoadingRepos} variant="outline" size="sm">
                    {isLoadingRepos ? 'Loading...' : 'Fetch Repositories'}
                  </Button>
                ) : (
                  <Button 
                    onClick={importSelectedRepos} 
                    disabled={selectedRepoIds.size === 0}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    Import {selectedRepoIds.size > 0 ? `(${selectedRepoIds.size})` : ''}
                  </Button>
                )}
              </div>

              {repoError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {repoError}
                </div>
              )}

              {githubRepos.length > 0 && (
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input 
                      placeholder="Search repositories..." 
                      className="pl-9 bg-gray-50 border-gray-200"
                      value={repoSearch}
                      onChange={(e) => setRepoSearch(e.target.value)}
                    />
                  </div>

                  <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2">
                    {filteredRepos.length === 0 ? (
                      <div className="text-center py-8 text-gray-500 text-sm">No repositories found.</div>
                    ) : (
                      filteredRepos.map(repo => (
                        <div 
                          key={repo.id}
                          onClick={() => toggleRepoSelection(repo.id)}
                          className={`flex items-start p-3 rounded-lg border cursor-pointer transition-all ${
                            selectedRepoIds.has(repo.id) 
                              ? 'border-indigo-500 bg-indigo-50/30' 
                              : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                          }`}
                        >
                          <div className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center border mr-3 shrink-0 ${
                            selectedRepoIds.has(repo.id) ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300 bg-white'
                          }`}>
                            {selectedRepoIds.has(repo.id) && <Check className="w-3.5 h-3.5 text-white" />}
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-medium text-gray-900 truncate">{repo.name}</h4>
                            <p className="text-xs text-gray-500 truncate mt-0.5">{repo.description || 'No description provided'}</p>
                            <div className="flex gap-3 mt-2 text-xs text-gray-500">
                              {repo.language && <span>{repo.language}</span>}
                              <span>★ {repo.stargazers_count}</span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </TabsContent>

            {/* MANUAL ADD TAB */}
            <TabsContent value="manual" className="mt-4 border border-gray-100 rounded-xl p-6 bg-white shadow-sm space-y-5">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-gray-700">Project Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g. E-Commerce Platform"
                    value={manualProject.title}
                    onChange={(e) => setManualProject({ ...manualProject, title: e.target.value })}
                    className="bg-gray-50 border-gray-200"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="desc" className="text-gray-700">Description</Label>
                  <Textarea
                    id="desc"
                    placeholder="What does it do? What problems does it solve?"
                    value={manualProject.description}
                    onChange={(e) => setManualProject({ ...manualProject, description: e.target.value })}
                    className="bg-gray-50 border-gray-200 resize-y min-h-[80px]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="githubUrl" className="text-gray-700">GitHub URL</Label>
                    <Input
                      id="githubUrl"
                      placeholder="https://github.com/..."
                      value={manualProject.githubUrl}
                      onChange={(e) => setManualProject({ ...manualProject, githubUrl: e.target.value })}
                      className="bg-gray-50 border-gray-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="liveUrl" className="text-gray-700">Live URL</Label>
                    <Input
                      id="liveUrl"
                      placeholder="https://my-project.com"
                      value={manualProject.liveUrl}
                      onChange={(e) => setManualProject({ ...manualProject, liveUrl: e.target.value })}
                      className="bg-gray-50 border-gray-200"
                    />
                  </div>
                </div>

                {/* Tech Stack Chips */}
                <div className="space-y-2">
                  <Label className="text-gray-700">Tech Stack</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="e.g. React"
                      value={techStackInput}
                      onChange={(e) => setTechStackInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTech())}
                      className="bg-gray-50 border-gray-200"
                    />
                    <Button type="button" variant="secondary" onClick={handleAddTech}>Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {manualProject.techStack?.map((tech, i) => (
                      <div key={i} className="flex items-center gap-1 bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-md text-sm border border-indigo-100">
                        {tech}
                        <button type="button" onClick={() => handleRemoveTech(i)} className="text-indigo-400 hover:text-indigo-900 ml-1">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <Button 
                  onClick={handleAddManualProject} 
                  disabled={!manualProject.title}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Project
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Side: Selected Projects List */}
        <div className="lg:col-span-5 relative">
          <div className="sticky top-24 bg-gray-50/50 border border-gray-200 rounded-2xl p-6 min-h-[400px]">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Library className="w-5 h-5 text-indigo-500" />
              Added Projects ({state.projects.length})
            </h3>
            
            {state.projects.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[250px] text-gray-400 text-center">
                <Library className="w-12 h-12 mb-3 text-gray-200" />
                <p>No projects added yet.</p>
                <p className="text-sm mt-1">Add them from the left.</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {state.projects.map((project) => (
                  <Card key={project.id} className="p-4 border-gray-200 shadow-sm relative group bg-white">
                    <button 
                      onClick={() => handleRemoveProject(project.id)}
                      className="absolute top-3 right-3 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    
                    <div className="pr-6">
                      <div className="flex items-center gap-2">
                        {project.isGithubImport && <Github className="w-3.5 h-3.5 text-gray-400" />}
                        <h4 className="font-semibold text-gray-900 truncate">{project.title}</h4>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{project.description}</p>
                      
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {project.techStack.slice(0, 3).map((tech, i) => (
                          <span key={i} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full border border-gray-200">
                            {tech}
                          </span>
                        ))}
                        {project.techStack.length > 3 && (
                          <span className="text-[10px] text-gray-400">+{project.techStack.length - 3} more</span>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
