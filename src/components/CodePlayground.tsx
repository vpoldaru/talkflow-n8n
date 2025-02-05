import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useToast } from '@/hooks/use-toast';
import { ResizablePanel, ResizablePanelGroup } from './ui/resizable';
import { executeJavaScript, executeHTML } from '@/utils/codeExecutor';
import { PlaygroundToolbar } from './playground/PlaygroundToolbar';
import { PlaygroundOutput } from './playground/PlaygroundOutput';
import { usePopoutWindow } from '@/hooks/usePopoutWindow';
import { SUPPORTED_LANGUAGES } from './playground/constants';

interface CodePlaygroundProps {
  defaultLanguage?: string;
  defaultValue?: string;
}

const CodePlayground: React.FC<CodePlaygroundProps> = ({
  defaultLanguage = 'javascript',
  defaultValue = '// Write your code here\nconsole.log("Hello, World!");',
}) => {
  const [code, setCode] = useState(defaultValue);
  const [language, setLanguage] = useState(defaultLanguage);
  const [output, setOutput] = useState<string>('');
  const { toast } = useToast();
  const outputRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLDivElement>(null);
  
  const { isOutputPopped, handlePopOutput } = usePopoutWindow(code, language, output);

  useEffect(() => {
    const savedCode = localStorage.getItem('playground-code');
    const savedLanguage = localStorage.getItem('playground-language');
    
    if (savedCode) {
      setCode(savedCode);
      localStorage.removeItem('playground-code');
    }
    
    if (savedLanguage && SUPPORTED_LANGUAGES.some(lang => lang.value === savedLanguage)) {
      setLanguage(savedLanguage);
      localStorage.removeItem('playground-language');
    }
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      toast({
        title: "Copied!",
        description: "Code copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy code",
        variant: "destructive",
      });
    }
  };

  const handleSaveToFile = () => {
    try {
      const currentLang = SUPPORTED_LANGUAGES.find(lang => lang.value === language);
      const extension = currentLang?.extension || '.txt';
      const filename = `code${extension}`;
      
      const blob = new Blob([code], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        description: `File saved as ${filename}`,
      });
    } catch (err) {
      toast({
        description: "Failed to save file",
        variant: "destructive",
      });
    }
  };

  const handleRun = async () => {
    try {
      if (language === 'html') {
        if (iframeRef.current) {
          const iframe = executeHTML(code);
          iframeRef.current.innerHTML = '';
          iframeRef.current.appendChild(iframe);
        }
        return;
      }

      const { result, error, logs = [] } = await executeJavaScript(code);
      const outputText = [
        ...(logs.length > 0 ? logs : []),
        ...(result !== undefined ? [result] : []),
        ...(error ? [`Error: ${error}`] : [])
      ].join('\n');
      
      setOutput(outputText);
      
      toast({
        description: error ? "Execution failed" : "Code executed successfully",
        variant: error ? "destructive" : "default",
      });
    } catch (err) {
      toast({
        description: "Failed to execute code",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full h-[90vh] mx-auto bg-card shadow-lg">
      <CardHeader className="border-b border-border/20">
        <CardTitle>
          <PlaygroundToolbar
            language={language}
            onLanguageChange={setLanguage}
            onRun={handleRun}
            onPopOutput={handlePopOutput}
            onSaveToFile={handleSaveToFile}
            onCopy={handleCopy}
            isOutputPopped={isOutputPopped}
          />
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pb-8 h-[calc(90vh-5rem)]">
        <ResizablePanelGroup direction="vertical" className="h-full rounded-md border">
          <ResizablePanel defaultSize={isOutputPopped ? 100 : 60}>
            <div className="h-full">
              <Editor
                height="100%"
                language={language}
                value={code}
                onChange={(value) => setCode(value || '')}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  roundedSelection: false,
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  padding: { top: 16, bottom: 16 },
                  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                }}
              />
            </div>
          </ResizablePanel>
          {!isOutputPopped && (
            <ResizablePanel defaultSize={40}>
              <PlaygroundOutput
                language={language}
                output={output}
                iframeRef={iframeRef}
                outputRef={outputRef}
              />
            </ResizablePanel>
          )}
        </ResizablePanelGroup>
      </CardContent>
    </Card>
  );
};

export default CodePlayground;