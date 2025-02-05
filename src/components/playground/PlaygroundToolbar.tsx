import React from 'react';
import { Button } from '../ui/button';
import { Copy, Download, Play, Maximize2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { SUPPORTED_LANGUAGES } from './constants';

interface PlaygroundToolbarProps {
  language: string;
  onLanguageChange: (value: string) => void;
  onRun: () => void;
  onPopOutput: () => void;
  onSaveToFile: () => void;
  onCopy: () => void;
  isOutputPopped: boolean;
}

export const PlaygroundToolbar: React.FC<PlaygroundToolbarProps> = ({
  language,
  onLanguageChange,
  onRun,
  onPopOutput,
  onSaveToFile,
  onCopy,
  isOutputPopped,
}) => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-4">
        <span className="text-xl font-semibold text-card-foreground">Code Playground</span>
        <Select value={language} onValueChange={onLanguageChange}>
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
          onClick={onRun}
          className="hover:bg-accent"
        >
          <Play className="w-4 h-4 mr-2" />
          Run
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onPopOutput}
          className="hover:bg-accent"
        >
          <Maximize2 className="w-4 h-4 mr-2" />
          {isOutputPopped ? 'Close Output' : 'Pop Output'}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onSaveToFile}
          className="hover:bg-accent"
        >
          <Download className="w-4 h-4 mr-2" />
          Save
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onCopy}
          className="hover:bg-accent"
        >
          <Copy className="w-4 h-4 mr-2" />
          Copy
        </Button>
      </div>
    </div>
  );
};