/**
 * Compress an image file client-side before upload.
 * Reduces file size by resizing and adjusting JPEG quality.
 */
export async function compressImage(
  file: File,
  maxWidth = 1600,
  maxHeight = 2000,
  quality = 0.8
): Promise<File> {
  // Skip non-image files or SVGs
  if (!file.type.startsWith("image/") || file.type === "image/svg+xml") {
    return file;
  }

  // Skip small files (< 200KB)
  if (file.size < 200 * 1024) {
    return file;
  }

  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      let { width, height } = img;

      // Calculate new dimensions while maintaining aspect ratio
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(file);
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob || blob.size >= file.size) {
            // If compression made it bigger, return original
            resolve(file);
            return;
          }

          const compressedFile = new File([blob], file.name, {
            type: "image/jpeg",
            lastModified: Date.now(),
          });
          resolve(compressedFile);
        },
        "image/jpeg",
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(file);
    };

    img.src = url;
  });
}
