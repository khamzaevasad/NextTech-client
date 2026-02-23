"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { Package, Star, Store } from "lucide-react";
import { API_URL } from "@/lib/config";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation } from "@apollo/client";
import { toast } from "sonner";
import Link from "next/link";
import { UPDATE_STORE_BY_ADMIN } from "@/apollo/admin/admin-mutation";
import { _Store } from "@/lib/types/store/store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";

interface StoreRowProps {
  store: _Store;
  onUpdate: () => void;
}

export function StoreRow({ store, onUpdate }: StoreRowProps) {
  /* -------------------------------------------------------------------------- */
  /*                                APOLLO CLIENT                               */
  /* -------------------------------------------------------------------------- */
  const [updateStore] = useMutation(UPDATE_STORE_BY_ADMIN);

  const handleStatusChange = async (newStatus: string) => {
    try {
      await updateStore({
        variables: {
          input: {
            _id: store._id,
            storeStatus: newStatus,
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
      {/* Store Logo */}
      <TableCell className="w-20">
        <div>
          <Avatar className="h-12 w-12">
            <AvatarImage
              src={`${API_URL}/${store?.storeLogo}`}
              alt={store?.storeName.toUpperCase()}
            />
            <AvatarFallback className="bg-pink-500 text-white">
              <Store className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
        </div>
      </TableCell>

      {/* Store name  */}
      <TableCell className="font-semibold py-4">
        <Link
          className={buttonVariants({ variant: "link" })}
          href={`${store.storeStatus === "ACTIVE" ? `/stores/${store._id}` : "#"} `}
        >
          {store.storeName}
        </Link>
      </TableCell>

      {/* Owner Name */}
      <TableCell className="hidden md:table-cell">
        <div className="flex items-center justify-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={`${API_URL}/${store?.ownerData?.memberImage}`}
              alt={store?.ownerData?.memberNick.toUpperCase()}
            />
            <AvatarFallback className="bg-pink-500 text-white">
              <Store className="h-8 w-8" />
            </AvatarFallback>
          </Avatar>
          {store.ownerData?.memberNick}
        </div>
      </TableCell>

      {/* Store Location */}
      <TableCell className="hidden md:table-cell">
        {store.storeLocation}
      </TableCell>

      {/* Store Rating */}
      <TableCell className="hidden md:table-cell">
        <div className="flex items-center gap-2">
          <Star
            size={14}
            className={
              store.storeRating < 2
                ? "text-gray-500 font-bold"
                : "text-pink-500 font-bold"
            }
          />
          <span>{store.storeRating}</span>
        </div>
      </TableCell>

      {/* Product Count */}
      <TableCell className="hidden md:table-cell">
        <div className="flex items-center gap-2">
          <Package size={14} className={"text-pink-500 font-bold"} />
          <span>{store.storeProductsCount}</span>
        </div>
      </TableCell>

      {/* STATUS */}
      <TableCell className="hidden md:table-cell">
        <Select
          defaultValue={store.storeStatus}
          onValueChange={handleStatusChange}
        >
          <SelectTrigger
            className={`h-8 w-24 rounded-full text-[10px] font-bold uppercase cursor-pointer ${
              store.storeStatus === "BLOCK"
                ? "text-pink-500 border-pink-200"
                : ""
            }`}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="BLOCK">Block</SelectItem>
            <SelectItem value="DELETE">Delete</SelectItem>
          </SelectContent>
        </Select>
      </TableCell>
    </TableRow>
  );
}
