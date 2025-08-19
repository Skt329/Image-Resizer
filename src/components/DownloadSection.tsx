"use client";

import { motion } from "framer-motion";
import { Download, CheckCircle, FileText, Ruler, Image as ImageIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ImageData } from "@/types";

interface DownloadSectionProps {
  processedImage: ImageData;
}

export function DownloadSection({ processedImage }: DownloadSectionProps) {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = processedImage.url;
    link.download = processedImage.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getFileSize = () => `${processedImage.size.toFixed(1)} KB`;
  const getDimensions = () => `${processedImage.width} × ${processedImage.height} px`;
  const getDPI = () => processedImage.dpi || "Unknown";
  const getFormat = () => processedImage.file.type.split('/')[1].toUpperCase();

  return (
    <Card className="glass-card border-green-200 bg-gradient-to-br from-green-50 to-blue-50">
      <CardHeader className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center"
        >
          <CheckCircle className="h-8 w-8 text-green-600" />
        </motion.div>
        
        <CardTitle className="text-2xl font-bold text-gray-800">
          Image Successfully Processed!
        </CardTitle>
        <p className="text-gray-600">
          Your image has been optimized according to your requirements and is ready for download
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Final Image Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center"
        >
          <div className="relative inline-block group">
            <img
              src={processedImage.url} alt="Final processed image"
              className="max-w-full h-80 object-contain rounded-lg border-2 border-green-200 shadow-lg group-hover:shadow-xl transition-shadow duration-200"
            />
            <div className="absolute inset-0 bg-green-500 bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-12 w-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </div>
          </div>
        </motion.div>

        {/* Image Specifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <div className="text-center p-4 bg-white/60 backdrop-blur-sm rounded-lg border border-green-200">
            <FileText className="h-6 w-6 text-green-600 mx-auto mb-2" />
            <div className="font-semibold text-gray-800">{getFileSize()}</div>
            <div className="text-sm text-gray-600">File Size</div>
          </div>
          
          <div className="text-center p-4 bg-white/60 backdrop-blur-sm rounded-lg border border-blue-200">
            <Ruler className="h-6 w-6 text-blue-600 mx-auto mb-2" />
            <div className="font-semibold text-gray-800">{getDimensions()}</div>
            <div className="text-sm text-gray-600">Dimensions</div>
          </div>
          
          <div className="text-center p-4 bg-white/60 backdrop-blur-sm rounded-lg border border-purple-200">
            <ImageIcon className="h-6 w-6 text-purple-600 mx-auto mb-2" />
            <div className="font-semibold text-gray-800">{getDPI()}</div>
            <div className="text-sm text-gray-600">DPI</div>
          </div>
          
          <div className="text-center p-4 bg-white/60 backdrop-blur-sm rounded-lg border border-orange-200">
            <div className="h-6 w-6 bg-gradient-to-br from-orange-400 to-red-500 rounded mx-auto mb-2 flex items-center justify-center">
              <span className="text-white text-xs font-bold">{getFormat()}</span>
            </div>
            <div className="font-semibold text-gray-800">{getFormat()}</div>
            <div className="text-sm text-gray-600">Format</div>
          </div>
        </motion.div>

        {/* Download Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center space-y-4"
        >
          <div className="p-4 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg border border-green-200">
            <h4 className="font-semibold text-gray-800 mb-2">Ready to Download</h4>
            <p className="text-sm text-gray-600 mb-4">
              Your image meets all the specified requirements and is optimized for application forms
            </p>
            
            <Button
              onClick={handleDownload}
              size="lg"
              className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg hover:scale-105"
            >
              <Download className="h-5 w-5 mr-2" />
              Download Processed Image
            </Button>
          </div>
        </motion.div>



        {/* Success Summary */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="p-4 bg-white/80 backdrop-blur-sm rounded-lg border border-green-200"
        >
          <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
            <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
            Processing Summary
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Original Size:</span>
                <span className="font-medium">Unknown</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Final Size:</span>
                <span className="font-medium text-green-600">{getFileSize()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Compression:</span>
                <span className="font-medium text-blue-600">Optimized</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Quality:</span>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  High
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Format:</span>
                <span className="font-medium">{getFormat()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Ready
                </Badge>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200"
        >
          <h4 className="font-semibold text-gray-800 mb-2">What&apos;s Next?</h4>
          <p className="text-sm text-gray-600 mb-3">
            Your image is now ready for use in application forms, documents, or any other purpose
          </p>
          <div className="flex flex-wrap justify-center gap-2 text-xs">
            <Badge variant="outline" className="bg-blue-100 text-blue-700">
              Application Forms
            </Badge>
            <Badge variant="outline" className="bg-purple-100 text-purple-700">
              Documents
            </Badge>
            <Badge variant="outline" className="bg-green-100 text-green-700">
              Print Ready
            </Badge>
            <Badge variant="outline" className="bg-orange-100 text-orange-700">
              Web Use
            </Badge>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
}
