'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PortfolioBuilderState } from '@/types/portfolio-builder';
import { User } from 'next-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { BasicInfoStep } from '@/components/portfolio-builder/BasicInfoStep';
// import { ProjectsStep } from '@/components/portfolio-builder/ProjectsStep';
// import { ThemeStep } from '@/components/portfolio-builder/ThemeStep';
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
    // TODO: Connect to backend for final creation
    setIsSubmitting(true);
    // Simulate API call for now
    setTimeout(() => {
      setIsSubmitting(false);
      // router.push("/dashboard");
    }, 1500);
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
            <div className="text-center py-20 text-gray-500">
              {/* <ProjectsStep state={state} updateState={updateState} user={user} /> */}
              <p>Step 2: Projects (Coming Soon)</p>
            </div>
          )}
          {step === 3 && (
            <div className="text-center py-20 text-gray-500">
              {/* <ThemeStep state={state} updateState={updateState} /> */}
              <p>Step 3: Theme Selection (Coming Soon)</p>
            </div>
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
