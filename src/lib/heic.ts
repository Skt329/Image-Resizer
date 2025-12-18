import heic2any from "heic2any";

/**
 * Converts a HEIC/HEIF file to a JPEG Blob.
 * If the file is not HEIC, it returns null.
 */
export async function convertHeicToBlob(file: File): Promise<Blob | null> {
  const isHeic =
    file.name.toLowerCase().endsWith(".heic") ||
    file.name.toLowerCase().endsWith(".heif") ||
    file.type === "image/heic" ||
    file.type === "image/heif";

  if (!isHeic) return null;

  try {
    const result = await heic2any({
      blob: file,
      toType: "image/jpeg",
      quality: 0.9,
    });

    // heic2any can return a single blob or an array of blobs.
    // For a single image file, we expect a single blob.
    if (Array.isArray(result)) {
      return result[0];
    }
    return result;
  } catch (error) {
    console.error("HEIC conversion failed:", error);
    throw new Error("Failed to convert HEIC image. Please try another format.");
  }
}
