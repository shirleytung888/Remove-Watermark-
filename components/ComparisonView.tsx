import React, { useState } from 'react';
import { Download, Maximize2, Minimize2, ArrowRight } from 'lucide-react';

interface ComparisonViewProps {
  originalUrl: string;
  processedUrl: string;
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({ originalUrl, processedUrl }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    // Simple mock fullscreen for the container component styling
    setIsFullscreen(!isFullscreen);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = processedUrl;
    link.download = 'watermark-removed.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={`flex flex-col space-y-4 ${isFullscreen ? 'fixed inset-0 z-50 bg-gray-950 p-8 overflow-auto' : ''}`}>
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
           <span className="w-2 h-6 bg-brand-500 rounded-full"></span>
           Result Comparison
        </h2>
        <div className="flex space-x-2">
           <button 
            onClick={toggleFullscreen}
            className="p-2 text-gray-400 hover:text-white bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
          </button>
          <button 
            onClick={handleDownload}
            className="flex items-center px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-lg shadow-lg shadow-brand-500/20 transition-all font-medium text-sm"
          >
            <Download size={16} className="mr-2" />
            Download Result
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
        {/* Original */}
        <div className="relative group rounded-xl overflow-hidden border border-gray-700 bg-gray-900/50 h-min">
          <div className="absolute top-3 left-3 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-xs font-semibold text-gray-300 border border-white/10 z-10">
            Original
          </div>
          <img 
            src={originalUrl} 
            alt="Original" 
            className="w-full h-auto object-contain rounded-xl"
          />
        </div>

        {/* Processed */}
        <div className="relative group rounded-xl overflow-hidden border border-brand-500/50 bg-gray-900/50 h-min shadow-[0_0_30px_-10px_rgba(99,102,241,0.2)]">
          <div className="absolute top-3 left-3 px-3 py-1 bg-brand-600/90 backdrop-blur-md rounded-full text-xs font-semibold text-white border border-white/10 z-10">
            Watermark Removed
          </div>
          <img 
            src={processedUrl} 
            alt="Processed" 
            className="w-full h-auto object-contain rounded-xl"
          />
        </div>
      </div>
    </div>
  );
};
