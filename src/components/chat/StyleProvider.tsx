import React from 'react';

export const getCustomStyles = () => `
  <style>
    .katex { 
      font-size: 1.1em !important;
      font-family: KaTeX_Main, 'Times New Roman', serif !important;
    }
    
    /* Code block style for block LaTeX */
    .code-block-latex {
      margin: 1.5rem 0;
      background: rgb(15 23 42 / 0.95);
      border-radius: 0.75rem;
      overflow: hidden;
      border: 1px solid rgb(51 65 85 / 0.5);
    }

    .code-block-header {
      padding: 0.5rem 1rem;
      background: rgb(30 41 59 / 0.95);
      border-bottom: 1px solid rgb(51 65 85 / 0.5);
    }

    .code-block-content {
      padding: 1rem;
      overflow-x: auto;
      color: #e2e8f0;
      font-family: 'Fira Code', monospace;
      font-size: 0.875rem;
      line-height: 1.5;
    }

    /* Inline math styling */
    .katex-inline {
      padding: 0.2em 0.4em;
      margin: 0 0.2em;
      background: rgba(30, 41, 59, 0.05);
      border-radius: 0.25rem;
      display: inline-block;
    }

    .dark .katex-inline {
      background: rgba(255, 255, 255, 0.05);
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