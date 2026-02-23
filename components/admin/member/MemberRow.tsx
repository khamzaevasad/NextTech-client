"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { buttonVariants } from "@/components/ui/button";
import { Edit, User } from "lucide-react";
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
import { cn } from "@/lib/utils";
import { UPDATE_MEMBER_BY_ADMIN } from "@/apollo/admin/admin-mutation";
import { Member } from "@/lib/types/member/member";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface MemberRowProps {
  member: Member;
  onUpdate: () => void;
}

export function MemberRow({ member, onUpdate }: MemberRowProps) {
  /* -------------------------------------------------------------------------- */
  /*                                APOLLO CLIENT                               */
  /* -------------------------------------------------------------------------- */
  const [updateMember] = useMutation(UPDATE_MEMBER_BY_ADMIN);

  const handleStatusChange = async (newStatus: string) => {
    try {
      await updateMember({
        variables: {
          input: {
            _id: member._id,
            memberStatus: newStatus,
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
      <TableCell className="w-20">
        <div>
          <Avatar className="h-12 w-12">
            <AvatarImage
              src={`${API_URL}/${member?.memberImage}`}
              alt={member?.memberNick}
            />
            <AvatarFallback className="bg-pink-500 text-white">
              <User className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
        </div>
      </TableCell>

      {/* memberNick  */}
      <TableCell className="font-semibold py-4">
        <div className="flex flex-col">
          <div>{member.memberNick}</div>
        </div>
      </TableCell>

      {/* memberFullName */}
      <TableCell className="hidden md:table-cell">
        {member.memberFullName ? member.memberFullName : "-"}
      </TableCell>

      {/* memberPhone */}
      <TableCell className="hidden md:table-cell">
        {member.memberPhone}
      </TableCell>

      {/* memberType */}
      <TableCell className="hidden md:table-cell">
        {member.memberType.toLowerCase()}
      </TableCell>

      {/* STATUS */}
      <TableCell className="hidden md:table-cell">
        <Select
          defaultValue={member.memberStatus}
          onValueChange={handleStatusChange}
        >
          <SelectTrigger
            className={`h-8 w-24 rounded-full text-[10px] font-bold uppercase cursor-pointer ${
              member.memberStatus === "BLOCK"
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

      {/* edit icon */}
      <TableCell className="text-right">
        <Link
          href="#"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "rounded-full hover:bg-rose-50 hover:text-pink-500 cursor-pointer",
          )}
        >
          <Edit size={16} />
        </Link>
      </TableCell>
    </TableRow>
  );
}
