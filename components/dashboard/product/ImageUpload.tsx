"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { X, Upload, ImageIcon } from "lucide-react";
import { API_URL } from "@/lib/config";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  existingImages: string[];
  onExistingImagesChange: (images: string[]) => void;
  newImageFiles: File[];
  onNewImageFilesChange: (files: File[]) => void;
  maxImages?: number;
}

export function ImageUpload({
  existingImages,
  onExistingImagesChange,
  newImageFiles,
  onNewImageFilesChange,
  maxImages = 5,
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const totalImages = existingImages.length + newImageFiles.length;
  const canAddMore = totalImages < maxImages;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const remainingSlots = maxImages - totalImages;
    const filesToAdd = files.slice(0, remainingSlots);

    if (filesToAdd.length === 0) return;

    // Create preview URLs
    const newPreviews = filesToAdd.map((file) => URL.createObjectURL(file));
    setPreviewUrls([...previewUrls, ...newPreviews]);

    // Update files
    onNewImageFilesChange([...newImageFiles, ...filesToAdd]);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeExistingImage = (index: number) => {
    const updated = existingImages.filter((_, i) => i !== index);
    onExistingImagesChange(updated);
  };

  const removeNewImage = (index: number) => {
    const updated = newImageFiles.filter((_, i) => i !== index);
    onNewImageFilesChange(updated);

    // Revoke preview URL
    URL.revokeObjectURL(previewUrls[index]);
    const updatedPreviews = previewUrls.filter((_, i) => i !== index);
    setPreviewUrls(updatedPreviews);
  };

  return (
    <div className="space-y-4">
      {/* Image Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {/* Existing Images */}
        {existingImages.map((image, index) => (
          <div
            key={`existing-${index}`}
            className="relative aspect-square group"
          >
            <div className="relative w-full h-full border rounded-lg overflow-hidden bg-muted">
              <Image
                src={`${API_URL}/${image}`}
                alt={`Product ${index + 1}`}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <button
              type="button"
              onClick={() => removeExistingImage(index)}
              className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}

        {/* (Preview) */}
        {newImageFiles.map((file, index) => (
          <div key={`new-${index}`} className="relative aspect-square group">
            <div className="relative w-full h-full border border-dashed border-primary rounded-lg overflow-hidden bg-muted">
              <Image
                src={previewUrls[index]}
                alt={file.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
              New
            </div>
            <button
              type="button"
              onClick={() => removeNewImage(index)}
              className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}

        {/* Upload Button */}
        {canAddMore && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "aspect-square border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-2 hover:border-primary hover:bg-muted/50 transition-colors",
              "text-muted-foreground hover:text-foreground",
            )}
          >
            <Upload className="h-6 w-6" />
            <span className="text-xs font-medium">Add Image</span>
            <span className="text-[10px] text-muted-foreground">
              {maxImages - totalImages} left
            </span>
          </button>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Info Text */}
      <div className="flex items-start gap-2 text-sm text-muted-foreground">
        <ImageIcon className="h-4 w-4 mt-0.5 flex-shrink-0" />
        <p>
          {totalImages} of {maxImages} images uploaded.
          {!canAddMore && " Maximum reached."}
        </p>
      </div>

      {/* Validation */}
      {totalImages === 0 && (
        <p className="text-sm text-destructive">
          At least one image is required
        </p>
      )}
    </div>
  );
}
