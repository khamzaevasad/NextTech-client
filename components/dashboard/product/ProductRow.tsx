"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { buttonVariants } from "@/components/ui/button";
import { Edit, Package } from "lucide-react";
import { API_URL } from "@/lib/config";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { Product } from "@/lib/types/product/product";
import { useMutation, useReactiveVar } from "@apollo/client";
import { toast } from "sonner";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { userVar } from "@/apollo/store";
import { MemberType } from "@/lib/enums/member.enum";
import { UPDATE_PRODUCTS_BY_ADMIN } from "@/apollo/admin/admin-mutation";

interface ProductRowProps {
  product: Product;
  onUpdate: () => void;
}

export function ProductRow({ product, onUpdate }: ProductRowProps) {
  const user = useReactiveVar(userVar);
  /* -------------------------------------------------------------------------- */
  /*                                APOLLO CLIENT                               */
  /* -------------------------------------------------------------------------- */
  const [updateProduct] = useMutation(UPDATE_PRODUCTS_BY_ADMIN);

  const handleStatusChange = async (newStatus: string) => {
    try {
      await updateProduct({
        variables: {
          input: {
            _id: product._id,
            productStatus: newStatus,
          },
        },
      });
      toast.success(`Status changed to ${newStatus}`);
      onUpdate();
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.log("handleStatusChange error", err.message);
        toast(err.message);
      } else {
        toast("Unexpected error occurred");
      }
    }
  };

  return (
    <TableRow className="group hover:bg-muted/30 transition-colors">
      {/* IMAGE */}
      <TableCell className="hidden md:table-cell">
        <div className="relative size-12 rounded-lg border overflow-hidden bg-muted">
          <Image
            src={`${API_URL}/${product.productImages?.[0]}`}
            alt={product.productName}
            fill
            className="object-cover"
            unoptimized
          />
        </div>
      </TableCell>

      {/* name & price */}
      <TableCell className="font-semibold py-4">
        <div className="flex flex-col">
          <Link
            href={`${product.productStatus === "ACTIVE" ? `/products/${product.productSlug}` : "#"}`}
          >
            {product.productName}
          </Link>
          <span className="text-pink-500 font-bold md:hidden text-xs">
            ${product.productPrice.toLocaleString()}
          </span>
        </div>
      </TableCell>

      {/* Store */}
      {user.memberType === MemberType.ADMIN && (
        <TableCell className="hidden md:table-cell">
          {product.storeData?.storeName}
        </TableCell>
      )}

      {/* PRICE */}
      <TableCell className="text-pink-500 font-bold hidden md:table-cell">
        ${product.productPrice.toLocaleString()}
      </TableCell>

      {/* STOCK */}
      <TableCell className="hidden md:table-cell">
        <div className="flex items-center gap-2">
          <Package size={14} className="text-muted-foreground" />
          <span
            className={
              product.productStock < 10 ? "text-orange-500 font-bold" : ""
            }
          >
            {product.productStock}
          </span>
        </div>
      </TableCell>

      {/* STATUS */}
      <TableCell className="hidden md:table-cell">
        <Select
          defaultValue={product.productStatus}
          onValueChange={handleStatusChange}
        >
          <SelectTrigger
            className={`h-8 w-24 rounded-full text-[10px] font-bold uppercase cursor-pointer ${
              product.productStatus === "PAUSE"
                ? "text-pink-500 border-pink-200"
                : ""
            }`}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="PAUSE">Pause</SelectItem>
            <SelectItem value="DELETED">Delete</SelectItem>
          </SelectContent>
        </Select>
      </TableCell>

      {/* EDIT ICON */}
      {user.memberType === MemberType.SELLER && (
        <TableCell className="text-right">
          <Link
            href={`/dashboard/${product.productSlug}`}
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "rounded-full hover:bg-rose-50 hover:text-pink-500 cursor-pointer",
            )}
          >
            <Edit size={16} />
          </Link>
        </TableCell>
      )}
    </TableRow>
  );
}
