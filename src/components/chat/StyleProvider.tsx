import React from 'react';

export const getCustomStyles = () => `
  <style>
    .katex { 
      font-size: 1.1em !important;
      font-family: KaTeX_Main, 'Times New Roman', serif !important;
    }
    .katex-block { 
      margin: 2em 0 !important;
      padding: 1.5em !important;
      background: rgba(30, 41, 59, 0.05);
      border: 1px solid rgba(30, 41, 59, 0.1);
      border-radius: 0.5rem;
      overflow-x: auto;
      font-family: 'Fira Code', monospace;
      white-space: pre;
      font-size: 0.9em;
      line-height: 1.5;
    }
    .dark .katex-block {
      background: rgba(30, 41, 59, 0.3);
      border-color: rgba(255, 255, 255, 0.1);
    }
    /* Inline math styling */
    .katex-inline {
      padding: 0.2em 0.4em;
      margin: 0 0.2em;
      background: rgba(0, 0, 0, 0.01);
      border-radius: 0.25rem;
    }
    .dark .katex-inline {
      background: rgba(255, 255, 255, 0.02);
    }
    /* Additional styles for better visibility */
    .markdown-content { 
      color: inherit;
      font-size: 1rem;
      line-height: 1.75;
    }
    .markdown-content p { margin: 1.5em 0; }
    .markdown-content h3 { 
      color: #1e293b;
      font-size: 1.3em;
      margin: 2em 0 1em 0;
      font-weight: 600;
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