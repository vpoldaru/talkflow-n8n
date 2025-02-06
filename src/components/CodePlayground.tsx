
import React, { useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Card, CardContent, CardHeader } from './ui/card';
import { ResizablePanel, ResizablePanelGroup, ResizableHandle } from './ui/resizable';
import { SUPPORTED_LANGUAGES } from './playground/constants';
import { EditorHeader } from './playground/EditorHeader';
import { PlaygroundOutput } from './playground/PlaygroundOutput';
import { usePopoutWindow } from '@/hooks/usePopoutWindow';
import { GithubBrowser } from './playground/GithubBrowser';
import { useEditor } from '@/hooks/useEditor';
import { useCodeExecution } from '@/hooks/useCodeExecution';
import { useResizable } from '@/hooks/useResizable';

interface CodePlaygroundProps {
  defaultLanguage?: string;
  defaultValue?: string;
}

const CodePlayground: React.FC<CodePlaygroundProps> = ({
  defaultLanguage = 'javascript',
  defaultValue = '// Write your code here\nconsole.log("Hello, World!");',
}) => {
  const [isOutputPopped, setIsOutputPopped] = React.useState(false);
  const [showGithubBrowser, setShowGithubBrowser] = React.useState(false);
  const outputRef = useRef<HTMLDivElement>(null);

  const { code, setCode, language, setLanguage, handleFileSelect } = useEditor(defaultLanguage, defaultValue);
  const { output, iframeRef, handleRun } = useCodeExecution();
  const { handleResize, resizeTimeoutRef } = useResizable();

  const currentLanguage = SUPPORTED_LANGUAGES.find(lang => lang.value === language);
  const canRunInBrowser = currentLanguage?.canRunInBrowser ?? false;

  const { handlePopOutput } = usePopoutWindow(
    isOutputPopped,
    setIsOutputPopped,
    language,
    code,
    output
  );

  useEffect(() => {
    return () => {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, []);

  return (
    <Card className="w-full h-[90vh] mx-auto bg-card shadow-lg">
      <CardHeader className="border-b border-border/20">
        <EditorHeader
          language={language}
          setLanguage={setLanguage}
          code={code}
          onRun={() => handleRun(code, language)}
          onPopOutput={handlePopOutput}
          isOutputPopped={isOutputPopped}
          showGithubBrowser={showGithubBrowser}
          onToggleGithubBrowser={() => setShowGithubBrowser(!showGithubBrowser)}
        />
      </CardHeader>
      <CardContent className="p-4 pb-8 h-[calc(90vh-5rem)]">
        <ResizablePanelGroup 
          direction="horizontal" 
          className="h-full rounded-md border"
          onLayout={handleResize}
          id="playground-panels"
        >
          {showGithubBrowser && (
            <>
              <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
                <GithubBrowser onFileSelect={handleFileSelect} />
              </ResizablePanel>
              <ResizableHandle withHandle />
            </>
          )}
          <ResizablePanel defaultSize={showGithubBrowser ? 80 : 100}>
            <ResizablePanelGroup direction="vertical">
              <ResizablePanel 
                defaultSize={canRunInBrowser && !isOutputPopped ? 60 : 100}
                id="editor-panel"
                order={1}
              >
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
              {canRunInBrowser && !isOutputPopped && (
                <>
                  <ResizableHandle withHandle />
                  <ResizablePanel 
                    defaultSize={40}
                    id="output-panel"
                    order={2}
                  >
                    <div className="h-full flex flex-col">
                      <PlaygroundOutput
                        language={language}
                        output={output}
                        code={code}
                        iframeRef={iframeRef}
                        outputRef={outputRef}
                      />
                    </div>
                  </ResizablePanel>
                </>
              )}
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </CardContent>
    </Card>
  );
};

export default CodePlayground;
