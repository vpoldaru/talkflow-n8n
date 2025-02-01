import React from 'react';
import CodePlayground from '@/components/CodePlayground';

const Playground = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Code Playground</h1>
      <CodePlayground />
    </div>
  );
};

export default Playground;