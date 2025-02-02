export const createFormDataWithFile = async (input: string, sessionId: string, file?: File) => {
  const formData = new FormData();
  formData.append("chatInput", input);
  formData.append("sessionId", sessionId);

  if (file) {
    const base64Data = await fileToBase64(file);
    formData.append("data", base64Data);
    formData.append("mimeType", file.type);
    formData.append("fileName", file.name);
  }

  return formData;
};

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = reader.result as string;
      // Remove the data URL prefix (e.g., "data:image/png;base64,")
      const base64Data = base64String.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = (error) => reject(error);
  });
};