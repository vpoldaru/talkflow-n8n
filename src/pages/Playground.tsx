import React from 'react';
import CodePlayground from '@/components/CodePlayground';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Playground = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-screen flex flex-col bg-background">
      <div className="flex items-center justify-between p-4 border-b border-border/20">
        <div>
          <h1 className="text-4xl font-bold text-foreground tracking-tight">Code Playground</h1>
        </div>
        <Button
          variant="outline"
          onClick={() => navigate('/')}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Chat
        </Button>
      </div>
      <div className="flex-1 overflow-hidden">
        <CodePlayground />
      </div>
    </div>
  );
};

export default Playground;