"use client";

import { motion } from "framer-motion";
import { Eye, Play, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ImageData } from "@/types";

interface PreviewSectionProps {
  originalImage: ImageData;
  processedImage: ImageData | null;
  isProcessing: boolean;
  error: string | null;
  onProcess: () => void;
}

export function PreviewSection({
  originalImage,
  processedImage,
  isProcessing,
  error,
  onProcess,
}: PreviewSectionProps) {
  const getImageInfo = (image: ImageData) => ({
    size: `${image.size.toFixed(1)} KB`,
    dimensions: `${image.width} × ${image.height} px`,
    dpi: image.dpi || "Unknown",
  });

  const originalInfo = getImageInfo(originalImage);
  const processedInfo = processedImage ? getImageInfo(processedImage) : null;

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-2xl font-bold text-gray-800">
          <Eye className="h-6 w-6 text-blue-600" />
          <span>Image Preview & Processing</span>
        </CardTitle>
        <p className="text-gray-600">
          Review your original image and process it according to your requirements
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Processing Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200"
        >
          <div className="text-center sm:text-left">
            <h4 className="font-semibold text-gray-800 mb-1">Ready to Process?</h4>
            <p className="text-sm text-gray-600">
              Click the button below to resize, compress, and adjust your image
            </p>
          </div>
          
          <Button
            onClick={onProcess}
            disabled={isProcessing}
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Play className="h-5 w-5 mr-2" />
                Process Image
              </>
            )}
          </Button>
        </motion.div>

        {/* Processing Status */}
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 bg-blue-50 rounded-lg border border-blue-200"
          >
            <div className="flex items-center space-x-3 mb-3">
              <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
              <span className="font-medium text-blue-800">Processing your image...</span>
            </div>
            <Progress value={75} className="h-2" />
            <p className="text-sm text-blue-600 mt-2">
              Resizing, adjusting DPI, and compressing to meet your requirements
            </p>
          </motion.div>
        )}

        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 bg-red-50 rounded-lg border border-red-200"
          >
            <div className="flex items-center space-x-3">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <div>
                <h4 className="font-medium text-red-800">Processing Error</h4>
                <p className="text-sm text-red-600">{error}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Image Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Original Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <div className="text-center">
              <h4 className="font-semibold text-gray-800 mb-2">Original Image</h4>
              <Badge variant="outline" className="bg-gray-100 text-gray-700">
                {originalImage.name}
              </Badge>
            </div>
            
            <div className="relative group">
              <img
                src={originalImage.url}
                alt="Original"
                className="w-full h-64 object-contain rounded-lg border border-gray-200 shadow-sm group-hover:shadow-md transition-shadow duration-200"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 rounded-lg flex items-center justify-center">
                <Eye className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div className="text-center p-2 bg-gray-50 rounded">
                <div className="font-medium text-gray-800">{originalInfo.size}</div>
                <div className="text-gray-500">Size</div>
              </div>
              <div className="text-center p-2 bg-gray-50 rounded">
                <div className="font-medium text-gray-800">{originalInfo.dimensions}</div>
                <div className="text-gray-500">Dimensions</div>
              </div>
              <div className="text-center p-2 bg-gray-50 rounded">
                <div className="font-medium text-gray-800">{originalInfo.dpi}</div>
                <div className="text-gray-500">DPI</div>
              </div>
            </div>
          </motion.div>

          {/* Processed Image */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <div className="text-center">
              <h4 className="font-semibold text-gray-800 mb-2">Processed Image</h4>
              {processedImage ? (
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Ready
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-gray-100 text-gray-500">
                  Not processed yet
                </Badge>
              )}
            </div>
            
            <div className="relative group">
              {processedImage ? (
                <img
                  src={processedImage.url}
                  alt="Processed"
                  className="w-full h-64 object-contain rounded-lg border border-green-200 shadow-sm group-hover:shadow-md transition-shadow duration-200"
                />
              ) : (
                <div className="w-full h-64 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <Eye className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Process image to see result</p>
                  </div>
                </div>
              )}
            </div>
            
            {processedImage ? (
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="text-center p-2 bg-green-50 rounded border border-green-200">
                  <div className="font-medium text-green-800">{processedInfo!.size}</div>
                  <div className="text-green-600">Size</div>
                </div>
                <div className="text-center p-2 bg-green-50 rounded border border-green-200">
                  <div className="font-medium text-green-800">{processedInfo!.dimensions}</div>
                  <div className="text-green-600">Dimensions</div>
                </div>
                <div className="text-center p-2 bg-green-50 rounded border border-green-200">
                  <div className="font-medium text-green-800">{processedInfo!.dpi}</div>
                  <div className="text-green-600">DPI</div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="font-medium text-gray-400">--</div>
                  <div className="text-gray-400">Size</div>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="font-medium text-gray-400">--</div>
                  <div className="text-gray-400">Dimensions</div>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="font-medium text-gray-400">--</div>
                  <div className="text-gray-400">DPI</div>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Processing Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200"
        >
          <h4 className="font-semibold text-gray-800 mb-2">💡 Processing Tips</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
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
