import React from 'react';

export const getCustomStyles = () => `
  <style>
    .katex { font-size: 1.1em; }
    .katex-display { 
      overflow: auto hidden;
      margin: 1em 0;
      padding: 1em;
      background: rgba(0, 0, 0, 0.03);
      border-radius: 0.375rem;
    }
    .katex-display > .katex { 
      white-space: normal;
      text-align: center;
    }
    /* Dark mode styles */
    .dark .katex { color: #e5e7eb; }
    .dark .katex-display { background: rgba(30, 41, 59, 0.5); }
    /* Additional styles for better visibility */
    .markdown-content { color: inherit; }
    .markdown-content p { margin-bottom: 1rem; }
    .markdown-content hr { margin: 1.5rem 0; }
    .markdown-content h3 { color: #1e293b; }
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