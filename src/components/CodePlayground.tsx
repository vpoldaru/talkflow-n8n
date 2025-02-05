import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Copy, Download, Play, Maximize2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ResizablePanel, ResizablePanelGroup } from './ui/resizable';
import { executeJavaScript, executeHTML } from '@/utils/codeExecutor';

interface CodePlaygroundProps {
  defaultLanguage?: string;
  defaultValue?: string;
}

const SUPPORTED_LANGUAGES = [
  { value: 'javascript', label: 'JavaScript', extension: '.js' },
  { value: 'typescript', label: 'TypeScript', extension: '.ts' },
  { value: 'python', label: 'Python', extension: '.py' },
  { value: 'java', label: 'Java', extension: '.java' },
  { value: 'csharp', label: 'C#', extension: '.cs' },
  { value: 'cpp', label: 'C++', extension: '.cpp' },
  { value: 'go', label: 'Go', extension: '.go' },
  { value: 'rust', label: 'Rust', extension: '.rs' },
  { value: 'ruby', label: 'Ruby', extension: '.rb' },
  { value: 'php', label: 'PHP', extension: '.php' },
  { value: 'sql', label: 'SQL', extension: '.sql' },
  { value: 'html', label: 'HTML', extension: '.html' },
  { value: 'css', label: 'CSS', extension: '.css' },
  { value: 'json', label: 'JSON', extension: '.json' },
  { value: 'markdown', label: 'Markdown', extension: '.md' },
  { value: 'hcl', label: 'Terraform', extension: '.tf' },
  { value: 'bicep', label: 'Bicep', extension: '.bicep' },
  { value: 'powershell', label: 'PowerShell', extension: '.ps1' },
  { value: 'shell', label: 'Bash/Shell', extension: '.sh' },
];

const CodePlayground: React.FC<CodePlaygroundProps> = ({
  defaultLanguage = 'javascript',
  defaultValue = '// Write your code here\nconsole.log("Hello, World!");',
}) => {
  const [code, setCode] = useState(defaultValue);
  const [language, setLanguage] = useState(defaultLanguage);
  const [output, setOutput] = useState<string>('');
  const [isOutputPopped, setIsOutputPopped] = useState(false);
  const { toast } = useToast();
  const outputRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLDivElement>(null);
  const popoutWindowRef = useRef<Window | null>(null);

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

  useEffect(() => {
    // Update popped out window content when output changes
    if (popoutWindowRef.current && !popoutWindowRef.current.closed) {
      const doc = popoutWindowRef.current.document;
      const outputElement = doc.getElementById('output');
      if (outputElement) {
        if (language === 'html') {
          // For HTML, create and append an iframe
          const iframe = executeHTML(code);
          outputElement.innerHTML = '';
          outputElement.appendChild(iframe);
        } else {
          // For other languages, display the output text
          outputElement.innerHTML = `<pre class="whitespace-pre-wrap font-mono p-4">${output}</pre>`;
        }
      }
    }
  }, [output, language, code]);

  const handlePopOutput = () => {
    if (isOutputPopped && popoutWindowRef.current && !popoutWindowRef.current.closed) {
      popoutWindowRef.current.close();
      setIsOutputPopped(false);
      return;
    }

    const popoutWindow = window.open('', 'CodeOutput', 'width=600,height=400,resizable=yes');
    if (popoutWindow) {
      popoutWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Code Output</title>
            <style>
              body { 
                margin: 0;
                padding: 0;
                background: #1e1e1e;
                color: #fff;
                font-family: monospace;
              }
              #output {
                height: 100vh;
                width: 100%;
              }
              #output iframe {
                width: 100%;
                height: 100%;
                border: none;
                background: white;
              }
              pre {
                margin: 0;
                padding: 1rem;
                white-space: pre-wrap;
                word-wrap: break-word;
              }
            </style>
          </head>
          <body>
            <div id="output">
              ${language === 'html' 
                ? ''  // Will be populated by the useEffect
                : `<pre class="whitespace-pre-wrap font-mono p-4">${output}</pre>`}
            </div>
          </body>
        </html>
      `);
      popoutWindow.document.close();
      popoutWindowRef.current = popoutWindow;
      setIsOutputPopped(true);

      // If it's HTML, immediately execute and display it
      if (language === 'html') {
        const iframe = executeHTML(code);
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
        <CardTitle className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="text-xl font-semibold text-card-foreground">Code Playground</span>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRun}
              className="hover:bg-accent"
            >
              <Play className="w-4 h-4 mr-2" />
              Run
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handlePopOutput}
              className="hover:bg-accent"
            >
              <Maximize2 className="w-4 h-4 mr-2" />
              {isOutputPopped ? 'Close Output' : 'Pop Output'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSaveToFile}
              className="hover:bg-accent"
            >
              <Download className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="hover:bg-accent"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy
            </Button>
          </div>
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
              <div className="h-full flex flex-col">
                {language === 'html' ? (
                  <div ref={iframeRef} className="w-full h-full bg-white" />
                ) : (
                  <div ref={outputRef} className="w-full h-full p-4 font-mono text-sm overflow-auto bg-black text-white">
                    {output}
                  </div>
                )}
              </div>
            </ResizablePanel>
          )}
        </ResizablePanelGroup>
      </CardContent>
    </Card>
  );
};

export default CodePlayground;