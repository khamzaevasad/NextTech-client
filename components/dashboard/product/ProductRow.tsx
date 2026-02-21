"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Package, MoreVertical } from "lucide-react";
import { API_URL } from "@/lib/config";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";

export function ProductRow({ product, onUpdate }: any) {
  const handleStatusChange = async (newStatus: string) => {
    // await updateProductStatusMutation({ variables: { id: product._id, status: newStatus } })
    onUpdate();
  };

  return (
    <TableRow className="group hover:bg-muted/30 transition-colors">
      <TableCell className="w-20">
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

      <TableCell className="font-semibold">{product.productName}</TableCell>

      <TableCell className="text-pink-500 font-bold">
        ${product.productPrice.toLocaleString()}
      </TableCell>

      <TableCell>
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

      <TableCell>
        <Select
          defaultValue={product.productStatus}
          onValueChange={handleStatusChange}
        >
          <SelectTrigger className="h-8 w-24 rounded-full text-[10px] font-bold uppercase cursor-pointer">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="PAUSE">Pause</SelectItem>
            <SelectItem value="DELETED">Delete</SelectItem>
          </SelectContent>
        </Select>
      </TableCell>

      <TableCell className="text-right">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full hover:bg-rose-50 hover:text-pink-500 cursor-pointer"
        >
          <Edit size={16} />
        </Button>
      </TableCell>
    </TableRow>
  );
}
