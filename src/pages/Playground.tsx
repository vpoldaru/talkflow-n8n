import React from 'react';
import CodePlayground from '@/components/CodePlayground';

const Playground = () => {
  return (
    <div className="min-h-screen bg-background p-6 md:p-8 lg:p-10">
      <div className="max-w-5xl mx-auto space-y-6">
        <h1 className="text-4xl font-bold text-foreground tracking-tight">Code Playground</h1>
        <p className="text-muted-foreground text-lg">Write, test, and run your code in real-time.</p>
        <CodePlayground />
      </div>
    </div>
  );
};

export default Playground;