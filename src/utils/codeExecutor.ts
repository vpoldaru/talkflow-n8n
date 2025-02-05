// Web Worker for executing JavaScript/TypeScript code
export const executeJavaScript = (code: string): Promise<{ result?: any; error?: string; logs?: string[] }> => {
  return new Promise((resolve) => {
    const worker = new Worker(
      URL.createObjectURL(
        new Blob([`
          const logs = [];
          const originalConsole = {
            log: console.log,
            error: console.error,
            warn: console.warn,
            info: console.info
          };

          // Override console methods to capture logs
          console.log = (...args) => {
            logs.push(args.map(arg => 
              typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
            ).join(' '));
          };
          console.error = (...args) => {
            logs.push('Error: ' + args.map(arg => 
              typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
            ).join(' '));
          };
          console.warn = (...args) => {
            logs.push('Warning: ' + args.map(arg => 
              typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
            ).join(' '));
          };
          console.info = (...args) => {
            logs.push('Info: ' + args.map(arg => 
              typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
            ).join(' '));
          };

          self.onmessage = function(e) {
            try {
              const result = eval(e.data);
              self.postMessage({ 
                result: result === undefined ? undefined : 
                  typeof result === 'object' ? JSON.stringify(result, null, 2) : String(result),
                logs 
              });
            } catch (error) {
              self.postMessage({ error: error.message, logs });
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

// Execute Python code using Pyodide
export const executePython = async (code: string): Promise<{ result?: any; error?: string; logs?: string[] }> => {
  try {
    // Load Pyodide if not already loaded
    if (!(window as any).loadPyodide) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js';
      document.head.appendChild(script);
      await new Promise((resolve) => script.onload = resolve);
    }

    if (!(window as any).pyodide) {
      (window as any).pyodide = await (window as any).loadPyodide();
    }

    const pyodide = (window as any).pyodide;
    
    // Capture Python stdout/stderr
    const logs: string[] = [];
    pyodide.setStdout({
      write: (text: string) => {
        logs.push(text);
      },
    });

    // Execute the Python code
    const result = await pyodide.runPythonAsync(code);
    return {
      result: result?.toString(),
      logs,
    };
  } catch (error: any) {
    return {
      error: error.message,
      logs: [],
    };
  }
};
