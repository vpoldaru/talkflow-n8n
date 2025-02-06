
import { useState, useEffect } from 'react';
import { SUPPORTED_LANGUAGES } from '@/components/playground/constants';

export const useEditor = (defaultLanguage: string = 'javascript', defaultValue: string = '// Write your code here\nconsole.log("Hello, World!");') => {
  const [code, setCode] = useState(defaultValue);
  const [language, setLanguage] = useState(defaultLanguage);

  useEffect(() => {
    const savedCode = localStorage.getItem('playground-code');
    const savedLanguage = localStorage.getItem('playground-language');
    
    if (savedCode) {
      setCode(savedCode);
      localStorage.removeItem('playground-code');
    }
    
    if (savedLanguage) {
      setLanguage(savedLanguage);
      localStorage.removeItem('playground-language');
    }
  }, []);

  const handleFileSelect = (content: string, fileName: string) => {
    setCode(content);
    const extension = `.${fileName.split('.').pop()?.toLowerCase()}`;
    const matchedLanguage = SUPPORTED_LANGUAGES.find(lang => 
      lang.extension === extension || 
      lang.additionalExtensions?.includes(extension)
    );
    if (matchedLanguage) {
      setLanguage(matchedLanguage.value);
    }
  };

  return {
    code,
    setCode,
    language,
    setLanguage,
    handleFileSelect
  };
};
