import React, { useState, useCallback } from "react";
import Cropper, { Area } from "react-easy-crop";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { RotateCw, ZoomIn, Check, X } from "lucide-react";
import { ImageData } from "@/types";

interface ImageEditorProps {
  imageData: ImageData | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (editedFile: File) => void;
}

export function ImageEditor({
  imageData,
  isOpen,
  onClose,
  onSave,
}: ImageEditorProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropComplete = useCallback(
    (_croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const createCroppedImage = async () => {
    if (!imageData || !croppedAreaPixels) return;

    try {
      const croppedImage = await getCroppedImg(
        imageData.url,
        croppedAreaPixels,
        rotation
      );
      // Create a new File object
      const file = new File([croppedImage], imageData.name, {
        type: imageData.file.type,
      });
      onSave(file);
    } catch (e) {
      console.error(e);
    }
  };

  if (!imageData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full h-[90vh] flex flex-col p-0 gap-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle>Edit Image</DialogTitle>
        </DialogHeader>

        <div className="flex-1 relative bg-black/5 min-h-[400px]">
          <Cropper
            image={imageData.url}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={undefined} // Free crop by default, could be added as prop
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onRotationChange={setRotation}
            onCropComplete={onCropComplete}
          />
        </div>

        <div className="p-6 bg-background border-t space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 min-w-[100px]">
              <ZoomIn className="w-4 h-4" />
              <span className="text-sm font-medium">Zoom</span>
            </div>
            <Slider
              value={[zoom]}
              min={1}
              max={3}
              step={0.1}
              onValueChange={(v) => setZoom(v[0])}
              className="flex-1"
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 min-w-[100px]">
              <RotateCw className="w-4 h-4" />
              <span className="text-sm font-medium">Rotate</span>
            </div>
            <Slider
              value={[rotation]}
              min={0}
              max={360}
              step={1}
              onValueChange={(v) => setRotation(v[0])}
              className="flex-1"
            />
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={onClose}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={createCroppedImage}>
              <Check className="w-4 h-4 mr-2" />
              Apply Changes
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Utility to crop image
async function getCroppedImg(
  imageSrc: string,
  pixelCrop: Area,
  rotation = 0
): Promise<Blob> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("No 2d context");
  }

  const maxSize = Math.max(image.width, image.height);
  const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2));

  // set each dimensions to double largest dimension to allow for a safe area for the
  // image to rotate in without being clipped by canvas context
  canvas.width = safeArea;
  canvas.height = safeArea;

  // translate canvas context to a central location on image to allow rotating around the center.
  ctx.translate(safeArea / 2, safeArea / 2);
  ctx.rotate((rotation * Math.PI) / 180);
  ctx.translate(-safeArea / 2, -safeArea / 2);

  // draw rotated image and store data.
  ctx.drawImage(
    image,
    safeArea / 2 - image.width * 0.5,
    safeArea / 2 - image.height * 0.5
  );

  const data = ctx.getImageData(0, 0, safeArea, safeArea);

  // set canvas width to final desired crop size - this will clear existing context
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  // paste generated rotate image with correct offsets for x,y crop values.
  ctx.putImageData(
    data,
    Math.round(0 - safeArea / 2 + image.width * 0.5 - pixelCrop.x),
    Math.round(0 - safeArea / 2 + image.height * 0.5 - pixelCrop.y)
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Canvas is empty"));
    }, "image/png"); // Always work in PNG for high quality intermediate
  });
}

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  });
}
