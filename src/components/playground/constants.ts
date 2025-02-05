export const SUPPORTED_LANGUAGES = [
  {
    label: 'Runnable Languages',
    languages: [
      { value: 'javascript', label: 'JavaScript', extension: '.js', canRunInBrowser: true },
      { value: 'typescript', label: 'TypeScript', extension: '.ts', canRunInBrowser: true },
      { value: 'html', label: 'HTML', extension: '.html', canRunInBrowser: true },
    ]
  },
  {
    label: 'Other Languages',
    languages: [
      { value: 'python', label: 'Python', extension: '.py', canRunInBrowser: false },
      { value: 'java', label: 'Java', extension: '.java', canRunInBrowser: false },
      { value: 'csharp', label: 'C#', extension: '.cs', canRunInBrowser: false },
      { value: 'cpp', label: 'C++', extension: '.cpp', canRunInBrowser: false },
      { value: 'go', label: 'Go', extension: '.go', canRunInBrowser: false },
      { value: 'rust', label: 'Rust', extension: '.rs', canRunInBrowser: false },
      { value: 'ruby', label: 'Ruby', extension: '.rb', canRunInBrowser: false },
      { value: 'php', label: 'PHP', extension: '.php', canRunInBrowser: false },
      { value: 'sql', label: 'SQL', extension: '.sql', canRunInBrowser: false },
      { value: 'css', label: 'CSS', extension: '.css', canRunInBrowser: false },
      { value: 'json', label: 'JSON', extension: '.json', canRunInBrowser: false },
      { value: 'markdown', label: 'Markdown', extension: '.md', canRunInBrowser: false },
      { value: 'hcl', label: 'Terraform', extension: '.tf', canRunInBrowser: false },
      { value: 'bicep', label: 'Bicep', extension: '.bicep', canRunInBrowser: false },
      { value: 'powershell', label: 'PowerShell', extension: '.ps1', canRunInBrowser: false },
      { value: 'shell', label: 'Bash/Shell', extension: '.sh', canRunInBrowser: false },
    ]
  }
] as const;

// Helper function to find a language in the grouped structure
export const findLanguageInGroups = (value: string) => {
  for (const group of SUPPORTED_LANGUAGES) {
    const language = group.languages.find(lang => lang.value === value);
    if (language) return language;
  }
  return null;
};