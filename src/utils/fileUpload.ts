export const createFormDataWithFile = (input: string, sessionId: string, file?: File) => {
  const formData = new FormData();
  formData.append('chatInput', input);
  formData.append('sessionId', sessionId);
  if (file) {
    formData.append('file', file);
  }
  return formData;
};