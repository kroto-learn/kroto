import compress from "compress-base64";

const fileToBase64: (file: Blob) => Promise<string | null> = (file: Blob) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      if (reader.result) {
        const compressedB64 = await compress(reader.result as string, {
          width: 400,
          type: "image/png", // default
          max: 250, // max size
          min: 25, // min size
          quality: 0.8,
        });

        if (compressedB64) resolve(compressedB64 as string);
      }
    };
    reader.onerror = (error) => reject(error);
  });

export default fileToBase64;
