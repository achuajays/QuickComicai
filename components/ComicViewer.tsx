import React, { useRef, useState } from 'react';
import type { ComicScene, GeneratedImage } from '../types.ts';
import ComicPanel from './ComicPanel.tsx';
import { DownloadIcon } from './icons/DownloadIcon.tsx';
import { NewFileIcon } from './icons/NewFileIcon.tsx';

// These functions will be available globally from the scripts in index.html
declare const htmlToImage: any;
declare const saveAs: any;

interface ComicViewerProps {
  scenes: ComicScene[];
  images: GeneratedImage[];
  onReset: () => void;
}

export const ComicViewer: React.FC<ComicViewerProps> = ({ scenes, images, onReset }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const panelRef = useRef<HTMLDivElement | null>(null);

  const handleExportPanel = () => {
    const element = panelRef.current;
    if (element && typeof htmlToImage !== 'undefined' && typeof saveAs !== 'undefined') {
      htmlToImage.toPng(element, { cacheBust: true, pixelRatio: 2 })
        .then((dataUrl: string) => {
          saveAs(dataUrl, `quick-comic-panel-${currentIndex + 1}.png`);
        })
        .catch((error: any) => {
          console.error('Export failed:', error);
          alert('Could not export the panel. Please try again.');
        });
    }
  };
  
  const handleDownloadFullComic = () => {
    if (typeof saveAs === 'undefined') {
      alert('Could not save the file. The necessary library is missing.');
      return;
    }

    const panelHtml = scenes.map((scene, index) => {
      const image = images.find(img => img.id === `scene-${index}`);
      const imageUrl = image ? `data:image/jpeg;base64,${image.base64}` : '';
      const dialogue = scene.dialogue || '';

      return `
        <div class="panel">
          <img src="${imageUrl}" alt="${scene.scene.replace(/"/g, '&quot;')}">
          ${dialogue ? `
          <div class="speech-bubble-container">
            <div class="speech-bubble">
                <p>${dialogue.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
            </div>
          </div>` : ''}
        </div>
      `;
    }).join('');

    const fullHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your QuickComic.ai Creation</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Comic+Neue:wght@700&display=swap');
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background-color: #0f172a; color: #f1f5f9; padding: 2rem; margin: 0; }
        h1 { text-align: center; font-size: 2.5rem; font-weight: 700; margin-bottom: 2rem; background: linear-gradient(to right, #c084fc, #22d3ee); -webkit-background-clip: text; color: transparent; font-family: sans-serif; }
        .comic-container { display: grid; grid-template-columns: repeat(auto-fill, minmax(450px, 1fr)); gap: 1.5rem; max-width: 1400px; margin: auto; }
        .panel { aspect-ratio: 16 / 9; border: 4px solid #cbd5e1; border-radius: 0.5rem; overflow: hidden; position: relative; background-color: #334155; display: flex; flex-direction: column; justify-content: flex-end; align-items: center; box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1); }
        .panel img { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; z-index: 1; }
        .speech-bubble-container { z-index: 2; padding: 1rem; width: 100%; display: flex; justify-content: center; }
        .speech-bubble { position: relative; display: inline-block; background-color: white; color: black; border-radius: 0.5rem; padding: 0.75rem 1rem; max-width: 80%; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.5)); }
        .speech-bubble p { font-family: 'Comic Neue', cursive; font-weight: 700; font-size: 1.1rem; margin: 0; line-height: 1.3; }
        .speech-bubble::after { content: ''; position: absolute; left: 50%; bottom: -10px; transform: translateX(-50%); width: 0; height: 0; border-left: 10px solid transparent; border-right: 10px solid transparent; border-top: 10px solid white; }
    </style>
</head>
<body>
    <h1>QuickComic.ai</h1>
    <div class="comic-container">
        ${panelHtml}
    </div>
</body>
</html>
    `;
    
    const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
    saveAs(blob, 'my-quick-comic.html');
  };

  const handlePrev = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };
  
  const handleNext = () => {
    setCurrentIndex(prev => Math.min(scenes.length - 1, prev + 1));
  };

  const currentScene = scenes[currentIndex];
  const currentImage = images.find(img => img.id === `scene-${currentIndex}`);
  const buttonBaseClasses = "px-6 py-2 text-lg font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-opacity-50";
  const enabledButtonClasses = "bg-slate-700 text-white hover:bg-slate-600 focus:ring-slate-500";
  const disabledButtonClasses = "bg-slate-800 text-slate-500 cursor-not-allowed";

  return (
    <div className="w-full max-w-4xl flex flex-col items-center">
      <div className="w-full mb-6">
        {currentScene && (
          <ComicPanel
            ref={panelRef}
            sceneDescription={currentScene.scene}
            dialogue={currentScene.dialogue}
            imageUrl={currentImage ? `data:image/jpeg;base64,${currentImage.base64}` : ''}
          />
        )}
      </div>

      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <button onClick={handlePrev} disabled={currentIndex === 0} className={`${buttonBaseClasses} ${currentIndex === 0 ? disabledButtonClasses : enabledButtonClasses}`}>
            &larr; Prev
          </button>
          <span className="text-slate-300 font-semibold text-lg tabular-nums">
            {currentIndex + 1} / {scenes.length}
          </span>
          <button onClick={handleNext} disabled={currentIndex === scenes.length - 1} className={`${buttonBaseClasses} ${currentIndex === scenes.length - 1 ? disabledButtonClasses : enabledButtonClasses}`}>
            Next &rarr;
          </button>
        </div>
        <div className="flex items-center gap-2">
            <button
                onClick={handleExportPanel}
                className="flex items-center gap-2 bg-slate-700 text-white font-semibold py-2 px-4 rounded-lg hover:bg-slate-600 transition-colors duration-200"
            >
                <DownloadIcon />
                Export Panel
            </button>
            <button
                onClick={handleDownloadFullComic}
                className="flex items-center gap-2 bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors duration-200"
            >
                <DownloadIcon />
                Download Full Comic
            </button>
        </div>
      </div>
      
      <button
        onClick={onReset}
        className="flex items-center gap-2 text-lg font-bold text-white bg-gradient-to-r from-green-500 to-teal-500 rounded-lg px-6 py-3 hover:from-green-600 hover:to-teal-600 focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50 transition-transform transform hover:scale-105"
      >
        <NewFileIcon />
        Create New Comic
      </button>
    </div>
  );
};