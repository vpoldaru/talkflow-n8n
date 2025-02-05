// Web Worker for executing JavaScript/TypeScript code
export const executeJavaScript = (code: string): Promise<{ result?: any; error?: string }> => {
  return new Promise((resolve) => {
    const worker = new Worker(
      URL.createObjectURL(
        new Blob([`
          self.onmessage = function(e) {
            try {
              const result = eval(e.data);
              self.postMessage({ result });
            } catch (error) {
              self.postMessage({ error: error.message });
            }
          }
        `], { type: 'application/javascript' })
      )
    );

    worker.onmessage = (e) => {
      worker.terminate();
      resolve(e.data);
    };

    worker.onerror = (error) => {
      worker.terminate();
      resolve({ error: error.message });
    };

    worker.postMessage(code);
  });
};

// Execute HTML in a sandboxed iframe
export const executeHTML = (code: string): HTMLIFrameElement => {
  const iframe = document.createElement('iframe');
  iframe.sandbox.add('allow-scripts');
  iframe.srcdoc = code;
  iframe.className = 'w-full h-full border-0';
  return iframe;
};