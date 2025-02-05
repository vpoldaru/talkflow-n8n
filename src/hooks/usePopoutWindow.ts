import { useRef, useState } from 'react';
import { executeHTML } from '@/utils/codeExecutor';

export const usePopoutWindow = (code: string, language: string, output: string) => {
  const [isOutputPopped, setIsOutputPopped] = useState(false);
  const popoutWindowRef = useRef<Window | null>(null);

  const handlePopOutput = () => {
    if (isOutputPopped && popoutWindowRef.current && !popoutWindowRef.current.closed) {
      popoutWindowRef.current.close();
      setIsOutputPopped(false);
      return;
    }

    const isDark = document.documentElement.classList.contains('dark');
    const popoutWindow = window.open('', 'CodeOutput', 'width=600,height=400,resizable=yes');
    
    if (popoutWindow) {
      popoutWindow.document.write(`
        <!DOCTYPE html>
        <html class="${isDark ? 'dark' : ''}">
          <head>
            <title>Code Output</title>
            <style>
              body { 
                margin: 0;
                padding: 0;
                font-family: monospace;
              }
              body.dark {
                background: hsl(var(--background));
                color: hsl(var(--foreground));
              }
              body:not(.dark) {
                background: #ffffff;
                color: #000000;
              }
              #output {
                height: 100vh;
                width: 100%;
              }
              #output iframe {
                width: 100%;
                height: 100%;
                border: none;
                color: inherit;
              }
              #output iframe.dark-iframe {
                background: hsl(var(--background));
                color: hsl(var(--foreground));
              }
              #output iframe:not(.dark-iframe) {
                background: #ffffff;
                color: #000000;
              }
              pre {
                margin: 0;
                padding: 1rem;
                white-space: pre-wrap;
                word-wrap: break-word;
                color: inherit;
              }
            </style>
            <style>
              :root {
                --background: 222.2 84% 4.9%;
                --foreground: 210 40% 98%;
              }
            </style>
          </head>
          <body class="${isDark ? 'dark' : ''}">
            <div id="output">
              ${language === 'html' 
                ? ''  // Will be populated later
                : `<pre class="whitespace-pre-wrap font-mono p-4 ${isDark ? 'text-foreground' : 'text-black'}">${output}</pre>`}
            </div>
          </body>
        </html>
      `);
      
      popoutWindow.document.close();
      popoutWindowRef.current = popoutWindow;
      setIsOutputPopped(true);

      if (language === 'html') {
        const iframe = executeHTML(code);
        const outputElement = popoutWindow.document.getElementById('output');
        iframe.classList.toggle('dark-iframe', isDark);
        if (outputElement) {
          outputElement.innerHTML = '';
          outputElement.appendChild(iframe);
        }
      }

      popoutWindow.onbeforeunload = () => {
        setIsOutputPopped(false);
        return null;
      };
    }
  };

  return {
    isOutputPopped,
    popoutWindowRef,
    handlePopOutput,
  };
};