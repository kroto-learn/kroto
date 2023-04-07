const fileToBase64: (file: Blob) => Promise<string | null> = (file: Blob) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (reader.result) resolve(reader.result as string);
    };
    reader.onerror = (error) => reject(error);
  });

export default fileToBase64;
