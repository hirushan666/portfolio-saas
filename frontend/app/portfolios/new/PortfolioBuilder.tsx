'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PortfolioBuilderState } from '@/types/portfolio-builder';
import { User } from 'next-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { BasicInfoStep } from '@/components/portfolio-builder/BasicInfoStep';
import { ProjectsStep } from '@/components/portfolio-builder/ProjectsStep';
import { ThemeStep } from '@/components/portfolio-builder/ThemeStep';
import { ChevronRight, ChevronLeft, Loader2 } from 'lucide-react';

export function PortfolioBuilder({ user }: { user: User }) {
  const router = useRouter();
  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Global State
  const [state, setState] = useState<PortfolioBuilderState>({
    title: 'Full Stack Developer',
    name: user.name || '',
    bio: '',
    avatarSource: 'github',
    projects: [],
    theme: 'minimal',
  });

  const updateState = (updates: Partial<PortfolioBuilderState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  const handleNext = () => {
    // Basic validation before allowing next step could go here
    if (step < 3) setStep((s) => s + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep((s) => s - 1);
  };

  const handleSubmit = async () => {
    if (!user.id) return;
    setIsSubmitting(true);
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

      const payload: any = {
        userId: user.id,
        title: state.title,
        bio: state.bio,
        theme: state.theme,
        data: {
          name: state.name,
          avatarSource: state.avatarSource,
        }
      };

      if (state.avatarSource === 'upload' && state.avatarUploadUrl) {
        payload.avatarUrl = state.avatarUploadUrl;
      }

      const portfolioRes = await fetch(`${apiUrl}/portfolios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!portfolioRes.ok) throw new Error('Failed to create portfolio');
      
      const newPortfolio = await portfolioRes.json();

      // 2. Add the Projects (if any)
      if (state.projects.length > 0) {
        await Promise.all(state.projects.map((project, index) => 
          fetch(`${apiUrl}/projects`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              portfolioId: newPortfolio.id,
              title: project.title,
              description: project.description,
              techStack: project.techStack,
              githubUrl: project.githubUrl,
              liveUrl: project.liveUrl,
              stars: project.stars,
              forks: project.forks,
              language: project.language,
              displayOrder: index,
              featured: false
            }),
          })
        ));
      }

      // 3. Success! Redirect to dashboard
      router.push('/dashboard');
      router.refresh(); // Force Next.js to re-fetch Server Component data

    } catch (e) {
      console.error('Submission error:', e);
      setIsSubmitting(false);
      alert('Failed to save portfolio. Check console for details.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Wizard */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        {[1, 2, 3].map((num) => (
          <div key={num} className="flex items-center flex-1 last:flex-none">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold transition-colors ${
                step >= num
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                  : 'bg-gray-100 text-gray-400'
              }`}
            >
              {num}
            </div>
            {num < 3 && (
              <div
                className={`flex-1 h-1 mx-4 rounded-full transition-colors ${
                  step > num ? 'bg-indigo-600' : 'bg-gray-100'
                }`}
              />
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-between px-2 text-sm text-gray-500 font-medium">
        <span>Basic Info</span>
        <span>Projects</span>
        <span>Theme Selection</span>
      </div>

      <Card className="border-gray-200 shadow-xl shadow-gray-200/40 rounded-2xl overflow-hidden">
        <CardContent className="p-8 min-h-[400px]">
          {step === 1 && (
            <BasicInfoStep state={state} updateState={updateState} user={user} />
          )}
          {step === 2 && (
            <ProjectsStep state={state} updateState={updateState} user={user} />
          )}
          {step === 3 && (
            <ThemeStep state={state} updateState={updateState} />
          )}
        </CardContent>
        <CardFooter className="bg-gray-50 border-t border-gray-100 p-6 flex justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={step === 1 || isSubmitting}
            className="text-gray-600 border-gray-300"
          >
            <ChevronLeft className="w-4 h-4 mr-2" /> Back
          </Button>

          {step < 3 ? (
            <Button
              onClick={handleNext}
              className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200"
            >
              Continue to Step {step + 1}
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating Portfolio...
                </>
              ) : (
                'Create Portfolio'
              )}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
