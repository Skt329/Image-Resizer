"use client";

import { motion } from "framer-motion";
import { Heart, Code } from "lucide-react";

export function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6 }}
      className="glass-card mt-16 border-t border-white/20"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2 text-gray-600">
            <Code className="h-4 w-4" />
            <span>Made for simplifying application form image requirements</span>
          </div>
          
          <div className="flex items-center justify-center space-x-1 text-sm text-gray-500">
            <span>Built with</span>
            <Heart className="h-4 w-4 text-red-500 animate-pulse" />
            <span>using React, Tailwind CSS, and modern web technologies</span>
          </div>
          
          <div className="text-xs text-gray-400">
            <p>Professional image processing tool for application forms, documents, and print materials</p>
            <p className="mt-1">Secure • Fast • High Quality • No Data Storage</p>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
