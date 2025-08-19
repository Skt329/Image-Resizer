"use client";

import { motion } from "framer-motion";
import { Settings, Ruler, FileText, Image as ImageIcon, Maximize2, Lock, Unlock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProcessingRequirements, ImageData } from "@/types";
import { useState } from "react";

interface RequirementsSectionProps {
  requirements: ProcessingRequirements;
  onRequirementsChange: (requirements: ProcessingRequirements) => void;
  imageData: ImageData;
}

export function RequirementsSection({
  requirements,
  onRequirementsChange,
  imageData,
}: RequirementsSectionProps) {
  const [unitMode, setUnitMode] = useState<"px" | "cm">("px");
  
  // Conversion constants (assuming 96 DPI for screen)
  const PIXELS_PER_CM = 37.7952755906; // 96 DPI / 2.54 cm/inch
  
  const handleChange = (field: keyof ProcessingRequirements, value: string | number | boolean) => {
    onRequirementsChange({
      ...requirements,
      [field]: value,
    });
  };
  
  // Convert pixels to centimeters
  const pixelsToCm = (pixels: number): number => {
    return Math.round((pixels / PIXELS_PER_CM) * 100) / 100;
  };
  
  // Convert centimeters to pixels
  const cmToPixels = (cm: number): number => {
    return Math.round(cm * PIXELS_PER_CM);
  };
  
  // Handle dimension change with unit conversion
  const handleDimensionChange = (field: "width" | "height", value: number, unit: "px" | "cm") => {
    let pixelValue: number;
    
    if (unit === "cm") {
      pixelValue = cmToPixels(value);
    } else {
      pixelValue = value;
    }
    
    // Maintain aspect ratio if locked
    if (requirements.aspectRatioLocked) {
      const currentAspectRatio = requirements.width / requirements.height;
      
      if (field === "width") {
        onRequirementsChange({
          ...requirements,
          width: pixelValue,
          height: Math.round(pixelValue / currentAspectRatio)
        });
      } else {
        onRequirementsChange({
          ...requirements,
          height: pixelValue,
          width: Math.round(pixelValue * currentAspectRatio)
        });
      }
    } else {
      // Free dimension change when aspect ratio is unlocked
      onRequirementsChange({
        ...requirements,
        [field]: pixelValue,
      });
    }
  };

  const getAspectRatio = () => {
    return (requirements.width / requirements.height).toFixed(2);
  };

  const getFileSizeRange = () => {
    return `${requirements.minSize} - ${requirements.maxSize} KB`;
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-2xl font-bold text-gray-800">
          <Settings className="h-6 w-6 text-blue-600" />
          <span>Processing Requirements</span>
        </CardTitle>
        <p className="text-gray-600">
          Customize your image specifications to meet application form requirements
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Original Image Info */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="p-3 bg-blue-50 border border-blue-200 rounded-lg"
        >
          <div className="flex items-center space-x-2 mb-2">
            <ImageIcon className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">Original Image Specifications</span>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-blue-600">Size:</span>
              <div className="font-medium">{imageData.size.toFixed(1)} KB</div>
            </div>
            <div>
              <span className="text-blue-600">Dimensions:</span>
              <div className="font-medium">
                {imageData.width} × {imageData.height} px
                <div className="text-xs text-blue-500">
                  ({pixelsToCm(imageData.width).toFixed(1)} × {pixelsToCm(imageData.height).toFixed(1)} cm)
                </div>
              </div>
            </div>
            <div>
              <span className="text-blue-600">DPI:</span>
              <div className="font-medium">{imageData.dpi || "Unknown"}</div>
            </div>
            <div>
              <span className="text-blue-600">Format:</span>
              <div className="font-medium">{imageData.file.type.split('/')[1].toUpperCase()}</div>
            </div>
          </div>
          <p className="text-blue-600 text-xs mt-2">
            💡 Values below are pre-filled based on your original image. Adjust them as needed for your requirements.
          </p>
        </motion.div>

        {/* File Size Requirements */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-3"
        >
          <div className="flex items-center space-x-2">
            <FileText className="h-4 w-4 text-green-600" />
            <Label className="text-base font-semibold">File Size Range</Label>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="min-size" className="text-sm">Minimum Size (KB)</Label>
              <Input
                id="min-size"
                type="number"
                min="1"
                max="1000"
                value={requirements.minSize}
                onChange={(e) => handleChange("minSize", parseInt(e.target.value) || 1)}
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-9"
              />
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="max-size" className="text-sm">Maximum Size (KB)</Label>
              <Input
                id="max-size"
                type="number"
                min="1"
                max="1000"
                value={requirements.maxSize}
                onChange={(e) => handleChange("maxSize", parseInt(e.target.value) || 1)}
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-9"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
              Target: {getFileSizeRange()}
            </Badge>
            <span className="text-xs text-gray-500">
              Original: {imageData.size.toFixed(1)} KB
            </span>
          </div>
          <p className="text-xs text-gray-500">
            Size range is automatically set to 80%-120% of your original image size
          </p>
        </motion.div>

        {/* Dimensions */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Ruler className="h-4 w-4 text-blue-600" />
              <Label className="text-base font-semibold">Dimensions</Label>
            </div>
            
            {/* Unit Toggle */}
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-600">Units:</span>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <Button
                  type="button"
                  variant={unitMode === "px" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setUnitMode("px")}
                  className="h-6 px-2 text-xs"
                >
                  Pixels
                </Button>
                <Button
                  type="button"
                  variant={unitMode === "cm" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setUnitMode("cm")}
                  className="h-6 px-2 text-xs"
                >
                  Centimeters
                </Button>
              </div>
            </div>
          </div>
          
          {/* Unit Conversion Info */}
          <div className="p-2 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-center space-x-2 text-amber-800">
              <Maximize2 className="h-3 w-3" />
              <span className="text-xs font-medium">Unit Conversion</span>
            </div>
            <p className="text-xs text-amber-700 mt-1">
              💡 Switch between pixels and centimeters. Conversion is based on 96 DPI (standard screen resolution). 
              {unitMode === "cm" && " Centimeter values are rounded to 2 decimal places for precision."}
            </p>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <Label htmlFor="width" className="text-xs">
                Width ({unitMode === "px" ? "px" : "cm"})
              </Label>
              <Input
                id="width"
                type="number"
                min={unitMode === "px" ? 1 : 0.1}
                max={unitMode === "px" ? 4000 : 100}
                step={unitMode === "px" ? 1 : 0.1}
                value={unitMode === "px" ? requirements.width : pixelsToCm(requirements.width)}
                onChange={(e) => {
                  const value = unitMode === "px" ? parseInt(e.target.value) || 1 : parseFloat(e.target.value) || 0.1;
                  handleDimensionChange("width", value, unitMode);
                }}
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-9 text-sm"
              />
              {unitMode === "cm" && (
                <p className="text-xs text-gray-500">
                  ≈ {requirements.width} px
                </p>
              )}
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="height" className="text-xs">
                Height ({unitMode === "px" ? "px" : "cm"})
              </Label>
              <Input
                id="height"
                type="number"
                min={unitMode === "px" ? 1 : 0.1}
                max={unitMode === "px" ? 4000 : 100}
                step={unitMode === "px" ? 1 : 0.1}
                value={unitMode === "px" ? requirements.height : pixelsToCm(requirements.height)}
                onChange={(e) => {
                  const value = unitMode === "px" ? parseInt(e.target.value) || 1 : parseFloat(e.target.value) || 0.1;
                  handleDimensionChange("height", value, unitMode);
                }}
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-9 text-sm"
              />
              {unitMode === "cm" && (
                <p className="text-xs text-gray-500">
                  ≈ {requirements.height} px
                </p>
              )}
            </div>
            
                         <div className="space-y-1">
               <Label className="text-xs">Aspect Ratio</Label>
               <div className="h-9 flex items-center justify-center bg-gray-50 rounded-md border border-gray-300">
                 <span className="text-sm font-mono text-gray-700">{getAspectRatio()}</span>
               </div>
               <button
                 onClick={() => handleChange("aspectRatioLocked", !requirements.aspectRatioLocked)}
                 className="flex items-center justify-center space-x-1 text-xs w-full p-1 rounded-md hover:bg-gray-100 transition-colors duration-200 group"
                 title={requirements.aspectRatioLocked ? "Click to unlock aspect ratio" : "Click to lock aspect ratio"}
               >
                 {requirements.aspectRatioLocked ? (
                   <Lock className="h-3 w-3 text-green-600 group-hover:text-green-700 flex-shrink-0" />
                 ) : (
                   <Unlock className="h-3 w-3 text-gray-400 group-hover:text-gray-600 flex-shrink-0" />
                 )}
                 <span className={`${requirements.aspectRatioLocked ? "text-green-600" : "text-gray-500"} group-hover:font-medium text-xs truncate`}>
                   {requirements.aspectRatioLocked ? "Locked" : "Unlocked"}
                 </span>
               </button>
             </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
              Target: {requirements.width} × {requirements.height} px
              {unitMode === "cm" && (
                <span className="ml-2 text-xs">
                  ({pixelsToCm(requirements.width).toFixed(1)} × {pixelsToCm(requirements.height).toFixed(1)} cm)
                </span>
              )}
            </Badge>
            <span className="text-xs text-gray-500">
              Original: {imageData.width} × {imageData.height} px
              <span className="ml-1 text-xs">
                ({pixelsToCm(imageData.width).toFixed(1)} × {pixelsToCm(imageData.height).toFixed(1)} cm)
              </span>
            </span>
          </div>
          <div className="p-2 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-2 text-blue-800 mb-1">
              <Maximize2 className="h-3 w-3" />
              <span className="text-xs font-medium">Aspect Ratio Control</span>
            </div>
            <p className="text-xs text-blue-700">
              {requirements.aspectRatioLocked 
                ? "🔒 Aspect ratio is locked. Click the lock icon below to unlock and adjust dimensions independently."
                : "🔓 Aspect ratio is unlocked. Click the unlock icon below to lock and maintain proportions automatically."
              }
            </p>
          </div>
          <p className="text-xs text-gray-500">
            Dimensions are pre-filled with your original image size. Toggle between pixels and centimeters.
          </p>
        </motion.div>

        {/* DPI and Format */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-3"
        >
          <div className="flex items-center space-x-2">
            <ImageIcon className="h-4 w-4 text-purple-600" />
            <Label className="text-base font-semibold">Quality & Format</Label>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dpi" className="text-sm">DPI (Dots Per Inch)</Label>
              <div className="space-y-2">
                <Slider
                  id="dpi"
                  min={72}
                  max={600}
                  step={1}
                  value={[requirements.dpi]}
                  onValueChange={(value) => handleChange("dpi", value[0])}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>72 DPI</span>
                  <span className="font-medium">{requirements.dpi} DPI</span>
                  <span>600 DPI</span>
                </div>
              </div>
              <p className="text-xs text-gray-500">
                Higher DPI = Better print quality, larger file size. DPI is pre-filled based on your original image.
              </p>
            </div>
            
                         <div className="space-y-2">
               <Label htmlFor="format" className="text-sm">Output Format</Label>
               <Select
                 value={requirements.format}
                 onValueChange={(value) => handleChange("format", value as "jpg" | "png")}
               >
                                   <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-9 w-full [&>svg]:absolute [&>svg]:right-3 [&>svg]:top-1/2 [&>svg]:-translate-y-1/2">
                    <SelectValue />
                  </SelectTrigger>
                                   <SelectContent>
                    <SelectItem value="jpg">JPEG (Smaller, no transparency)</SelectItem>
                    <SelectItem value="png">PNG (Larger, supports transparency)</SelectItem>
                  </SelectContent>
               </Select>
               <p className="text-xs text-gray-500">
                 JPEG for photos, PNG for graphics with transparency
               </p>
             </div>
          </div>
        </motion.div>

        

                                  {/* Summary */}
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.4 }}
           className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200"
         >
           <h4 className="font-semibold text-gray-800 mb-2 text-sm">Processing Summary</h4>
           <div className="grid grid-cols-2 gap-3 text-xs">
             <div>
               <span className="text-gray-600">Size:</span>
               <div className="font-medium">{getFileSizeRange()}</div>
             </div>
             <div>
               <span className="text-gray-600">Dimensions:</span>
               <div className="font-medium">{requirements.width} × {requirements.height} px</div>
             </div>
             <div>
               <span className="text-gray-600">DPI:</span>
               <div className="font-medium">{requirements.dpi}</div>
             </div>
             <div>
               <span className="text-gray-600">Format:</span>
               <div className="font-medium uppercase">{requirements.format}</div>
             </div>
           </div>
           
           <div className="mt-2 p-2 bg-white/60 rounded-lg border border-blue-200">
             <div className="text-xs text-blue-700 font-medium mb-1">📊 Original vs Target Comparison</div>
             <div className="grid grid-cols-2 gap-2 text-xs">
               <div>
                 <span className="text-gray-600">Original Size:</span>
                 <div className="font-medium">{imageData.size.toFixed(1)} KB</div>
               </div>
               <div>
                 <span className="text-gray-600">Target Size:</span>
                 <div className="font-medium">{getFileSizeRange()}</div>
               </div>
               <div>
                 <span className="text-gray-600">Original Dimensions:</span>
                 <div className="font-medium">
                   {imageData.width} × {imageData.height} px
                   <div className="text-xs text-gray-500">
                     ({pixelsToCm(imageData.width).toFixed(1)} × {pixelsToCm(imageData.height).toFixed(1)} cm)
                   </div>
                 </div>
               </div>
               <div>
                 <span className="text-gray-600">Target Dimensions:</span>
                 <div className="font-medium">
                   {requirements.width} × {requirements.height} px
                   <div className="text-xs text-gray-500">
                     ({pixelsToCm(requirements.width).toFixed(1)} × {pixelsToCm(requirements.height).toFixed(1)} cm)
                   </div>
                 </div>
               </div>
             </div>
           </div>
         </motion.div>

         {/* Processing Tips */}
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.5 }}
           className="p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200"
         >
           <h4 className="font-semibold text-gray-800 mb-2 text-sm">💡 Processing Tips</h4>
           <div className="grid grid-cols-1 gap-3 text-xs text-gray-600">
             <div>
               <strong>File Size:</strong> Lower sizes mean more compression and potentially lower quality
             </div>
             <div>
               <strong>DPI:</strong> Higher DPI is better for printing but increases file size
             </div>
             <div>
               <strong>Format:</strong> JPEG for photos, PNG for graphics with transparency
             </div>
             <div>
               <strong>Dimensions:</strong> Maintain aspect ratio for best results
             </div>
           </div>
         </motion.div>
      </CardContent>
    </Card>
  );
}
