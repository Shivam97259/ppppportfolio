export interface CompressImageOptions {
  maxDimension?: number;
  quality?: number;
  maxKBLimit?: number;
}

export interface CompressResult {
  dataUrl: string;
  sizeKB: number;
  width: number;
  height: number;
  warning?: string;
}

export async function compressImageFile(
  file: File,
  options: CompressImageOptions = {}
): Promise<CompressResult> {
  const { maxDimension = 800, quality = 0.7, maxKBLimit = 200 } = options;

  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Selected file is not a valid image format.'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Resize proportional to maxDimension
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to obtain HTML5 Canvas context.'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Export WebP or JPEG with quality 0.7
        let dataUrl = canvas.toDataURL('image/webp', quality);
        if (!dataUrl.startsWith('data:image/webp')) {
          dataUrl = canvas.toDataURL('image/jpeg', quality);
        }

        const sizeKB = Math.round((dataUrl.length * 3) / 4 / 1024);

        let warning: string | undefined;
        if (sizeKB > maxKBLimit) {
          warning = `Compressed size (${sizeKB} KB) exceeds the recommended ${maxKBLimit} KB limit. For optimal performance, use a Direct URL.`;
        }

        resolve({ dataUrl, sizeKB, width, height, warning });
      };

      img.onerror = () => reject(new Error('Failed to load image file.'));
      img.src = e.target?.result as string;
    };

    reader.onerror = () => reject(new Error('Error reading image file.'));
    reader.readAsDataURL(file);
  });
}
