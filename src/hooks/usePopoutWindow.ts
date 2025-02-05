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
                height: 100vh;
                background-color: ${isDark ? '#1a1a1a' : '#ffffff'};
                color: #ffffff;
              }
              
              #output {
                height: 100vh;
                width: 100%;
              }
              
              #output iframe {
                width: 100%;
                height: 100%;
                border: none;
                background-color: inherit;
                color: #ffffff;
              }
              
              pre {
                margin: 0;
                padding: 1rem;
                white-space: pre-wrap;
                word-wrap: break-word;
                height: 100%;
                box-sizing: border-box;
                background-color: inherit;
                color: #ffffff;
              }
            </style>
          </head>
          <body>
            <div id="output">
              ${language === 'html' 
                ? ''  // Will be populated later
                : `<pre>${output}</pre>`}
            </div>
          </body>
        </html>
      `);
      
      popoutWindow.document.close();
      popoutWindowRef.current = popoutWindow;
      setIsOutputPopped(true);

      if (language === 'html') {
        const iframe = executeHTML(code);
        iframe.style.backgroundColor = 'inherit';
        iframe.style.color = '#ffffff';
        const outputElement = popoutWindow.document.getElementById('output');
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