"use client";

import { useEffect, useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import Button from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

interface StorageFile {
  name: string;
  url: string;
  size: number;
  created_at: string;
  isUsed: boolean;
}

export default function AdminImagesPage() {
  const [files, setFiles] = useState<StorageFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [totalSize, setTotalSize] = useState(0);
  const t = useTranslations("admin");
  const toast = useToast();

  const loadImages = useCallback(async () => {
    const supabase = createClient();

    // Get storage files
    const { data: storageFiles } = await supabase.storage
      .from("product-images")
      .list("", { limit: 200, sortBy: { column: "created_at", order: "desc" } });

    // Get gallery folder files
    const { data: galleryFiles } = await supabase.storage
      .from("product-images")
      .list("gallery", { limit: 200, sortBy: { column: "created_at", order: "desc" } });

    // Get used URLs from products and banners
    const [{ data: products }, { data: banners }] = await Promise.all([
      supabase.from("products").select("image_url, gallery_urls"),
      supabase.from("banners").select("image_url"),
    ]);

    const usedUrls = new Set<string>();
    (products || []).forEach((p) => {
      if (p.image_url) usedUrls.add(p.image_url);
      (p.gallery_urls || []).forEach((u: string) => usedUrls.add(u));
    });
    (banners || []).forEach((b) => {
      if (b.image_url) usedUrls.add(b.image_url);
    });

    const allFiles: StorageFile[] = [];
    let size = 0;

    const processFile = (file: { name: string; created_at: string | null; metadata?: { size?: number } | null }, prefix: string) => {
      if (file.name === ".emptyFolderPlaceholder") return;
      const path = prefix ? `${prefix}/${file.name}` : file.name;
      const { data: urlData } = supabase.storage.from("product-images").getPublicUrl(path);
      const fileSize = file.metadata?.size || 0;
      size += fileSize;
      allFiles.push({
        name: path,
        url: urlData.publicUrl,
        size: fileSize,
        created_at: file.created_at || "",
        isUsed: usedUrls.has(urlData.publicUrl),
      });
    };

    (storageFiles || []).forEach((f) => processFile(f, ""));
    (galleryFiles || []).forEach((f) => processFile(f, "gallery"));

    setFiles(allFiles);
    setTotalSize(size);
    setLoading(false);
  }, []);

  useEffect(() => {
     
    loadImages();
  }, [loadImages]);

  const deleteFile = useCallback(async (name: string) => {
    if (!confirm(t("confirmDelete"))) return;
    setDeleting(name);
    try {
      const supabase = createClient();
      await supabase.storage.from("product-images").remove([name]);
      setFiles((prev) => prev.filter((f) => f.name !== name));
      toast.showToast(t("imageDeleted"), "success");
    } catch {
      toast.showToast(t("saveError"), "error");
    } finally {
      setDeleting(null);
    }
  }, [t, toast]);

  const deleteUnused = useCallback(async () => {
    const unused = files.filter((f) => !f.isUsed);
    if (unused.length === 0) return;
    if (!confirm(t("confirmDeleteUnused").replace("{count}", String(unused.length)))) return;

    const supabase = createClient();
    const names = unused.map((f) => f.name);
    await supabase.storage.from("product-images").remove(names);
    setFiles((prev) => prev.filter((f) => f.isUsed));
    toast.showToast(t("unusedDeleted"), "success");
  }, [files, t, toast]);

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const unusedCount = files.filter((f) => !f.isUsed).length;

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-9 w-40 bg-border/40 rounded-lg animate-pulse mb-8" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-square bg-border/30 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-dark">{t("imageManager")}</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted">
            {files.length} {t("images")} · {formatSize(totalSize)}
          </span>
          {unusedCount > 0 && (
            <Button variant="ghost" onClick={deleteUnused}>
              {t("deleteUnused")} ({unusedCount})
            </Button>
          )}
        </div>
      </div>

      {files.length === 0 ? (
        <div className="text-center py-20 text-muted">
          <svg className="w-16 h-16 mx-auto mb-4 text-border" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p>{t("noImages")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {files.map((file) => (
            <div
              key={file.name}
              className={`group relative bg-surface border rounded-xl overflow-hidden ${
                file.isUsed ? "border-border" : "border-amber-300/50"
              }`}
            >
              <div className="aspect-square relative bg-background">
                <Image
                  src={file.url}
                  alt={file.name}
                  fill
                  className="object-contain"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                />
                {!file.isUsed && (
                  <span className="absolute top-2 start-2 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                    {t("unused")}
                  </span>
                )}
              </div>
              <div className="p-2.5">
                <p className="text-xs text-dark truncate font-medium" dir="ltr">{file.name}</p>
                <p className="text-xs text-muted">{formatSize(file.size)}</p>
              </div>
              <div className="absolute inset-0 bg-dark/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  onClick={() => deleteFile(file.name)}
                  disabled={deleting === file.name}
                  className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors cursor-pointer"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
