import React, { useState } from 'react';
import type { StoryInputs } from '../types.ts';

interface StoryFormProps {
  onSubmit: (inputs: StoryInputs) => void;
  error: string | null;
}

const formFields = [
  { id: 'character', label: 'Who is the main character?', placeholder: 'e.g., A brave space pilot named Alice' },
  { id: 'setting', label: "What's the setting (time/place)?", placeholder: 'e.g., A futuristic city on Mars' },
  { id: 'problem', label: 'What is the main conflict or problem?', placeholder: 'e.g., Her spaceship is damaged and a meteor is coming' },
  { id: 'solution', label: 'How does the character try to solve it?', placeholder: 'e.g., She uses a quirky alien robot for help' },
  { id: 'ending', label: 'What is the ending or twist?', placeholder: 'e.g., The robot was the one who caused the damage' }
];

const StoryForm: React.FC<StoryFormProps> = ({ onSubmit, error }) => {
  const [inputs, setInputs] = useState<StoryInputs>({
    character: '',
    setting: '',
    problem: '',
    solution: '',
    ending: '',
    panelCount: 3,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const updatedValue = type === 'range' ? parseInt(value, 10) : value;
    setInputs(prev => ({ ...prev, [name]: updatedValue }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(inputs);
  };

  const isFormValid = Object.entries(inputs).every(([key, value]) => {
    if (key === 'panelCount') return true;
    return typeof value === 'string' && value.trim() !== '';
  });

  return (
    <div className="w-full max-w-2xl bg-slate-800 p-8 rounded-xl shadow-2xl border border-slate-700">
      <form onSubmit={handleSubmit} className="space-y-6">
        {formFields.map(field => (
          <div key={field.id}>
            <label htmlFor={field.id} className="block text-lg font-medium text-slate-300 mb-2">
              {field.label}
            </label>
            <input
              type="text"
              id={field.id}
              name={field.id}
              value={inputs[field.id as keyof Omit<StoryInputs, 'panelCount'>]}
              onChange={handleChange}
              placeholder={field.placeholder}
              className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition duration-200"
              required
            />
          </div>
        ))}
        <div>
            <label htmlFor="panelCount" className="block text-lg font-medium text-slate-300 mb-2">
                Number of Panels: <span className="font-bold text-purple-400">{inputs.panelCount}</span>
            </label>
            <input
                type="range"
                id="panelCount"
                name="panelCount"
                min="1"
                max="10"
                value={inputs.panelCount}
                onChange={handleChange}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
        </div>
        {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-center">
                <p>{error}</p>
            </div>
        )}
        <button
          type="submit"
          disabled={!isFormValid}
          className="w-full py-4 text-xl font-bold text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-purple-500 focus:ring-opacity-50 transition-transform transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
        >
          Generate Comic
        </button>
      </form>
    </div>
  );
};

export default StoryForm;