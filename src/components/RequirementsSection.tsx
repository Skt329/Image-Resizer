"use client";

import { motion } from "framer-motion";
import { Settings, Ruler, FileText, Image as ImageIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { ProcessingRequirements, ImageData } from "@/types";

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
  const handleChange = (field: keyof ProcessingRequirements, value: string | number) => {
    onRequirementsChange({
      ...requirements,
      [field]: value,
    });
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
      
      <CardContent className="space-y-6">
        {/* Original Image Info */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="p-4 bg-blue-50 border border-blue-200 rounded-lg"
        >
          <div className="flex items-center space-x-2 mb-2">
            <ImageIcon className="h-5 w-5 text-blue-600" />
            <span className="font-medium text-blue-800">Original Image Specifications</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-blue-600">Size:</span>
              <div className="font-medium">{imageData.size.toFixed(1)} KB</div>
            </div>
            <div>
              <span className="text-blue-600">Dimensions:</span>
              <div className="font-medium">{imageData.width} × {imageData.height} px</div>
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
          className="space-y-4"
        >
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-green-600" />
            <Label className="text-lg font-semibold">File Size Range</Label>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="min-size">Minimum Size (KB)</Label>
              <Input
                id="min-size"
                type="number"
                min="1"
                max="1000"
                value={requirements.minSize}
                onChange={(e) => handleChange("minSize", parseInt(e.target.value) || 1)}
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="max-size">Maximum Size (KB)</Label>
              <Input
                id="max-size"
                type="number"
                min="1"
                max="1000"
                value={requirements.maxSize}
                onChange={(e) => handleChange("maxSize", parseInt(e.target.value) || 1)}
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Target: {getFileSizeRange()}
            </Badge>
            <span className="text-sm text-gray-500">
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
          className="space-y-4"
        >
          <div className="flex items-center space-x-2">
            <Ruler className="h-5 w-5 text-blue-600" />
            <Label className="text-lg font-semibold">Dimensions</Label>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="width">Width (px)</Label>
              <Input
                id="width"
                type="number"
                min="1"
                max="4000"
                value={requirements.width}
                onChange={(e) => handleChange("width", parseInt(e.target.value) || 1)}
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="height">Height (px)</Label>
              <Input
                id="height"
                type="number"
                min="1"
                max="4000"
                value={requirements.height}
                onChange={(e) => handleChange("height", parseInt(e.target.value) || 1)}
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Aspect Ratio</Label>
              <div className="h-10 flex items-center justify-center bg-gray-50 rounded-md border border-gray-300">
                <span className="text-lg font-mono text-gray-700">{getAspectRatio()}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              Target: {requirements.width} × {requirements.height} px
            </Badge>
            <span className="text-sm text-gray-500">
              Original: {imageData.width} × {imageData.height} px
            </span>
          </div>
          <p className="text-xs text-gray-500">
            Dimensions are pre-filled with your original image size
          </p>
        </motion.div>

        {/* DPI and Format */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          <div className="flex items-center space-x-2">
            <ImageIcon className="h-5 w-5 text-purple-600" />
            <Label className="text-lg font-semibold">Quality & Format</Label>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="dpi">DPI (Dots Per Inch)</Label>
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
                <div className="flex justify-between text-sm text-gray-500">
                  <span>72 DPI</span>
                  <span className="font-medium">{requirements.dpi} DPI</span>
                  <span>600 DPI</span>
                </div>
              </div>
              <p className="text-xs text-gray-500">
                Higher DPI = Better print quality, larger file size. DPI is pre-filled based on your original image.
              </p>
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="format">Output Format</Label>
              <Select
                value={requirements.format}
                onValueChange={(value) => handleChange("format", value as "jpg" | "png")}
              >
                <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="jpg">JPEG (Smaller size, no transparency)</SelectItem>
                  <SelectItem value="png">PNG (Larger size, supports transparency)</SelectItem>
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
          className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200"
        >
          <h4 className="font-semibold text-gray-800 mb-2">Processing Summary</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
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
          <div className="mt-3 p-3 bg-white/60 rounded-lg border border-blue-200">
            <div className="text-xs text-blue-700 font-medium mb-1">📊 Original vs Target Comparison</div>
            <div className="grid grid-cols-2 gap-4 text-xs">
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
                <div className="font-medium">{imageData.width} × {imageData.height} px</div>
              </div>
              <div>
                <span className="text-gray-600">Target Dimensions:</span>
                <div className="font-medium">{requirements.width} × {requirements.height} px</div>
              </div>
            </div>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
}
