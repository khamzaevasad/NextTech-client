"use client";

import { useQuery } from "@apollo/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProductSpecs } from "@/lib/types/product/product";
import { GET_FILTER_OPTIONS } from "@/apollo/user/user-query";
import { EmptyState } from "@/components/web/EmptyState";
import { Package } from "lucide-react";
import { LoadingBar } from "@/components/web/LoadingBar";

interface DynamicSpecsProps {
  categoryId: string;
  specs: ProductSpecs;
  setSpecs: (specs: ProductSpecs) => void;
}

// Format spec key to readable label
const formatSpecLabel = (key: string): string => {
  const specialCases: Record<string, string> = {
    cpu: "CPU",
    gpu: "GPU",
    ram: "RAM",
    os: "Operating System",
    ssd: "SSD",
    hdd: "HDD",
    usb: "USB",
    hdmi: "HDMI",
  };

  return (
    specialCases[key] ||
    key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .trim()
  );
};

export function DynamicSpecsFields({
  categoryId,
  specs,
  setSpecs,
}: DynamicSpecsProps) {
  /* -------------------------------------------------------------------------- */
  /*                                APOLLO CLIENT                               */
  /* -------------------------------------------------------------------------- */
  const { data, loading } = useQuery(GET_FILTER_OPTIONS, {
    variables: { categoryId },
    fetchPolicy: "cache-and-network",
    skip: !categoryId,
  });

  const filterKeys = data?.getFilterOptions?.filterKeys || [];

  const handleInputChange = (key: string, value: string) => {
    setSpecs({
      ...specs,
      [key]: value,
    });
  };

  if (loading) {
    return <LoadingBar loading={loading} />;
  }

  if (filterKeys.length === 0) {
    return (
      <EmptyState
        icon={<Package className="h-8 w-8" />}
        title="No specifications available for this category"
      />
    );
  }

  return (
    <div className="space-y-4">
      {filterKeys.map((key: string) => (
        <div key={key} className="space-y-2">
          <Label htmlFor={key} className="text-sm font-medium">
            {formatSpecLabel(key)}
          </Label>
          <Input
            id={key}
            value={specs[key] || ""}
            onChange={(e) => handleInputChange(key, e.target.value)}
            placeholder={`Enter ${formatSpecLabel(key).toLowerCase()}`}
          />
        </div>
      ))}
    </div>
  );
}
