import React, { forwardRef } from 'react';
import SpeechBubble from './SpeechBubble.tsx';

interface ComicPanelProps {
  sceneDescription: string;
  dialogue: string;
  imageUrl: string;
}

const ComicPanel = forwardRef<HTMLDivElement, ComicPanelProps>(({ sceneDescription, dialogue, imageUrl }, ref) => {
  return (
    <div
      ref={ref}
      className="aspect-[16/9] w-full bg-slate-700 rounded-lg overflow-hidden border-4 border-slate-300 shadow-lg shadow-black/50 relative"
    >
      {imageUrl ? (
        <img src={imageUrl} alt={sceneDescription} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <div className="animate-pulse text-slate-400">Generating art...</div>
        </div>
      )}
      <div className="absolute inset-0 p-4 flex flex-col justify-end">
        <SpeechBubble text={dialogue} />
      </div>
    </div>
  );
});

ComicPanel.displayName = 'ComicPanel';
export default ComicPanel;