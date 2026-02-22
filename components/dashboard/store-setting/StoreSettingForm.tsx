"use client";

import { useState, useRef } from "react";
import { useMutation } from "@apollo/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { UPDATE_STORE, IMAGE_UPLOADER } from "@/apollo/user/user-mutation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Upload, X } from "lucide-react";
import Image from "next/image";
import { API_URL } from "@/lib/config";
import { _Store } from "@/lib/types/store/store";

interface StoreSettingsFormProps {
  store: _Store;
  onSuccess?: () => void;
}

export function StoreSettingsForm({
  store,
  onSuccess,
}: StoreSettingsFormProps) {
  const [updateStore, { loading: updateLoading }] = useMutation(UPDATE_STORE);
  const [uploadLogo, { loading: uploadLoading }] = useMutation(IMAGE_UPLOADER);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    storeName: store.storeName || "",
    storeDesc: store.storeDesc || "",
    storePhone: store.storePhone || "",
    storeAddress: store.storeAddress || "",
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>(
    store.storeLogo ? `${API_URL}/${store.storeLogo}` : "",
  );
  const [currentLogo, setCurrentLogo] = useState<string>(store.storeLogo || "");

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }

      // Validate image size
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }

      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setLogoFile(null);
    setLogoPreview(currentLogo ? `${API_URL}/${currentLogo}` : "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const validateForm = (): boolean => {
    if (!formData.storeName.trim()) {
      toast.error("Store name is required");
      return false;
    }

    if (formData.storeDesc && formData.storeDesc.length < 6) {
      toast.error("Description must be at least 6 characters");
      return false;
    }

    if (formData.storeDesc && formData.storeDesc.length > 500) {
      toast.error("Description must not exceed 500 characters");
      return false;
    }

    if (
      formData.storePhone &&
      (formData.storePhone.length < 3 || formData.storePhone.length > 12)
    ) {
      toast.error("Phone number must be between 3-12 characters");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      let uploadedLogoUrl = currentLogo;

      // Upload new logo
      if (logoFile) {
        const { data: uploadData } = await uploadLogo({
          variables: {
            file: logoFile,
            target: "stores",
          },
        });

        uploadedLogoUrl = uploadData?.imageUploader || currentLogo;
      }

      await updateStore({
        variables: {
          input: {
            storeName: formData.storeName,
            storeDesc: formData.storeDesc || undefined,
            storePhone: formData.storePhone || undefined,
            storeLogo: uploadedLogoUrl || undefined,
            storeAddress: formData.storeAddress || undefined,
          },
        },
      });

      toast.success("Store updated successfully!");
      setCurrentLogo(uploadedLogoUrl);
      setLogoFile(null);

      if (onSuccess) {
        onSuccess();
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.log("handleSubmit error", err.message);
        toast.error(err.message);
      } else {
        toast.error("Failed to update store");
      }
    }
  };

  const isLoading = updateLoading || uploadLoading;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Store Logo */}
      <Card>
        <CardHeader>
          <CardTitle>Store Logo</CardTitle>
          <p className="text-sm text-muted-foreground">
            Upload your store logo (max 5MB)
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-4">
            {/* Logo Preview */}
            <div className="relative">
              {logoPreview ? (
                <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-muted">
                  <Image
                    src={logoPreview}
                    alt="Store logo"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  {logoFile && (
                    <button
                      type="button"
                      onClick={removeLogo}
                      className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1.5 shadow-md hover:bg-destructive/90"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ) : (
                <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center border-4 border-dashed">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
            </div>

            {/* Upload Button */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
            >
              {logoPreview ? "Change Logo" : "Upload Logo"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="storeName">
              Store Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="storeName"
              value={formData.storeName}
              onChange={(e) =>
                setFormData({ ...formData, storeName: e.target.value })
              }
              placeholder="Enter store name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="storePhone">Store Phone</Label>
            <Input
              id="storePhone"
              type="tel"
              value={formData.storePhone}
              onChange={(e) =>
                setFormData({ ...formData, storePhone: e.target.value })
              }
              placeholder="+1 234 567 8900"
              maxLength={12}
            />
            <p className="text-xs text-muted-foreground">3-12 characters</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="storeAddress">Store Address</Label>
            <Input
              id="storeAddress"
              value={formData.storeAddress}
              onChange={(e) =>
                setFormData({ ...formData, storeAddress: e.target.value })
              }
              placeholder="Enter Store Address"
              maxLength={30}
            />
            <p className="text-xs text-muted-foreground">3-12 characters</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="storeDesc">Description</Label>
            <Textarea
              id="storeDesc"
              value={formData.storeDesc}
              onChange={(e) =>
                setFormData({ ...formData, storeDesc: e.target.value })
              }
              placeholder="Describe your store (6-500 characters)"
              rows={4}
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground">
              {formData.storeDesc.length}/500 characters
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end gap-3">
        <Button type="submit" disabled={isLoading} className="min-w-[140px]">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </form>
  );
}
