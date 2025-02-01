import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Play, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface CodePlaygroundProps {
  defaultLanguage?: string;
  defaultValue?: string;
}

const SUPPORTED_LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'csharp', label: 'C#' },
  { value: 'cpp', label: 'C++' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'php', label: 'PHP' },
  { value: 'sql', label: 'SQL' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'json', label: 'JSON' },
  { value: 'markdown', label: 'Markdown' },
  { value: 'bicep', label: 'Bicep' },
  { value: 'terraform', label: 'Terraform' },
  { value: 'powershell', label: 'PowerShell' },
  { value: 'shell', label: 'Bash/Shell' },
];

const CodePlayground: React.FC<CodePlaygroundProps> = ({
  defaultLanguage = 'javascript',
  defaultValue = '// Write your code here\nconsole.log("Hello, World!");',
}) => {
  const [code, setCode] = useState(defaultValue);
  const [language, setLanguage] = useState(defaultLanguage);
  const { toast } = useToast();

  useEffect(() => {
    const savedCode = localStorage.getItem('playground-code');
    if (savedCode) {
      setCode(savedCode);
      localStorage.removeItem('playground-code');
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

  const handleRun = () => {
    try {
      if (language === 'javascript') {
        const result = new Function(code)();
        console.log('Code execution result:', result);
        toast({
          title: "Success",
          description: "Code executed successfully! Check the console for output.",
        });
      } else {
        toast({
          title: "Info",
          description: `Running ${language} code is not supported in the browser. This is a preview-only mode.`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to execute code",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-5xl mx-auto bg-card shadow-lg">
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
          <div className="space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="hover:bg-accent"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleRun}
              className="bg-primary hover:bg-primary/90"
            >
              <Play className="w-4 h-4 mr-2" />
              Run
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="rounded-md overflow-hidden border border-border/20">
          <Editor
            height="500px"
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
      </CardContent>
    </Card>
  );
};

export default CodePlayground;