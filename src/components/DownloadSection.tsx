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
    <Card className="glass-card border-green-200 dark:border-green-800 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950/30 dark:to-blue-950/30">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-foreground">
          Download Your Processed Image
        </CardTitle>
        <p className="text-muted-foreground">
          Your image has been processed according to your specifications. Review the details and download.
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Image Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-muted rounded-lg">
            <div className="font-semibold text-foreground">{getFileSize()}</div>
            <div className="text-sm text-muted-foreground">File Size</div>
          </div>
          
          <div className="text-center p-3 bg-muted rounded-lg">
            <div className="font-semibold text-foreground">{getDimensions()}</div>
            <div className="text-sm text-muted-foreground">Dimensions</div>
          </div>
          
          <div className="text-center p-3 bg-muted rounded-lg">
            <div className="font-semibold text-foreground">{getDPI()}</div>
            <div className="text-sm text-muted-foreground">DPI</div>
          </div>
          
          <div className="text-center p-3 bg-muted rounded-lg">
            <div className="font-semibold text-foreground">{getFormat()}</div>
            <div className="text-sm text-muted-foreground">Format</div>
          </div>
        </div>

        {/* Download Section */}
        <div className="text-center p-6 bg-muted rounded-lg">
          <h4 className="font-semibold text-foreground mb-2">Ready to Download</h4>
          <p className="text-sm text-muted-foreground mb-4">
            Your image meets all the specified requirements and is ready for use.
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
        </CardContent>
    </Card>
  );
}
