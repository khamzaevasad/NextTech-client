"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ProductSpecs } from "@/lib/types/product/product";
import { CREATE_PRODUCT, IMAGES_UPLOADER } from "@/apollo/user/user-mutation";
import { GET_CATEGORIES } from "@/apollo/user/user-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUpload } from "./ImageUpload";
import { DynamicSpecsFields } from "./DynamicSpecsFields";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CategorySelector } from "./CategorySelector";

interface CreateProductFormProps {
  onSuccess?: () => void;
}

export function CreateProductForm({ onSuccess }: CreateProductFormProps) {
  /* -------------------------------------------------------------------------- */
  /*                                APOLLO CLIENT                               */
  /* -------------------------------------------------------------------------- */

  const [createProduct, { loading: createLoading }] =
    useMutation(CREATE_PRODUCT);
  const [uploadImages, { loading: uploadLoading }] =
    useMutation(IMAGES_UPLOADER);

  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [categoryHasFilterKeys, setCategoryHasFilterKeys] =
    useState<boolean>(false);

  const [formData, setFormData] = useState({
    productName: "",
    productBrand: "",
    productPrice: 0,
    productStock: 0,
    productDesc: "",
  });

  const [specs, setSpecs] = useState<ProductSpecs>({});
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const { data: categoriesData, loading: categoriesLoading } = useQuery(
    GET_CATEGORIES,
    {
      variables: {
        input: {
          page: 1,
          limit: 100,
          direction: "ASC",
          search: {},
        },
      },
    },
  );

  const handleCategorySelect = (categoryId: string, hasFilterKeys: boolean) => {
    setSelectedCategory(categoryId);
    setCategoryHasFilterKeys(hasFilterKeys);
    setSpecs({});
  };

  /* -------------------------------------------------------------------------- */
  /*                                VALIDATE FORM                               */
  /* -------------------------------------------------------------------------- */

  const validateForm = (): boolean => {
    if (!formData.productName.trim()) {
      toast.error("Product name is required");
      return false;
    }

    if (!formData.productBrand.trim()) {
      toast.error("Brand is required");
      return false;
    }

    if (formData.productPrice <= 0) {
      toast.error("Price must be greater than 0");
      return false;
    }

    if (formData.productStock < 0) {
      toast.error("Stock cannot be negative");
      return false;
    }

    if (!formData.productDesc.trim() || formData.productDesc.length < 5) {
      toast.error("Description must be at least 5 characters");
      return false;
    }

    if (!selectedCategory) {
      toast.error("Please select a category");
      return false;
    }

    if (!categoryHasFilterKeys) {
      toast.error("Please select a valid child category with specifications");
      return false;
    }

    if (imageFiles.length === 0) {
      toast.error("At least one image is required");
      return false;
    }

    if (imageFiles.length > 5) {
      toast.error("Maximum 5 images allowed");
      return false;
    }

    return true;
  };

  /* ------------------------------ handleSubmit ------------------------------ */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      //  Upload images
      const { data: uploadData } = await uploadImages({
        variables: {
          files: imageFiles,
          target: "products",
        },
      });

      const uploadedImageUrls = uploadData?.imagesUploader || [];

      if (uploadedImageUrls.length === 0) {
        throw new Error("Image upload failed");
      }

      // Create product
      await createProduct({
        variables: {
          input: {
            productName: formData.productName,
            productBrand: formData.productBrand,
            productPrice: formData.productPrice,
            productStock: formData.productStock,
            productDesc: formData.productDesc,
            productCategory: selectedCategory,
            productImages: uploadedImageUrls,
            productSpecs: specs,
          },
        },
      });

      toast.success("Product created successfully!");

      if (onSuccess) {
        onSuccess();
      }

      // Reset form
      setFormData({
        productName: "",
        productBrand: "",
        productPrice: 0,
        productStock: 0,
        productDesc: "",
      });
      setSelectedCategory("");
      setSpecs({});
      setImageFiles([]);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.log("handleSubmit error", err.message);
        toast.error(err.message);
      } else {
        toast.error("Failed to create product");
      }
    }
  };

  const isLoading = createLoading || uploadLoading || categoriesLoading;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Category Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Category</CardTitle>
          <p className="text-sm text-muted-foreground">
            Choose a category with specifications
          </p>
        </CardHeader>
        <CardContent>
          {categoriesLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : (
            <CategorySelector
              categories={categoriesData?.getCategories?.list || []}
              selectedCategory={selectedCategory}
              onSelect={handleCategorySelect}
            />
          )}

          {selectedCategory && !categoryHasFilterKeys && (
            <Alert className="mt-4" variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                This category has no specifications. Please select a child
                category.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="productName">
                Product Name <span className="text-destructive">*</span>
              </Label>
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
              <Label htmlFor="productBrand">
                Brand <span className="text-destructive">*</span>
              </Label>
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
              <Label htmlFor="productPrice">
                Price ($) <span className="text-destructive">*</span>
              </Label>
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
              <Label htmlFor="productStock">
                Stock <span className="text-destructive">*</span>
              </Label>
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
            <Label htmlFor="productDesc">
              Description <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="productDesc"
              value={formData.productDesc}
              onChange={(e) =>
                setFormData({ ...formData, productDesc: e.target.value })
              }
              placeholder="Enter product description (minimum 5 characters)"
              rows={4}
              required
            />
          </div>
        </CardContent>
      </Card>

      {/* Product Images */}
      <Card>
        <CardHeader>
          <CardTitle>Product Images</CardTitle>
          <p className="text-sm text-muted-foreground">
            Upload 1-5 images <span className="text-destructive">*</span>
          </p>
        </CardHeader>
        <CardContent>
          <ImageUpload
            existingImages={[]}
            onExistingImagesChange={() => {}}
            newImageFiles={imageFiles}
            onNewImageFilesChange={setImageFiles}
            maxImages={5}
          />
        </CardContent>
      </Card>

      {/* Technical Specifications */}
      {selectedCategory && categoryHasFilterKeys && (
        <Card>
          <CardHeader>
            <CardTitle>Technical Specifications</CardTitle>
            <p className="text-sm text-muted-foreground">
              Fill in product specifications
            </p>
          </CardHeader>
          <CardContent>
            <DynamicSpecsFields
              categoryId={selectedCategory}
              specs={specs}
              setSpecs={setSpecs}
            />
          </CardContent>
        </Card>
      )}

      {/* Submit Button */}
      <div className="flex justify-end gap-3">
        <Button
          type="submit"
          disabled={isLoading || !categoryHasFilterKeys}
          className="min-w-[140px]"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            "Create Product"
          )}
        </Button>
      </div>
    </form>
  );
}
