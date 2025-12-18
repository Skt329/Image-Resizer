import { ImageData, ProcessingRequirements } from "@/types";

export class ImageProcessor {
  private worker: Worker | null = null;
  private pendingRequests: Map<
    string,
    { resolve: (value: Blob) => void; reject: (reason?: Error) => void }
  > = new Map();

  constructor() {
    if (typeof window !== "undefined") {
      this.worker = new Worker(new URL("../worker/image.worker.ts", import.meta.url));
      this.worker.onmessage = this.handleWorkerMessage.bind(this);
    }
  }

  private handleWorkerMessage(event: MessageEvent) {
    const { id, success, data, error } = event.data;
    const request = this.pendingRequests.get(id);

    if (request) {
      if (success) {
        request.resolve(data);
      } else {
        request.reject(new Error(error));
      }
      this.pendingRequests.delete(id);
    }
  }

  async processImage(
    imageData: ImageData,
    requirements: ProcessingRequirements
  ): Promise<ImageData> {
    if (!this.worker) {
      throw new Error("Worker not initialized");
    }

    const id = crypto.randomUUID();

    return new Promise((resolve, reject) => {
      this.pendingRequests.set(id, {
        resolve: (processedBlob: Blob) => {
           const finalImageData: ImageData = {
            file: new File([processedBlob], `processed_${imageData.name}`, {
              type: `image/${requirements.format}`,
            }),
            url: URL.createObjectURL(processedBlob),
            width: requirements.width,
            height: requirements.height,
            size: processedBlob.size / 1024,
            name: `processed_${imageData.name}`,
            dpi: requirements.dpi,
          };
          resolve(finalImageData);
        },
        reject,
      });

      this.worker!.postMessage({
        id,
        type: "process",
        data: {
          file: imageData.file,
          requirements,
        },
      });
    });
  }

  // Utility method to get image info (kept on main thread as it is fast and needs Image object)
  async getImageInfo(file: File): Promise<{
    width: number;
    height: number;
    size: number;
    dpi?: number;
  }> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        // Try to detect DPI from image metadata
        let detectedDPI = 72; // Default DPI for web images
        
        if (img.naturalWidth > 2000 || img.naturalHeight > 2000) {
          detectedDPI = 300;
        } else if (img.naturalWidth > 1000 || img.naturalHeight > 1000) {
          detectedDPI = 150;
        } else {
          detectedDPI = 72;
        }
        
        resolve({
          width: img.naturalWidth,
          height: img.naturalHeight,
          size: file.size / 1024,
          dpi: detectedDPI,
        });
      };
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = URL.createObjectURL(file);
    });
  }
}
