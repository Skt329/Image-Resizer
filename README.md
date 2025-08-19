# Image Editor - Professional Application Form Image Processor

A fully functional, production-ready web application built with React, Next.js, and Tailwind CSS that allows users to upload and edit images (photos and signatures) for application forms.

## ✨ Features

### 🖼️ **Upload & Preview**
- Drag-and-drop or click-to-upload for photos/signatures
- Instant preview with smooth animations
- Support for JPG, PNG, GIF, WebP formats
- Maximum file size: 10MB

### ⚙️ **Input Requirements**
- **File Size Range**: Specify exact file size requirements (e.g., 20 KB to 30 KB)
- **Dimensions**: Set exact width × height in pixels
- **DPI**: Adjust DPI for print quality (72-600 DPI)
- **Format**: Choose between JPG and PNG output

### 🛠️ **Processing Tools**
- **High-Quality Resizing**: Uses Pica.js for superior image resizing
- **Smart Compression**: Browser-image-compression for optimal file size
- **DPI Adjustment**: Canvas-based DPI modification
- **Format Conversion**: Seamless JPG/PNG conversion

### 📥 **Output & Download**
- Live preview of processed image
- Display of actual file size, dimensions, and DPI
- Download in JPG or PNG format
- Optimized for application forms

### 🚨 **Error Handling**
- Clear error messages for failed processing
- Validation of input requirements
- Suggestions for nearest possible results

## 🚀 Tech Stack

- **Frontend**: React 18 + Next.js 15 + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Animations**: Framer Motion
- **Image Processing**: 
  - `browser-image-compression` for size optimization
  - `pica` for high-quality resizing
  - HTML5 Canvas for DPI adjustments
- **UI Components**: shadcn/ui (Button, Card, Input, Label, etc.)
- **Icons**: Lucide React

## 🎨 UI/UX Features

- **Modern Design**: Clean, professional interface with glassmorphism effects
- **Responsive Layout**: Works seamlessly on desktop and mobile devices
- **Smooth Animations**: Framer Motion-powered transitions and micro-interactions
- **Color Scheme**: Light mode with soft shadows and rounded corners
- **Accessibility**: Proper ARIA labels and keyboard navigation

## 📱 Layout Structure

- **Navbar**: App title with gradient branding
- **Main Content**: Grid layout with responsive cards
  - Upload Section
  - Requirements Section
  - Preview Section
  - Download Section
- **Footer**: Simple note about the app's purpose

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Setup Steps
1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd image-editor
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production
```bash
npm run build
npm start
```

## 🔧 Configuration

The app uses several configuration files:
- `tailwind.config.js` - Tailwind CSS configuration
- `components.json` - shadcn/ui component configuration
- `tsconfig.json` - TypeScript configuration

## 📁 Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles and CSS variables
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Main page component
├── components/             # React components
│   ├── ui/                # shadcn/ui components
│   ├── Navbar.tsx         # Navigation component
│   ├── UploadSection.tsx  # Image upload section
│   ├── RequirementsSection.tsx # Processing requirements
│   ├── PreviewSection.tsx # Image preview and processing
│   ├── DownloadSection.tsx # Download section
│   └── Footer.tsx         # Footer component
├── lib/                    # Utility libraries
│   ├── ImageProcessor.ts  # Core image processing logic
│   └── utils.ts           # Utility functions
└── types/                  # TypeScript type definitions
    └── index.ts           # Main type definitions
```

## 🎯 Core Components

### ImageProcessor Class
The heart of the application that handles:
- Image resizing with Pica.js
- DPI adjustment using Canvas API
- File compression with browser-image-compression
- Format conversion (JPG/PNG)

### UploadSection
- Drag-and-drop file upload
- File validation and preview
- Responsive design with animations

### RequirementsSection
- Interactive form for setting requirements
- Real-time validation and feedback
- Slider controls for DPI adjustment

### PreviewSection
- Side-by-side comparison of original vs processed
- Processing status and progress indicators
- Error handling and user feedback

### DownloadSection
- Final image preview
- Download functionality
- Processing summary and specifications

## 🔒 Security & Privacy

- **No Data Storage**: Images are processed in the browser only
- **Client-Side Processing**: All operations happen locally
- **Secure**: No server-side image handling or storage
- **Privacy-First**: User images never leave their device

## 🚀 Performance Features

- **Lazy Loading**: Components load as needed
- **Optimized Processing**: Efficient image algorithms
- **Responsive Images**: Automatic sizing and optimization
- **Smooth Animations**: 60fps animations with Framer Motion

## 🌟 Future Enhancements

The modular architecture makes it easy to add new features:
- **Cropping Tools**: Interactive image cropping
- **Filters & Effects**: Basic image filters
- **Batch Processing**: Multiple image processing
- **Cloud Storage**: Optional cloud backup
- **Advanced Formats**: Support for more image formats

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For support or questions, please open an issue in the repository.

---

**Built with ❤️ using modern web technologies for professional image processing needs.**
