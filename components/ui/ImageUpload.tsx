"use client";

import { useCallback, useRef, useState } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

interface ImageUploadProps {
  value?: string | null;
  onChange: (file: File | null) => void;
  className?: string;
}

export default function ImageUpload({
  value,
  onChange,
  className = "",
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(value ?? null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateAndSet = useCallback(
    (file: File) => {
      setError(null);

      if (!ALLOWED_TYPES.includes(file.type)) {
        setError("Only JPEG, PNG, and WebP images are allowed");
        return;
      }

      if (file.size > MAX_SIZE) {
        setError("Image must be under 5 MB");
        return;
      }

      const url = URL.createObjectURL(file);
      setPreview(url);
      onChange(file);
    },
    [onChange]
  );

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) validateAndSet(file);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) validateAndSet(file);
  }

  function handleRemove() {
    setPreview(null);
    setError(null);
    onChange(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className={className}>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 ${
          dragActive
            ? "border-cobalt bg-cobalt/5"
            : "border-slate-300 hover:border-cobalt/50 hover:bg-slate-50"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ALLOWED_TYPES.join(",")}
          onChange={handleChange}
          className="hidden"
        />

        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="max-h-48 mx-auto rounded-xl object-contain shadow-sm"
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleRemove();
              }}
              className="absolute top-2 right-2 w-7 h-7 bg-slate-900/70 text-white rounded-full flex items-center justify-center hover:bg-alert transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-slate-500">
            {dragActive ? (
              <Upload className="w-8 h-8 text-cobalt" />
            ) : (
              <ImageIcon className="w-8 h-8 text-slate-400" />
            )}
            <p className="text-sm font-medium text-slate-700">
              {dragActive
                ? "Drop image here"
                : "Drag & drop or click to upload"}
            </p>
            <p className="text-xs text-slate-400">
              JPEG, PNG, or WebP — max 5 MB
            </p>
          </div>
        )}
      </div>

      {error && (
        <p className="text-alert text-xs mt-2 font-medium">{error}</p>
      )}
    </div>
  );
}
