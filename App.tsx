import React, { useState, useCallback } from 'react';
import { StoryInputs, AppState, ComicScene, GeneratedImage } from './types.ts';
import StoryForm from './components/StoryForm.tsx';
import { ComicViewer } from './components/ComicViewer.tsx';
import LoadingSpinner from './components/LoadingSpinner.tsx';
import { generateStoryAndImagePrompts, generateImage } from './services/geminiService.ts';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.FORM);
  const [storyInputs, setStoryInputs] = useState<StoryInputs | null>(null);
  const [comicScenes, setComicScenes] = useState<ComicScene[]>([]);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateComic = useCallback(async (inputs: StoryInputs) => {
    setAppState(AppState.GENERATING);
    setError(null);
    setStoryInputs(inputs);
    setComicScenes([]);
    setGeneratedImages([]);

    try {
      const storyData = await generateStoryAndImagePrompts(inputs);
      setComicScenes(storyData);

      const imagePromises = storyData.map((scene, index) => 
        generateImage(scene.imagePrompt).then(base64 => ({ id: `scene-${index}`, base64 }))
      );
      
      const images = await Promise.all(imagePromises);
      setGeneratedImages(images);

      setAppState(AppState.VIEWING);
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Failed to generate comic. ${errorMessage}. Please ensure your API key is correctly configured and try again.`);
      setAppState(AppState.FORM);
    }
  }, []);

  const handleReset = () => {
    setAppState(AppState.FORM);
    setStoryInputs(null);
    setComicScenes([]);
    setGeneratedImages([]);
    setError(null);
  };

  const renderContent = () => {
    switch (appState) {
      case AppState.GENERATING:
        return <LoadingSpinner scenes={comicScenes} totalScenes={storyInputs?.panelCount ?? 3} />;
      case AppState.VIEWING:
        return <ComicViewer scenes={comicScenes} images={generatedImages} onReset={handleReset} />;
      case AppState.FORM:
      default:
        return <StoryForm onSubmit={handleGenerateComic} error={error} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center p-4 sm:p-6 md:p-8 font-sans">
      <header className="w-full max-w-5xl mb-8 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
          🎯 QuickComic.ai
        </h1>
        <p className="text-slate-400 mt-2 text-lg">Tell a story in seconds.</p>
      </header>
      <main className="w-full max-w-5xl flex-grow flex items-center justify-center">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;