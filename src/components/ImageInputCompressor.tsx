import React, { useState, useRef } from 'react';
import { Link, Upload, Trash2, ImageIcon, AlertTriangle, CheckCircle2, RefreshCw, X, FileImage } from 'lucide-react';
import { compressImageFile } from '../utils/imageCompressor';

interface ImageInputCompressorProps {
  label: string;
  value: string;
  onChange: (newValue: string) => void;
  maxDimension?: number;
  quality?: number;
  maxKBLimit?: number;
  placeholder?: string;
  helpText?: string;
}

export const ImageInputCompressor: React.FC<ImageInputCompressorProps> = ({
  label,
  value,
  onChange,
  maxDimension = 800,
  quality = 0.7,
  maxKBLimit = 200,
  placeholder = 'https://images.unsplash.com/...',
  helpText
}) => {
  const [activeMode, setActiveMode] = useState<'url' | 'upload'>('url');
  const [isCompressing, setIsCompressing] = useState(false);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const [imgError, setImgError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Determine size & type indicator
  const isBase64 = value.startsWith('data:image/');
  const isUrl = value.startsWith('http://') || value.startsWith('https://');
  
  let sizeEstimateKB = 0;
  if (isBase64) {
    sizeEstimateKB = Math.round((value.length * 3) / 4 / 1024);
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsCompressing(true);
    setWarningMessage(null);
    setImgError(false);

    try {
      const result = await compressImageFile(file, {
        maxDimension,
        quality,
        maxKBLimit
      });

      onChange(result.dataUrl);
      if (result.warning) {
        setWarningMessage(result.warning);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to compress image file.');
    } finally {
      setIsCompressing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleClear = () => {
    onChange('');
    setWarningMessage(null);
    setImgError(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2 p-3.5 rounded-lg bg-[#191919] border border-[#2C2C2C] text-xs font-mono">
      {/* Header & Mode Selector Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#2C2C2C] pb-2">
        <label className="font-bold text-gray-200 flex items-center gap-1.5 text-xs">
          <ImageIcon className="w-4 h-4 text-[#0EA5E9]" />
          <span>{label}</span>
        </label>

        <div className="flex items-center gap-1 bg-[#121212] p-1 rounded border border-[#2C2C2C]">
          <button
            type="button"
            onClick={() => setActiveMode('url')}
            className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors flex items-center gap-1 ${
              activeMode === 'url'
                ? 'bg-[#0EA5E9] text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Link className="w-3 h-3" />
            <span>Option A: URL</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMode('upload')}
            className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors flex items-center gap-1 ${
              activeMode === 'upload'
                ? 'bg-[#0EA5E9] text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Upload className="w-3 h-3" />
            <span>Option B: Upload</span>
          </button>
        </div>
      </div>

      {/* Mode Controls */}
      {activeMode === 'url' ? (
        <div className="space-y-1.5 pt-1">
          <div className="relative">
            <input
              type="text"
              value={value || ''}
              onChange={(e) => {
                setImgError(false);
                setWarningMessage(null);
                onChange(e.target.value);
              }}
              placeholder={placeholder}
              className="w-full px-3 py-2 rounded bg-[#121212] border border-[#2C2C2C] text-white text-xs font-mono focus:border-[#0EA5E9] outline-none transition-colors"
            />
          </div>
          <p className="text-[10px] text-gray-400">
            Paste hosted URL (Unsplash, Cloudinary, Imgur, GitHub raw). <span className="text-[#0EA5E9]">0 KB IndexedDB footprint</span>.
          </p>
        </div>
      ) : (
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileChange}
              disabled={isCompressing}
              className="hidden"
              id={`file-upload-${label.replace(/\s+/g, '-').toLowerCase()}`}
            />
            <label
              htmlFor={`file-upload-${label.replace(/\s+/g, '-').toLowerCase()}`}
              className={`flex-1 px-3 py-2 rounded border border-dashed border-[#0EA5E9]/50 bg-[#121212] hover:bg-[#1A1A1A] text-gray-300 flex items-center justify-center gap-2 cursor-pointer transition-colors ${
                isCompressing ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isCompressing ? (
                <>
                  <RefreshCw className="w-4 h-4 text-[#0EA5E9] animate-spin" />
                  <span>COMPRESSING IMAGE VIA CANVAS...</span>
                </>
              ) : (
                <>
                  <FileImage className="w-4 h-4 text-[#0EA5E9]" />
                  <span className="font-semibold text-white">SELECT LOCAL IMAGE FILE</span>
                </>
              )}
            </label>
          </div>
          <p className="text-[10px] text-gray-400">
            Auto-compresses via HTML5 Canvas (max {maxDimension}px, WebP/JPEG 0.7 quality, &lt;{maxKBLimit}KB target).
          </p>
        </div>
      )}

      {/* Warning message if file size high */}
      {warningMessage && (
        <div className="p-2 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] flex items-center gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{warningMessage}</span>
        </div>
      )}

      {/* Live Preview Container & Metadata Status */}
      <div className="pt-2 border-t border-[#2C2C2C] flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Live Thumbnail Box */}
          <div className="w-14 h-14 rounded bg-[#121212] border border-[#2C2C2C] overflow-hidden flex items-center justify-center flex-shrink-0 relative group">
            {value && !imgError ? (
              <img
                src={value}
                alt="Live Preview"
                onError={() => setImgError(true)}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="text-center text-gray-600">
                <ImageIcon className="w-6 h-6 mx-auto opacity-40" />
              </div>
            )}
          </div>

          {/* Metadata Indicator Badges */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="text-gray-300 font-bold text-[11px]">LIVE PREVIEW STATUS:</span>
              {value ? (
                imgError ? (
                  <span className="px-1.5 py-0.5 rounded bg-red-500/10 border border-red-500/30 text-red-400 text-[10px] font-bold">
                    INVALID IMAGE
                  </span>
                ) : (
                  <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> READY
                  </span>
                )
              ) : (
                <span className="px-1.5 py-0.5 rounded bg-[#121212] border border-[#2C2C2C] text-gray-400 text-[10px]">
                  NO IMAGE SET
                </span>
              )}
            </div>

            <div className="text-[10px] text-gray-400">
              {isBase64 ? (
                <span className="text-amber-400 font-semibold">
                  Compressed Base64 String (~{sizeEstimateKB} KB)
                </span>
              ) : isUrl ? (
                <span className="text-[#0EA5E9] font-semibold">
                  Direct Remote URL (0 KB IndexedDB)
                </span>
              ) : (
                <span>Default Icon / Empty</span>
              )}
            </div>
          </div>
        </div>

        {/* Clear Image Button */}
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="px-2.5 py-1.5 rounded bg-[#121212] border border-[#2C2C2C] hover:border-red-500/50 text-red-400 hover:text-red-300 transition-colors flex items-center gap-1 text-[11px] flex-shrink-0"
            title="Clear Image"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">CLEAR</span>
          </button>
        )}
      </div>

      {helpText && <p className="text-[10px] text-gray-500 italic pt-1">{helpText}</p>}
    </div>
  );
};
