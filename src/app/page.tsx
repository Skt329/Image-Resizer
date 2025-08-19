"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { UploadSection } from "@/components/UploadSection";
import { RequirementsSection } from "@/components/RequirementsSection";
import { PreviewSection } from "@/components/PreviewSection";
import { DownloadSection } from "@/components/DownloadSection";
import { Footer } from "@/components/Footer";
import { ImageProcessor } from "@/lib/ImageProcessor";
import { ImageData, ProcessingRequirements } from "@/types";

export default function Home() {
  const [imageData, setImageData] = useState<ImageData | null>(null);
  const [requirements, setRequirements] = useState<ProcessingRequirements>({
    minSize: 20,
    maxSize: 30,
    width: 800,
    height: 600,
    dpi: 300,
    format: "jpg"
  });
  const [processedImage, setProcessedImage] = useState<ImageData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setImageData({
          file,
          url: e.target?.result as string,
          width: img.naturalWidth,
          height: img.naturalHeight,
          size: file.size / 1024, // Convert to KB
          name: file.name
        });
        setError(null);
        setProcessedImage(null);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const processImage = async () => {
    if (!imageData) return;
    
    setIsProcessing(true);
    setError(null);
    
    try {
      const processor = new ImageProcessor();
      const result = await processor.processImage(imageData, requirements);
      setProcessedImage(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to process image");
    } finally {
      setIsProcessing(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          <motion.div variants={itemVariants} className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Professional Image Editor
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Upload your photos and signatures, then customize them to meet exact application form requirements.
            </p>
          </motion.div>

          <motion.div variants={itemVariants}>
            <UploadSection onImageUpload={handleImageUpload} />
          </motion.div>

          {imageData && (
            <>
              <motion.div variants={itemVariants}>
                <RequirementsSection
                  requirements={requirements}
                  onRequirementsChange={setRequirements}
                  imageData={imageData}
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <PreviewSection
                  originalImage={imageData}
                  processedImage={processedImage}
                  isProcessing={isProcessing}
                  error={error}
                  onProcess={processImage}
                />
              </motion.div>

              {processedImage && (
                <motion.div variants={itemVariants}>
                  <DownloadSection processedImage={processedImage} />
                </motion.div>
              )}
            </>
          )}
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
