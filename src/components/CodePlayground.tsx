import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Play, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CodePlaygroundProps {
  defaultLanguage?: string;
  defaultValue?: string;
}

const CodePlayground: React.FC<CodePlaygroundProps> = ({
  defaultLanguage = 'javascript',
  defaultValue = '// Write your code here\nconsole.log("Hello, World!");',
}) => {
  const [code, setCode] = useState(defaultValue);
  const { toast } = useToast();

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
      // Using Function constructor to create a new function from the code string
      const result = new Function(code)();
      console.log('Code execution result:', result);
      toast({
        title: "Success",
        description: "Code executed successfully! Check the console for output.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to execute code",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Code Playground</span>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleRun}
            >
              <Play className="w-4 h-4 mr-2" />
              Run
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="min-h-[400px] border rounded-md overflow-hidden">
          <Editor
            height="400px"
            defaultLanguage={defaultLanguage}
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
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default CodePlayground;