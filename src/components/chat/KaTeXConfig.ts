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

  // Apply KaTeX plugin with configuration
  md.use(mk, {
    throwOnError: false,
    errorColor: '#cc0000',
    delimiters: [
      { left: "$$", right: "$$", display: true },
      { left: "$", right: "$", display: false }
    ],
    macros: {
      "\\RR": "\\mathbb{R}"
    }
  });

  return md;
};