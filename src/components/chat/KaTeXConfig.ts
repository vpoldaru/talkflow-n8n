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

    md.renderer.rules.fence = (tokens, idx, options, env, self) => {
      const token = tokens[idx];
      if (token.content.startsWith('$$') && token.content.endsWith('$$')) {
        const math = token.content.slice(2, -2).trim();
        return `<div class="katex-block">${math}</div>`;
      }
      return defaultRender(tokens, idx, options, env, self);
    };

    return md;
  });

  md.use(mk, {
    throwOnError: false,
    errorColor: ' #cc0000',
    delimiters: [
      { left: "$", right: "$", display: false }, // inline only
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