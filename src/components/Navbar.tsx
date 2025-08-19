"use client";

import { motion } from "framer-motion";
import { Camera, Palette } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

export function Navbar() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <motion.div
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
              <Camera className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Image Editor
            </h1>
          </motion.div>
          
          <div className="flex items-center space-x-4">
            <motion.div
              className="flex items-center space-x-2 text-sm text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Palette className="h-4 w-4" />
              <span>Professional Image Processing</span>
            </motion.div>
            
            <ThemeToggle />
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
