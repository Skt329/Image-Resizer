import imageCompression from "browser-image-compression";
import Pica from "pica";
import { insertJpegMetadata, insertPngMetadata } from "../lib/metadata";

// Types need to be mirrored here or imported if we can configure tsconfig to allow it.
// Since this is a worker, safe to redefine or import types.
// We will try to import types first.

interface WorkerMessage {
  id: string;
  type: "process";
  data: {
    file: File;
    requirements: {
      width: number;
      height: number;
      dpi: number;
      format: "jpg" | "png";
      minSize: number;
      maxSize: number;
    };
  };
}

const pica = new Pica();

self.onmessage = async (e: MessageEvent<WorkerMessage>) => {
  const { id, type, data } = e.data;

  if (type !== "process") return;

  try {
    const { file, requirements } = data;

    // 1. Resize
    const img = await createImageBitmap(file);
    const canvas = new OffscreenCanvas(requirements.width, requirements.height);

    // Pica works with OffscreenCanvas
    await pica.resize(img, canvas as unknown as HTMLCanvasElement, {
      quality: 3,
      // alpha: true, // Removed as it is not in PicaResizeOptions
    });

    // 2. Compress & Convert Format
    // browser-image-compression works with File/Blob, so we convert canvas to blob first
    const blob = await canvas.convertToBlob({
      type: `image/${requirements.format === "jpg" ? "jpeg" : "png"}`,
      quality: 0.9,
    });

    // Compress
    const compressedBlob = await compressImage(
        blob,
        requirements.maxSize,
        requirements.format
    );

    // 3. Insert Metadata (DPI)
    let finalBlob = compressedBlob;
    if (requirements.format === "jpg") {
      finalBlob = await insertJpegMetadata(compressedBlob, requirements.dpi);
    } else {
      finalBlob = await insertPngMetadata(compressedBlob, requirements.dpi);
    }

    self.postMessage({
      id,
      success: true,
      data: finalBlob,
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Processing failed";
    self.postMessage({
      id,
      success: false,
      error: errorMessage,
    });
  }
};

async function compressImage(
  blob: Blob,
  maxSizeKB: number,
  format: "jpg" | "png"
): Promise<Blob> {
  const maxSizeBytes = maxSizeKB * 1024;
  if (blob.size <= maxSizeBytes) return blob;

  const options = {
    maxSizeMB: maxSizeKB / 1024,
    useWebWorker: false, // We are already in a worker
    fileType: format === "jpg" ? "image/jpeg" : "image/png",
  };

  try {
    const file = new File([blob], "temp", { type: blob.type });
    const compressed = await imageCompression(file, options);
    return compressed;
  } catch (e) {
    console.warn("Compression failed, returning original", e);
    return blob;
  }
}
