import piexif from "piexifjs";

/**
 * Inserts DPI metadata into a JPEG blob.
 * @param blob The input JPEG blob
 * @param dpi The target DPI
 * @returns A new Blob with the metadata
 */
export async function insertJpegMetadata(blob: Blob, dpi: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const result = e.target?.result;
        if (typeof result !== "string") {
          reject(new Error("Failed to read blob as data URL"));
          return;
        }

        const exifObj = piexif.load(result);

        if (!exifObj["0th"]) {
          exifObj["0th"] = {};
        }

        // 0th IFD: Resolution
        exifObj["0th"][piexif.ImageIFD.XResolution] = [dpi, 1];
        exifObj["0th"][piexif.ImageIFD.YResolution] = [dpi, 1];
        exifObj["0th"][piexif.ImageIFD.ResolutionUnit] = 2; // Inches

        const exifStr = piexif.dump(exifObj);
        const newJpeg = piexif.insert(exifStr, result);

        // Convert base64 back to Blob
        const byteString = atob(newJpeg.split(",")[1]);
        const mimeString = newJpeg.split(",")[0].split(":")[1].split(";")[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }

        resolve(new Blob([ab], { type: mimeString }));
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error("Failed to read blob"));
    reader.readAsDataURL(blob);
  });
}

/**
 * Inserts DPI metadata into a PNG blob by adding/updating the pHYs chunk.
 * @param blob The input PNG blob
 * @param dpi The target DPI
 * @returns A new Blob with the metadata
 */
export async function insertPngMetadata(blob: Blob, dpi: number): Promise<Blob> {
  const arrayBuffer = await blob.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);

  // Check PNG signature
  const signature = [137, 80, 78, 71, 13, 10, 26, 10];
  for (let i = 0; i < 8; i++) {
    if (uint8Array[i] !== signature[i]) {
      throw new Error("Invalid PNG signature");
    }
  }

  // Calculate pixels per meter (DPI / 0.0254)
  const ppm = Math.round(dpi / 0.0254);

  // Create pHYs chunk
  // Length (4 bytes), Type (4 bytes), Data (9 bytes), CRC (4 bytes)
  const physDataLength = 9;
  const physChunkLength = 4 + 4 + physDataLength + 4;
  const physChunk = new Uint8Array(physChunkLength);
  const view = new DataView(physChunk.buffer);

  // Length
  view.setUint32(0, physDataLength, false); // Big endian

  // Type: pHYs
  physChunk[4] = 112; // p
  physChunk[5] = 72;  // H
  physChunk[6] = 89;  // Y
  physChunk[7] = 115; // s

  // Data: X axis pixels per unit
  view.setUint32(8, ppm, false);
  // Data: Y axis pixels per unit
  view.setUint32(12, ppm, false);
  // Data: Unit specifier (1 = meter)
  physChunk[16] = 1;

  // CRC
  const crc = calculateCRC(physChunk.subarray(4, 4 + 4 + physDataLength));
  view.setUint32(17, crc, false);

  // Construct new PNG file
  // We need to insert pHYs before IDAT. Usually after IHDR.
  // We'll iterate chunks to find where to put it or replace existing pHYs.

  const chunks: Uint8Array[] = [];
  let pos = 8; // Skip signature
  let physFound = false;

  // Add signature
  chunks.push(uint8Array.subarray(0, 8));

  while (pos < uint8Array.length) {
    const length = new DataView(uint8Array.buffer).getUint32(pos, false);
    const type = String.fromCharCode(...uint8Array.subarray(pos + 4, pos + 8));
    const chunkTotalLength = length + 12; // Length(4) + Type(4) + Data(length) + CRC(4)

    if (type === "pHYs") {
      // Replace existing pHYs
      chunks.push(physChunk);
      physFound = true;
      pos += chunkTotalLength;
    } else if (type === "IDAT" && !physFound) {
      // Insert pHYs before first IDAT if not found yet
      chunks.push(physChunk);
      physFound = true;
      chunks.push(uint8Array.subarray(pos, pos + chunkTotalLength));
      pos += chunkTotalLength;
    } else if (type === "IEND" && !physFound) {
       // Insert pHYs before IEND if not found yet (unlikely for valid png but safe)
      chunks.push(physChunk);
      physFound = true;
      chunks.push(uint8Array.subarray(pos, pos + chunkTotalLength));
      pos += chunkTotalLength;
    } else {
      chunks.push(uint8Array.subarray(pos, pos + chunkTotalLength));
      pos += chunkTotalLength;
    }
  }

  // TypeScript quirk: Blob constructor expects BlobPart[], which allows ArrayBufferView.
  // Uint8Array is an ArrayBufferView, but some TS definitions might be strict about SharedArrayBuffer compatibility.
  // Casting to any[] or explicitly checking types helps.
  return new Blob(chunks as BlobPart[], { type: "image/png" });
}

// CRC Table
const crcTable: number[] = [];
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    if (c & 1) {
      c = 0xedb88320 ^ (c >>> 1);
    } else {
      c = c >>> 1;
    }
  }
  crcTable[n] = c;
}

function calculateCRC(buf: Uint8Array): number {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return c ^ 0xffffffff;
}
