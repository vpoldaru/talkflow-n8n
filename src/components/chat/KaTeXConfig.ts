import MarkdownIt from 'markdown-it';
import mk from 'markdown-it-katex';

export const createMarkdownRenderer = () => {
  const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
    breaks: true
  });

  // Custom renderer for block math
  md.use((md) => {
    const defaultRender = md.renderer.rules.fence || ((tokens, idx, options, env, self) => {
      return self.renderToken(tokens, idx, options);
    });

    // Handle block math
    const renderBlockMath = (content: string) => {
      return `<div class="code-block-latex">
        <div class="code-block-header">
          <span class="text-xs text-slate-400">LaTeX</span>
        </div>
        <div class="code-block-content">
          ${content}
        </div>
      </div>`;
    };

    md.renderer.rules.fence = (tokens, idx, options, env, self) => {
      const token = tokens[idx];
      const content = token.content.trim();
      
      // Check if content is wrapped in $$ and handle as block math
      if (content.startsWith('$$') && content.endsWith('$$')) {
        const math = content.slice(2, -2).trim();
        return renderBlockMath(math);
      }
      
      return defaultRender(tokens, idx, options, env, self);
    };

    // Handle inline math with custom renderer
    md.renderer.rules.text = (tokens, idx) => {
      const text = tokens[idx].content;
      const parts = text.split(/(\$[^\$]+\$)/g);
      
      return parts.map(part => {
        if (part.startsWith('$') && part.endsWith('$')) {
          const math = part.slice(1, -1);
          return `<span class="katex-inline">${math}</span>`;
        }
        return part;
      }).join('');
    };

    return md;
  });

  md.use(mk, {
    throwOnError: false,
    errorColor: '#cc0000',
    delimiters: [
      { left: "$", right: "$", display: false }
    ],
    macros: {
      "\\RR": "\\mathbb{R}"
    }
  });

  // Custom renderer rules
  md.renderer.rules.paragraph_open = () => '<p class="mb-4 last:mb-0 leading-relaxed text-left">';
  
  md.renderer.rules.heading_open = (tokens, idx) => {
    const level = tokens[idx].tag;
    const classes = {
      h1: 'text-2xl font-bold mb-4 mt-6',
      h2: 'text-xl font-bold mb-3 mt-5',
      h3: 'text-lg font-bold mb-2 mt-4',
      h4: 'text-base font-bold mb-2 mt-3',
      h5: 'text-sm font-bold mb-2 mt-2',
      h6: 'text-xs font-bold mb-2 mt-2'
    }[level] || '';
    
    return `<${level} class="${classes} text-left">`;
  };

  return md;
};