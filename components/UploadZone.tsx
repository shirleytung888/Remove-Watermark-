import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { ImageFile } from '../types';

interface UploadZoneProps {
  onImageSelected: (image: ImageFile) => void;
}

export const UploadZone: React.FC<UploadZoneProps> = ({ onImageSelected }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    setError(null);
    if (!file.type.startsWith('image/')) {
      setError("Please upload a valid image file (PNG, JPG, WebP).");
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
       setError("File size too large. Please upload an image under 10MB.");
       return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        onImageSelected({
          file,
          previewUrl: URL.createObjectURL(file),
          base64: e.target.result as string,
          mimeType: file.type
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div 
      className={`relative w-full border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ease-in-out cursor-pointer group overflow-hidden
        ${isDragging 
          ? 'border-brand-500 bg-brand-500/10 scale-[1.01]' 
          : 'border-gray-700 hover:border-brand-400 hover:bg-gray-800/50 bg-gray-900/50'
        }
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleInputChange} 
        className="hidden" 
        accept="image/png, image/jpeg, image/webp"
      />
      
      <div className="flex flex-col items-center justify-center space-y-4 relative z-10">
        <div className={`p-4 rounded-full bg-gray-800 transition-transform duration-300 ${isDragging ? 'scale-110' : 'group-hover:scale-105'}`}>
          <Upload className={`w-8 h-8 ${isDragging ? 'text-brand-400' : 'text-gray-400 group-hover:text-brand-300'}`} />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">
            Upload or Drag & Drop
          </h3>
          <p className="text-sm text-gray-400 mt-2 max-w-sm mx-auto">
            Supported formats: PNG, JPG, WebP (Max 10MB)
          </p>
        </div>
      </div>

      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-brand-500/20 rounded-full blur-3xl -z-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {error && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center space-x-2 bg-red-900/80 text-red-100 px-4 py-2 rounded-full text-sm border border-red-800">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        </div>
      )}
    </div>
  );
};