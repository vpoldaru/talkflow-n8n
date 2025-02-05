import React from 'react';

interface PlaygroundOutputProps {
  language: string;
  output: string;
  iframeRef: React.RefObject<HTMLDivElement>;
  outputRef: React.RefObject<HTMLDivElement>;
}

export const PlaygroundOutput: React.FC<PlaygroundOutputProps> = ({
  language,
  output,
  iframeRef,
  outputRef,
}) => {
  const isDark = document.documentElement.classList.contains('dark');

  return (
    <div className="h-full flex flex-col">
      {language === 'html' ? (
        <div 
          ref={iframeRef} 
          className={`w-full h-full ${isDark ? 'bg-background text-foreground' : 'bg-white text-black'}`}
          style={{ color: 'inherit' }}
        />
      ) : (
        <div 
          ref={outputRef} 
          className="w-full h-full p-4 font-mono text-sm overflow-auto bg-black text-white"
        >
          {output}
        </div>
      )}
    </div>
  );
};