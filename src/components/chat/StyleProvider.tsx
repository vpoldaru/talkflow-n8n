import React from 'react';

export const getCustomStyles = () => `
  <style>
    .katex { 
      font-size: 1.1em !important;
      font-family: KaTeX_Main, 'Times New Roman', serif !important;
    }
    .katex-display { 
      overflow: auto hidden;
      margin: 1em 0;
      padding: 1em;
      background: rgba(0, 0, 0, 0.02);
      border-radius: 0.5rem;
      border: 1px solid rgba(0, 0, 0, 0.05);
    }
    .katex-display > .katex { 
      white-space: normal !important;
      text-align: center !important;
    }
    .katex-html {
      max-width: 100%;
      overflow-x: auto;
      overflow-y: hidden;
    }
    /* Dark mode styles */
    .dark .katex { color: #e5e7eb !important; }
    .dark .katex-display { 
      background: rgba(30, 41, 59, 0.3);
      border-color: rgba(255, 255, 255, 0.05);
    }
  </style>
`;

interface StyleProviderProps {
  children: React.ReactNode;
}

export const StyleProvider: React.FC<StyleProviderProps> = ({ children }) => {
  return (
    <div className="markdown-content">
      {children}
    </div>
  );
};