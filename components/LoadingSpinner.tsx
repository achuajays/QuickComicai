import React from 'react';
import type { ComicScene } from '../types.ts';

interface LoadingSpinnerProps {
  scenes: ComicScene[];
  totalScenes: number;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ scenes, totalScenes }) => {
  const steps = [
    { id: 'story', text: 'Generating story panels...' },
    { id: 'images', text: 'Illustrating scenes...' },
    { id: 'final', text: 'Bringing your comic to life!' }
  ];

  let currentStepIndex = 0;
  if (scenes.length > 0) currentStepIndex = 1;
  if (scenes.length === totalScenes && totalScenes > 0) currentStepIndex = 2;

  return (
    <div className="flex flex-col items-center justify-center text-center p-8 bg-slate-800 rounded-xl border border-slate-700 shadow-2xl">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-purple-400"></div>
      <h2 className="text-2xl font-bold mt-6 text-slate-200">Creating Your Comic...</h2>
      <div className="mt-4 w-full max-w-xs space-y-2">
        {steps.map((step, index) => (
          <div key={step.id} className={`flex items-center text-left transition-opacity duration-500 ${index <= currentStepIndex ? 'opacity-100' : 'opacity-40'}`}>
            <div className={`w-5 h-5 rounded-full mr-3 flex-shrink-0 flex items-center justify-center transition-all duration-300 ${index < currentStepIndex ? 'bg-green-400' : (index === currentStepIndex ? 'bg-purple-400 animate-pulse' : 'bg-slate-600')}`}>
              {index < currentStepIndex && (
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <p className="text-slate-300">{step.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoadingSpinner;