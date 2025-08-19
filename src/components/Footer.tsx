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
          <div className="flex items-center justify-center space-x-2 text-muted-foreground">
            <Code className="h-4 w-4" />
            <span>Made for simplifying application form image requirements</span>
          </div>
          
          <div className="flex items-center justify-center space-x-2 text-muted-foreground">
            <span>Built with</span>
            <Heart className="h-4 w-4 text-red-500" />
            <span>for professional image processing</span>
          </div>
          
          <div className="flex items-center justify-center space-x-1 text-sm text-muted-foreground">
            <span>Powered by</span>
            <a href="https://nextjs.org" className="hover:text-primary transition-colors">
              Next.js
            </a>
            <span>and</span>
            <a href="https://tailwindcss.com" className="hover:text-primary transition-colors">
              Tailwind CSS
            </a>
          </div>
          
          <div className="text-xs text-muted-foreground">
            © 2024 Image Editor. All rights reserved.
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
