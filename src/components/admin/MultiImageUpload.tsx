"use client";

import { useState, useRef, useCallback } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";

interface MultiImageUploadProps {
  existingUrls: string[];
  onChangeUrls: (urls: string[]) => void;
  onChangeFiles: (files: File[]) => void;
  pendingFiles: File[];
  maxImages?: number;
}

export default function MultiImageUpload({
  existingUrls,
  onChangeUrls,
  onChangeFiles,
  pendingFiles,
  maxImages = 8,
}: MultiImageUploadProps) {
  const t = useTranslations("admin");
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Drag reorder state
  const dragItem = useRef<number | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  // Combined preview list
  const previews = [
    ...existingUrls.map((url) => ({ type: "existing" as const, src: url })),
    ...pendingFiles.map((file) => ({ type: "pending" as const, src: URL.createObjectURL(file), file })),
  ];

  const totalCount = existingUrls.length + pendingFiles.length;

  const handleFiles = useCallback((files: FileList | File[]) => {
    const remaining = maxImages - totalCount;
    if (remaining <= 0) return;
    const newFiles = Array.from(files).slice(0, remaining);
    onChangeFiles([...pendingFiles, ...newFiles]);
  }, [maxImages, totalCount, pendingFiles, onChangeFiles]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  const removeExisting = (index: number) => {
    onChangeUrls(existingUrls.filter((_, i) => i !== index));
  };

  const removePending = (index: number) => {
    onChangeFiles(pendingFiles.filter((_, i) => i !== index));
  };

  // Reorder within existing URLs
  const handleReorderDragStart = (index: number) => {
    dragItem.current = index;
    setDragIndex(index);
  };

  const handleReorderDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragItem.current === null || dragItem.current === index) return;
    if (index >= existingUrls.length || dragItem.current >= existingUrls.length) return;

    const newUrls = [...existingUrls];
    const dragged = newUrls[dragItem.current];
    newUrls.splice(dragItem.current, 1);
    newUrls.splice(index, 0, dragged);
    dragItem.current = index;
    onChangeUrls(newUrls);
  };

  const handleReorderDragEnd = () => {
    dragItem.current = null;
    setDragIndex(null);
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-dark">
        {t("galleryImages")}
      </label>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragEnter={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
          isDragOver
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/30 hover:bg-background"
        } ${totalCount >= maxImages ? "opacity-50 pointer-events-none" : ""}`}
      >
        <svg className="w-8 h-8 mx-auto mb-2 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="text-sm text-muted">{t("dropImagesHere")}</p>
        <p className="text-xs text-muted mt-1">{t("maxImages", { count: maxImages })} ({totalCount}/{maxImages})</p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          className="hidden"
        />
      </div>

      {/* Preview thumbnails */}
      {previews.length > 0 && (
        <div>
          <p className="text-xs text-muted mb-2">{t("reorderImages")}</p>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
            {previews.map((preview, index) => (
              <div
                key={`${preview.type}-${index}`}
                draggable={preview.type === "existing"}
                onDragStart={() => preview.type === "existing" && handleReorderDragStart(index)}
                onDragOver={(e) => handleReorderDragOver(e, index)}
                onDragEnd={handleReorderDragEnd}
                className={`relative aspect-[3/4] bg-background rounded-lg overflow-hidden border group ${
                  dragIndex === index ? "opacity-50 border-primary" : "border-border"
                }`}
              >
                <Image
                  src={preview.src}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="80px"
                />
                {/* Delete button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (preview.type === "existing") removeExisting(index);
                    else removePending(index - existingUrls.length);
                  }}
                  className="absolute top-1 end-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                {/* Drag handle for existing */}
                {preview.type === "existing" && (
                  <div className="absolute top-1 start-1 w-5 h-5 bg-black/40 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-grab">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                    </svg>
                  </div>
                )}
                {/* New badge */}
                {preview.type === "pending" && (
                  <div className="absolute bottom-1 start-1 px-1.5 py-0.5 bg-primary text-white text-[10px] rounded">
                    NEW
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
