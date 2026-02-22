"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { CreateProductForm } from "@/components/dashboard/product/CreateProduct";

export default function CreateProductPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto max-w-5xl py-8 px-4">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Create New Product</h1>
          <p className="text-sm text-muted-foreground">
            Add a new product to your store
          </p>
        </div>
      </div>

      {/* Form */}
      <CreateProductForm
        onSuccess={() => {
          router.push(`/products`);
        }}
      />
    </div>
  );
}
