import MarkdownIt from 'markdown-it';
import mk from 'markdown-it-katex';

export const createMarkdownRenderer = () => {
  const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
    breaks: true
  });

  // Custom renderer for code blocks
  md.renderer.rules.fence = (tokens, idx, options, env, self) => {
    const token = tokens[idx];
    const content = token.content.trim();
    
    // Check if this is a LaTeX block
    if (content.startsWith('$$') && content.endsWith('$$')) {
      const math = content.slice(2, -2).trim();
      return `
        <div class="code-block-latex">
          <div class="code-block-header">LaTeX</div>
          <div class="code-block-content">${math}</div>
        </div>
      `;
    }
    
    // Regular code block
    return `<pre class="language-${token.info}"><code>${content}</code></pre>`;
  };

  // Configure KaTeX
  md.use(mk, {
    throwOnError: false,
    errorColor: '#cc0000',
    displayMode: true,
    delimiters: [
      { left: '$$', right: '$$', display: true },
      { left: '$', right: '$', display: false }
    ]
  });

  return md;
};