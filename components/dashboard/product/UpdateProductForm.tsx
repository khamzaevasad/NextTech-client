"use client";

import { useState } from "react";
import { useMutation } from "@apollo/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Product, ProductSpecs } from "@/lib/types/product/product";
import { UPDATE_PRODUCT, IMAGES_UPLOADER } from "@/apollo/user/user-mutation";
import { DynamicSpecsFields } from "./DynamicSpecsFields";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { ImageUpload } from "./ImageUpload";

interface UpdateProductFormProps {
  initialData: Product;
  onSuccess?: () => void;
}

export function UpdateProductForm({
  initialData,
  onSuccess,
}: UpdateProductFormProps) {
  /* -------------------------------------------------------------------------- */
  /*                                APOLLO CLIENT                               */
  /* -------------------------------------------------------------------------- */
  const [updateProduct, { loading: updateLoading }] =
    useMutation(UPDATE_PRODUCT);
  const [uploadImages, { loading: uploadLoading }] =
    useMutation(IMAGES_UPLOADER);

  const [formData, setFormData] = useState({
    productName: initialData.productName,
    productBrand: initialData.productBrand,
    productPrice: initialData.productPrice,
    productStock: initialData.productStock,
    productDesc: initialData.productDesc,
  });

  const [specs, setSpecs] = useState<ProductSpecs>(
    initialData.productSpecs || {},
  );

  const [existingImages, setExistingImages] = useState<string[]>(
    initialData.productImages || [],
  );

  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let uploadedImageUrls: string[] = [];

      // Upload new images
      if (newImageFiles.length > 0) {
        toast.info("Uploading images...");

        const { data: uploadData } = await uploadImages({
          variables: {
            files: newImageFiles,
            target: "products",
          },
        });

        uploadedImageUrls = uploadData?.imagesUploader || [];
      }

      // Combine existing + new images (max 5)
      const allImages = [...existingImages, ...uploadedImageUrls].slice(0, 5);

      // Update product
      await updateProduct({
        variables: {
          input: {
            _id: initialData._id,
            productName: formData.productName,
            productBrand: formData.productBrand,
            productPrice: formData.productPrice,
            productStock: formData.productStock,
            productDesc: formData.productDesc,
            productImages: allImages,
            productSpecs: specs,
          },
        },
      });

      toast.success("Product updated successfully!");

      if (onSuccess) {
        onSuccess();
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.log("handleUpdate error", err.message);
        toast.error(err.message);
      } else {
        toast.error("Unexpected error occurred");
      }
    }
  };

  const isLoading = updateLoading || uploadLoading;

  return (
    <form onSubmit={handleUpdate} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="productName">Product Name</Label>
              <Input
                id="productName"
                value={formData.productName}
                onChange={(e) =>
                  setFormData({ ...formData, productName: e.target.value })
                }
                placeholder="Enter product name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="productBrand">Brand</Label>
              <Input
                id="productBrand"
                value={formData.productBrand}
                onChange={(e) =>
                  setFormData({ ...formData, productBrand: e.target.value })
                }
                placeholder="Enter brand name"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="productPrice">Price ($)</Label>
              <Input
                id="productPrice"
                type="number"
                min="0"
                step="0.01"
                value={formData.productPrice}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    productPrice: Number(e.target.value),
                  })
                }
                placeholder="0.00"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="productStock">Stock</Label>
              <Input
                id="productStock"
                type="number"
                min="0"
                value={formData.productStock}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    productStock: Number(e.target.value),
                  })
                }
                placeholder="0"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="productDesc">Description</Label>
            <Textarea
              id="productDesc"
              value={formData.productDesc}
              onChange={(e) =>
                setFormData({ ...formData, productDesc: e.target.value })
              }
              placeholder="Enter product description"
              rows={4}
              required
            />
          </div>
        </CardContent>
      </Card>

      {/* Images */}
      <Card>
        <CardHeader>
          <CardTitle>Product Images</CardTitle>
          <p className="text-sm text-muted-foreground">
            Upload up to 5 images (total)
          </p>
        </CardHeader>
        <CardContent>
          <ImageUpload
            existingImages={existingImages}
            onExistingImagesChange={setExistingImages}
            newImageFiles={newImageFiles}
            onNewImageFilesChange={setNewImageFiles}
            maxImages={5}
          />
        </CardContent>
      </Card>

      {/* Technical Specifications */}
      <Card>
        <CardHeader>
          <CardTitle>Technical Specifications</CardTitle>
          <p className="text-sm text-muted-foreground">
            Update specification values
          </p>
        </CardHeader>
        <CardContent>
          <DynamicSpecsFields
            categoryId={initialData.productCategory}
            specs={specs}
            setSpecs={setSpecs}
          />
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
            "Update Product"
          )}
        </Button>
      </div>
    </form>
  );
}
