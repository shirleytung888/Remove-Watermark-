import React, { useState } from 'react';
import { UploadZone } from './components/UploadZone';
import { ComparisonView } from './components/ComparisonView';
import { Button } from './components/Button';
import { ImageFile, AppState, DEFAULT_PROMPT } from './types';
import { removeWatermark } from './services/geminiService';
import { Wand2, RefreshCw, Eraser, AlertTriangle, Info } from 'lucide-react';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [sourceImage, setSourceImage] = useState<ImageFile | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [customPrompt, setCustomPrompt] = useState(DEFAULT_PROMPT);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleImageSelected = (image: ImageFile) => {
    setSourceImage(image);
    setResultImage(null);
    setAppState(AppState.IDLE);
    setErrorMsg(null);
  };

  const handleRemoveWatermark = async () => {
    if (!sourceImage) return;

    setAppState(AppState.PROCESSING);
    setErrorMsg(null);

    try {
      const resultBase64 = await removeWatermark(sourceImage.base64, sourceImage.mimeType, customPrompt);
      setResultImage(resultBase64);
      setAppState(AppState.SUCCESS);
    } catch (err: any) {
      console.error(err);
      setAppState(AppState.ERROR);
      setErrorMsg(err.message || "An error occurred while communicating with Gemini.");
    }
  };

  const reset = () => {
    setSourceImage(null);
    setResultImage(null);
    setAppState(AppState.IDLE);
    setCustomPrompt(DEFAULT_PROMPT);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 selection:bg-brand-500/30 selection:text-brand-200">
      
      {/* Header */}
      <header className="border-b border-gray-800 bg-[#0f172a]/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center shadow-lg shadow-brand-500/20">
              <Eraser className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              Gemini Watermark Eraser
            </h1>
          </div>
          <div className="flex items-center text-xs text-gray-500 gap-4">
             <span className="hidden sm:inline-block">Powered by Gemini 2.5 Flash Image</span>
             {process.env.API_KEY ? (
               <span className="flex items-center text-emerald-500 gap-1.5 bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">
                 <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                 API Connected
               </span>
             ) : (
                <span className="flex items-center text-amber-500 gap-1.5 bg-amber-500/10 px-2 py-1 rounded-full border border-amber-500/20">
                 <AlertTriangle size={12} />
                 Missing API Key
               </span>
             )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Intro / Empty State */}
        {!sourceImage && (
          <div className="max-w-3xl mx-auto text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-6 tracking-tight">
              Remove Watermark <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-purple-400">
                Keep the Background
              </span>
            </h2>
            <p className="text-lg text-gray-400 mb-10 leading-relaxed max-w-2xl mx-auto">
              Cleanly remove the Gemini "star" watermark from your generated images without removing or altering the background.
            </p>
            <div className="w-full max-w-xl mx-auto">
              <UploadZone onImageSelected={handleImageSelected} />
            </div>
            
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
              {[
                { title: "Targeted Removal", desc: "Specifically targets the bottom-right watermark." },
                { title: "Background Safe", desc: "Your image background stays exactly as it is." },
                { title: "Seamless Inpainting", desc: "Fills the tiny gap with matching texture." }
              ].map((item, i) => (
                 <div key={i} className="p-6 rounded-2xl bg-gray-900/50 border border-gray-800 hover:border-gray-700 transition-colors">
                    <h3 className="font-semibold text-white mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-400">{item.desc}</p>
                 </div>
              ))}
            </div>
          </div>
        )}

        {/* Workspace */}
        {sourceImage && (
          <div className="flex flex-col lg:flex-row gap-8 animate-in fade-in slide-in-from-bottom-8 duration-500">
            
            {/* Sidebar Controls */}
            <div className="w-full lg:w-1/3 space-y-6">
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-semibold text-white">Settings</h3>
                  <button 
                    onClick={reset}
                    className="text-xs text-gray-400 hover:text-white flex items-center gap-1 transition-colors"
                  >
                    <RefreshCw size={12} /> Start Over
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                       Prompt Instruction
                    </label>
                    <textarea 
                      className="w-full h-32 bg-gray-950 border border-gray-700 rounded-lg p-3 text-sm text-gray-200 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none resize-none transition-all placeholder-gray-600"
                      value={customPrompt}
                      onChange={(e) => setCustomPrompt(e.target.value)}
                      placeholder="Describe what to remove..."
                      disabled={appState === AppState.PROCESSING}
                    />
                    <div className="flex items-start gap-2 mt-2 text-xs text-gray-500">
                      <Info size={14} className="mt-0.5 shrink-0" />
                      <p>The default prompt is optimized to remove the watermark while preserving the background.</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-800">
                    <Button 
                      onClick={handleRemoveWatermark} 
                      className="w-full py-3 text-base"
                      isLoading={appState === AppState.PROCESSING}
                      icon={<Wand2 size={18} />}
                      disabled={appState === AppState.SUCCESS && resultImage !== null} // Disable if already done, unless they change prompt? Actually let's allow re-run if they change prompt, but simplest is to keep enabled. Let's just keep enabled.
                    >
                      {appState === AppState.PROCESSING ? 'Removing...' : 'Remove Watermark'}
                    </Button>
                  </div>
                </div>
              </div>

               {/* Source Preview Small (If result is shown, otherwise source is in main area) */}
               {resultImage && (
                 <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 opacity-75 hover:opacity-100 transition-opacity">
                    <p className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wider">Original Source</p>
                    <img src={sourceImage.previewUrl} className="w-full h-32 object-cover rounded-lg" alt="Thumbnail" />
                 </div>
               )}
            </div>

            {/* Main Viewing Area */}
            <div className="w-full lg:w-2/3">
              {errorMsg && (
                <div className="mb-6 p-4 bg-red-900/20 border border-red-800 rounded-xl flex items-center gap-3 text-red-200">
                  <AlertTriangle size={20} className="shrink-0" />
                  <p className="text-sm">{errorMsg}</p>
                </div>
              )}

              {resultImage ? (
                <ComparisonView 
                  originalUrl={sourceImage.previewUrl} 
                  processedUrl={resultImage} 
                />
              ) : (
                <div className="relative rounded-2xl overflow-hidden border border-gray-800 bg-gray-900/50 group">
                   <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-xs text-white border border-white/10 z-10">
                     Preview
                   </div>
                   <img 
                    src={sourceImage.previewUrl} 
                    alt="Preview" 
                    className="w-full h-auto max-h-[70vh] object-contain mx-auto"
                  />
                  {/* Overlay Helper */}
                  <div className="absolute inset-0 pointer-events-none flex items-end justify-end p-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                     <div className="bg-brand-500/20 border-2 border-brand-500 border-dashed w-32 h-32 rounded-lg flex items-center justify-center text-brand-200 text-xs font-medium text-center backdrop-blur-sm">
                        Target Area <br/>(Approx)
                     </div>
                  </div>
                </div>
              )}
            </div>

          </div>
        )}
      </main>
    </div>
  );
};

export default App;
