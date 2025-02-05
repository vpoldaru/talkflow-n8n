import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Copy, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ResizablePanel, ResizablePanelGroup } from './ui/resizable';

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
  const { toast } = useToast();

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
      <CardContent className="p-4 h-[calc(90vh-5rem)]">
        <ResizablePanelGroup direction="vertical" className="h-full rounded-md border">
          <ResizablePanel defaultSize={100}>
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
        </ResizablePanelGroup>
      </CardContent>
    </Card>
  );
};

export default CodePlayground;