import React from 'react';

export const getCustomStyles = () => `
  <style>
    .katex { 
      font-size: 1.1em !important;
      font-family: KaTeX_Main, 'Times New Roman', serif !important;
    }
    .katex-display { 
      overflow: auto hidden;
      margin: 1.5em 0 !important;
      padding: 1.5em !important;
      background: rgba(0, 0, 0, 0.02);
      border-radius: 0.5rem;
      border: 1px solid rgba(0, 0, 0, 0.05);
    }
    .katex-display > .katex { 
      white-space: normal !important;
      text-align: center !important;
      max-width: 100% !important;
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
    /* Additional styles for better visibility */
    .markdown-content { 
      color: inherit;
      font-size: 1rem;
      line-height: 1.75;
    }
    .markdown-content p { margin-bottom: 1.25em; }
    .markdown-content hr { margin: 2em 0; }
    .markdown-content h3 { 
      color: #1e293b;
      margin-top: 1.5em;
      margin-bottom: 0.75em;
    }
    .dark .markdown-content h3 { color: #e5e7eb; }
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