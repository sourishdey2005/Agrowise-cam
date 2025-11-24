import React, { useState, useRef } from 'react';
import { Camera, Upload, X, Loader2, Leaf, AlertCircle, CheckCircle2 } from 'lucide-react';
import { analyzePlantImage } from '../services/geminiService';
import { MarkdownRenderer } from './MarkdownRenderer';

const PlantDoctor: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('');
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        // Extract pure base64 for API (remove data:image/xxx;base64, prefix)
        const base64Data = base64String.split(',')[1];
        setSelectedImage(base64String); // Keep full string for display
        setMimeType(file.type);
        setAnalysis(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;
    
    setLoading(true);
    setError(null);
    try {
      const base64Data = selectedImage.split(',')[1];
      const result = await analyzePlantImage(base64Data, mimeType);
      setAnalysis(result || "No analysis returned.");
    } catch (err: any) {
      // Display the actual error message (e.g., API Key missing)
      setError(err.message || "Failed to analyze image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setSelectedImage(null);
    setAnalysis(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="h-full flex flex-col p-4 max-w-3xl mx-auto w-full overflow-y-auto pb-24">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-green-900 flex items-center gap-2">
          <Leaf className="w-6 h-6" />
          Plant Doctor
        </h2>
        <p className="text-slate-600 mt-1">Upload a photo of your crop to detect diseases and get treatment advice.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex-1 flex flex-col">
        {!selectedImage ? (
          <div className="flex-1 flex flex-col p-6">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors group mb-6 min-h-[200px]"
            >
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Camera className="w-8 h-8" />
              </div>
              <p className="font-medium text-slate-700">Tap to upload or take a photo</p>
              <p className="text-sm text-slate-400 mt-2">Supports JPG, PNG</p>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleFileChange} 
              />
            </div>

            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <h3 className="font-semibold text-blue-900 text-sm mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Tips for Accurate Diagnosis
              </h3>
              <ul className="text-sm text-blue-800 space-y-2 pl-1">
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 w-1 h-1 bg-blue-400 rounded-full shrink-0"></span>
                  Take the photo in bright, natural light.
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 w-1 h-1 bg-blue-400 rounded-full shrink-0"></span>
                  Focus closely on the affected leaf or fruit.
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 w-1 h-1 bg-blue-400 rounded-full shrink-0"></span>
                  Avoid blurry images or photos taken from too far away.
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            <div className="relative h-64 bg-slate-900 w-full shrink-0">
              <img src={selectedImage} alt="Selected plant" className="w-full h-full object-contain" />
              <button 
                onClick={reset}
                className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-sm transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 flex-1 flex flex-col">
              {!analysis && !loading && !error && (
                <div className="text-center my-auto">
                  <p className="text-slate-600 mb-6">Image ready for analysis.</p>
                  <button 
                    onClick={handleAnalyze}
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold shadow-lg shadow-green-200 transition-all active:scale-95 flex items-center gap-2 mx-auto"
                  >
                    <Leaf className="w-5 h-5" />
                    Diagnose Plant
                  </button>
                </div>
              )}

              {loading && (
                <div className="flex flex-col items-center justify-center flex-1 py-12">
                  <Loader2 className="w-10 h-10 text-green-600 animate-spin mb-4" />
                  <p className="text-slate-600 font-medium animate-pulse">Analyzing plant health...</p>
                  <p className="text-xs text-slate-400 mt-2">Checking for diseases and pests...</p>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex flex-col items-center justify-center text-center my-auto">
                  <AlertCircle className="w-8 h-8 text-red-600 mb-3" />
                  <h4 className="font-medium text-red-900 text-lg">Analysis Failed</h4>
                  <p className="text-red-700 text-sm mt-2 mb-4 max-w-sm">{error}</p>
                  <button 
                    onClick={handleAnalyze} 
                    className="bg-white border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-50 transition-colors shadow-sm"
                  >
                    Try Again
                  </button>
                </div>
              )}

              {analysis && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
                    <div className="w-2 h-8 bg-green-500 rounded-full"></div>
                    <h3 className="text-lg font-bold text-slate-800">Diagnosis Report</h3>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                    <MarkdownRenderer content={analysis} />
                    
                    <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex gap-3">
                      <AlertCircle className="w-5 h-5 text-yellow-600 shrink-0" />
                      <p className="text-xs text-yellow-800 leading-relaxed">
                        <strong>Disclaimer:</strong> This AI-based diagnosis is for informational purposes only. 
                        Accuracy depends on image quality. Always consult with a local agricultural specialist or plant clinic before applying chemical treatments or making significant crop decisions.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlantDoctor;