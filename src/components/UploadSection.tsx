"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Upload, Image as ImageIcon, FileImage } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface UploadSectionProps {
  onImageUpload: (file: File) => void;
}

export function UploadSection({ onImageUpload }: UploadSectionProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleFileUpload = useCallback(async (file: File) => {
    setIsUploading(true);
    
    try {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        throw new Error("File size must be less than 10MB");
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error("Please select a valid image file");
      }

      onImageUpload(file);
    } catch (error) {
      console.error("Upload error:", error);
      alert(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  }, [onImageUpload]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      handleFileUpload(imageFile);
    }
  }, [handleFileUpload]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      handleFileUpload(file);
    }
  }, [handleFileUpload]);

  return (
    <Card className="glass-card overflow-hidden">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-2xl font-bold text-gray-800">
          Upload Your Image
        </CardTitle>
        <p className="text-gray-600">
          Drag and drop your photo or signature, or click to browse
        </p>
      </CardHeader>
      
      <CardContent className="p-6">
        <motion.div
          className={`upload-zone rounded-xl p-8 text-center transition-all duration-200 ${
            isDragOver ? "dragover" : ""
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <div className="flex justify-center">
              <motion.div
                className="p-4 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <ImageIcon className="h-12 w-12 text-blue-600" />
              </motion.div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-gray-800">
                {isDragOver ? "Drop your image here" : "Choose an image file"}
              </h3>
              <p className="text-gray-500">
                Supports JPG, PNG, GIF, WebP • Max 10MB
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={() => document.getElementById('file-input')?.click()}
                disabled={isUploading}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-lg"
              >
                <Upload className="h-4 w-4 mr-2" />
                {isUploading ? "Processing..." : "Browse Files"}
              </Button>
              
              <Button
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-2 rounded-lg font-medium"
              >
                <FileImage className="h-4 w-4 mr-2" />
                Supported Formats
              </Button>
            </div>

            <input
              id="file-input"
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              aria-label="Select image file"
              title="Select image file"
            />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 text-center"
        >
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Secure processing</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>No data stored</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span>High quality output</span>
            </div>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
}
