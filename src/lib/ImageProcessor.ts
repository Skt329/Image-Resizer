import imageCompression from "browser-image-compression";
import Pica from "pica";
import { ImageData, ProcessingRequirements } from "@/types";

export class ImageProcessor {
  private pica: any; // eslint-disable-line @typescript-eslint/no-explicit-any

  constructor() {
    this.pica = new Pica();
  }

  async processImage(
    imageData: ImageData,
    requirements: ProcessingRequirements
  ): Promise<ImageData> {
    try {
      // Step 1: Resize image to target dimensions
      const resizedCanvas = await this.resizeImage(
        imageData.url,
        requirements.width,
        requirements.height
      );

      // Step 2: Adjust DPI if specified
      const dpiAdjustedCanvas = await this.adjustDPI(
        resizedCanvas,
        requirements.dpi
      );

      // Step 3: Compress to meet file size requirements
      const compressedBlob = await this.compressImage(
        dpiAdjustedCanvas,
        requirements.minSize,
        requirements.maxSize,
        requirements.format
      );

      // Step 4: Create final image data
      const finalImageData: ImageData = {
        file: new File([compressedBlob], `processed_${imageData.name}`, {
          type: `image/${requirements.format}`,
        }),
        url: URL.createObjectURL(compressedBlob),
        width: requirements.width,
        height: requirements.height,
        size: compressedBlob.size / 1024,
        name: `processed_${imageData.name}`,
        dpi: requirements.dpi,
      };

      return finalImageData;
    } catch (error) {
      throw new Error(`Image processing failed: ${error}`);
    }
  }

  private async resizeImage(
    imageUrl: string,
    targetWidth: number,
    targetHeight: number
  ): Promise<HTMLCanvasElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      
      img.onload = async () => {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = targetWidth;
          canvas.height = targetHeight;

          // Use Pica for high-quality resizing
          const resizedCanvas = await this.pica.resize(img, canvas, {
            quality: 3,
            alpha: true,
          });

          resolve(resizedCanvas);
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = imageUrl;
    });
  }

  private async adjustDPI(
    canvas: HTMLCanvasElement,
    targetDPI: number
  ): Promise<HTMLCanvasElement> {
    const currentDPI = 96; // Standard screen DPI
    const scale = targetDPI / currentDPI;

    if (Math.abs(scale - 1) < 0.01) {
      return canvas; // No adjustment needed
    }

    const newCanvas = document.createElement("canvas");
    newCanvas.width = canvas.width * scale;
    newCanvas.height = canvas.height * scale;

    const ctx = newCanvas.getContext("2d");
    if (!ctx) throw new Error("Failed to get canvas context");

    // Set high quality rendering
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    // Draw the resized image
    ctx.drawImage(canvas, 0, 0, newCanvas.width, newCanvas.height);

    return newCanvas;
  }

  private async compressImage(
    canvas: HTMLCanvasElement,
    minSize: number,
    maxSize: number,
    format: "jpg" | "png"
  ): Promise<Blob> {
    const maxSizeBytes = maxSize * 1024;

    // Convert canvas to blob
    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else throw new Error("Failed to create blob");
        },
        `image/${format}`,
        0.9 // Start with high quality
      );
    });

    // If already within size range, return as is
    if (blob.size <= maxSizeBytes) {
      return blob;
    }

    // Use browser-image-compression for size reduction
    const compressionOptions = {
      maxSizeMB: maxSize / 1024,
      maxWidthOrHeight: Math.max(canvas.width, canvas.height),
      useWebWorker: true,
      fileType: format === "jpg" ? "image/jpeg" : "image/png",
    };

    try {
      // Convert blob to file for imageCompression
      const file = new File([blob], 'image', { type: blob.type });
      const compressedBlob = await imageCompression(file, compressionOptions);
      
      // Verify the compressed size is within range
      if (compressedBlob.size > maxSizeBytes) {
        throw new Error(
          `Unable to compress image to required size. Best achieved: ${(
            compressedBlob.size / 1024
          ).toFixed(1)} KB`
        );
      }

      return compressedBlob;
    } catch (error) {
      throw new Error(`Compression failed: ${error}`);
    }
  }

  // Utility method to get image info
  async getImageInfo(file: File): Promise<{
    width: number;
    height: number;
    size: number;
    dpi?: number;
  }> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        resolve({
          width: img.naturalWidth,
          height: img.naturalHeight,
          size: file.size / 1024,
        });
      };
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = URL.createObjectURL(file);
    });
  }
}
