import React from 'react';

interface SpeechBubbleProps {
  text: string;
}

const SpeechBubble: React.FC<SpeechBubbleProps> = ({ text }) => {
  if (!text) return null;

  return (
    <div className="relative inline-block bg-white text-black rounded-lg p-3 shadow-md max-w-[80%] mx-auto filter drop-shadow-lg">
      <p className="font-bold font-sans" style={{ fontFamily: '"Comic Neue", cursive' }}>{text}</p>
      <div 
        className="absolute left-1/2 -bottom-2 transform -translate-x-1/2 w-0 h-0"
        style={{
          borderLeft: '10px solid transparent',
          borderRight: '10px solid transparent',
          borderTop: '10px solid white',
        }}
      ></div>
    </div>
  );
};

export default SpeechBubble;