export interface ImageData {
  file: File;
  url: string;
  width: number;
  height: number;
  size: number; // in KB
  name: string;
  dpi?: number;
}

export interface ProcessingRequirements {
  minSize: number; // in KB
  maxSize: number; // in KB
  width: number; // in pixels
  height: number; // in pixels
  dpi: number;
  format: "jpg" | "png";
}

export interface ProcessingResult {
  success: boolean;
  message: string;
  data?: ImageData;
  error?: string;
}
