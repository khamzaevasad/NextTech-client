"use client";

import { useState, useRef } from "react";
import { useMutation } from "@apollo/client";
import { Category } from "@/lib/types/category/category";
import { API_URL } from "@/lib/config";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageOff, Loader2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { CreateCategoryInput } from "@/lib/types/category/category.input";
import { IMAGE_UPLOADER } from "@/apollo/user/user-mutation";

interface CategoryFormModalProps {
  open: boolean;
  category: Category | null;
  parentCategories: Category[];
  onClose: () => void;
  onSubmit: (input: CreateCategoryInput) => void;
}

export function CategoryFormModal({
  open,
  category,
  parentCategories,
  onClose,
  onSubmit,
}: CategoryFormModalProps) {
  const isEdit = !!category;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [categoryName, setCategoryName] = useState(
    category?.categoryName ?? "",
  );
  const [categoryDesc, setCategoryDesc] = useState(
    category?.categoryDesc ?? "",
  );
  const [categoryImage, setCategoryImage] = useState(
    category?.categoryImage ?? "",
  );
  const [parentId, setParentId] = useState(category?.parentId ?? "");
  const [filterKeys, setFilterKeys] = useState<string[]>(
    category?.categoryFilterKeys ?? [],
  );
  const [filterKeyInput, setFilterKeyInput] = useState("");
  const [imageUploading, setImageUploading] = useState(false);

  const [uploadImage] = useMutation(IMAGE_UPLOADER);

  /* ─── Image upload ──────────────────────────────────────────────────────── */
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageUploading(true);
    try {
      const { data } = await uploadImage({
        variables: { file, target: "category" },
      });
      setCategoryImage(data.imageUploader);
      toast.success("Image uploaded");
    } catch (err: unknown) {
      if (err instanceof Error) toast.error(err.message);
      else toast.error("Image upload failed");
    } finally {
      setImageUploading(false);
    }
  };

  /* ─── Filter keys ───────────────────────────────────────────────────────── */
  const addFilterKey = () => {
    const value = filterKeyInput.trim();
    if (value && !filterKeys.includes(value)) {
      setFilterKeys((prev) => [...prev, value]);
    }
    setFilterKeyInput("");
  };

  const handleFilterKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addFilterKey();
    } else if (
      e.key === "Backspace" &&
      filterKeyInput === "" &&
      filterKeys.length > 0
    ) {
      // Backspace
      setFilterKeys((prev) => prev.slice(0, -1));
    }
  };

  const handleFilterKeyRemove = (key: string) => {
    setFilterKeys((prev) => prev.filter((k) => k !== key));
  };

  /* ─── Submit ────────────────────────────────────────────────────────────── */
  const handleSubmit = () => {
    if (!categoryName.trim()) {
      toast.error("Category name is required");
      return;
    }

    // filterKeyInput
    const finalFilterKeys =
      filterKeyInput.trim() && !filterKeys.includes(filterKeyInput.trim())
        ? [...filterKeys, filterKeyInput.trim()]
        : filterKeys;

    const input: CreateCategoryInput = {
      categoryName,
      ...(categoryDesc && { categoryDesc }),
      ...(categoryImage && { categoryImage }),
      ...(parentId && parentId !== "none" && { parentId }),
      ...(finalFilterKeys.length > 0 && {
        categoryFilterKeys: finalFilterKeys,
      }),
    };

    onSubmit(input);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Category" : "Create Category"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* IMAGE UPLOAD */}
          <div className="space-y-1.5">
            <Label>Image</Label>
            <div className="flex items-center gap-4">
              <div className="relative size-20 rounded-lg border overflow-hidden bg-muted flex items-center justify-center shrink-0">
                {categoryImage ? (
                  <Image
                    src={`${API_URL}/${categoryImage}`}
                    alt="preview"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <ImageOff className="size-6 text-muted-foreground" />
                )}
              </div>
              <div className="flex flex-col gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={imageUploading}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {imageUploading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="mr-2 h-4 w-4" />
                  )}
                  {imageUploading ? "Uploading..." : "Upload Image"}
                </Button>
                {categoryImage && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground text-xs h-7"
                    onClick={() => setCategoryImage("")}
                  >
                    Remove
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* NAME */}
          <div className="space-y-1.5">
            <Label htmlFor="categoryName">
              Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="categoryName"
              placeholder="e.g. Monitors"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
            />
          </div>

          {/* DESC */}
          <div className="space-y-1.5">
            <Label htmlFor="categoryDesc">Description</Label>
            <Textarea
              id="categoryDesc"
              placeholder="Short description of this category"
              rows={3}
              value={categoryDesc}
              onChange={(e) => setCategoryDesc(e.target.value)}
            />
          </div>

          {/* PARENT CATEGORY */}
          <div className="space-y-1.5">
            <Label>Parent Category</Label>
            <Select
              value={parentId || "none"}
              onValueChange={(val) => setParentId(val === "none" ? "" : val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="None (Root category)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">
                  <span className="text-muted-foreground">
                    None (Root category)
                  </span>
                </SelectItem>
                {parentCategories
                  .filter((cat) => cat._id !== category?._id)
                  .map((cat) => (
                    <SelectItem key={cat._id} value={cat._id}>
                      {cat.categoryName}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Leave empty to create a root category
            </p>
          </div>

          {/* FILTER KEYS */}
          <div className="space-y-1.5">
            <Label>
              Filter Keys
              {filterKeys.length > 0 && (
                <span className="ml-2 text-xs text-muted-foreground font-normal">
                  {filterKeys.length} added
                </span>
              )}
            </Label>

            {/* Tag list */}
            {filterKeys.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {filterKeys.map((key) => (
                  <span
                    key={key}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted text-sm font-medium"
                  >
                    {key}
                    <button
                      type="button"
                      onClick={() => handleFilterKeyRemove(key)}
                      className="hover:text-destructive transition-colors ml-0.5"
                    >
                      <X className="size-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Input*/}
            <div className="flex gap-2">
              <Input
                placeholder="Type a filter key and press Enter..."
                value={filterKeyInput}
                onChange={(e) => setFilterKeyInput(e.target.value)}
                onKeyDown={handleFilterKeyDown}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addFilterKey}
                disabled={!filterKeyInput.trim()}
              >
                Add
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Press Enter, comma, or click Add. Backspace removes last tag.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={imageUploading}>
            Cancel
          </Button>
          <Button
            className="bg-pink-500 hover:bg-pink-600 text-white"
            onClick={handleSubmit}
            disabled={imageUploading}
          >
            {isEdit ? "Update" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
