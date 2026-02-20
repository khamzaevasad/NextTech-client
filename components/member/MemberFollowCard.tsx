"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { API_URL } from "@/lib/config";
import { FileText, Users, UserPlus, UserMinus } from "lucide-react";
import Link from "next/link";
import { T } from "@/lib/types/common";
import { useReactiveVar } from "@apollo/client";
import { userVar } from "@/apollo/store";

interface MemberFollowCardProps {
  data: T;
}

export function MemberFollowCard({ data }: MemberFollowCardProps) {
  const user = useReactiveVar(userVar);
  const member = data.followingData || data.followerData;
  const isFollowing = data.meFollowed?.[0]?.myFollowing;

  return (
    <div className="flex items-center justify-between px-5 py-4 rounded-2xl transition-all duration-200 gap-4">
      {/* Left — avatar + info */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="relative shrink-0">
          <Avatar className="size-11">
            <AvatarImage
              src={`${API_URL}/${member?.memberImage}`}
              alt={member?.memberNick}
            />
            <AvatarFallback className="bg-pink-600 text-white text-sm font-semibold">
              {member?.memberNick?.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <Link
              href={
                member?._id === user._id
                  ? "/profile/me"
                  : `/profile/${member?._id}`
              }
              className="font-semibold text-sm text-primary transition-colors truncate"
            >
              {member?.memberNick}
            </Link>
          </div>
          <p className="text-xs text-neutral-400 truncate max-w-45 mt-0.5">
            {member?.memberDesc || ""}
          </p>
        </div>
      </div>

      {/* Middle — stats */}
      <div className="hidden md:flex items-center gap-6">
        <Stat
          icon={<FileText size={12} />}
          label="Articles"
          value={member?.memberArticles}
        />
        <Stat
          icon={<Users size={12} />}
          label="Followers"
          value={member?.memberFollowers}
        />
        <Stat
          icon={<UserPlus size={12} />}
          label="Following"
          value={member?.memberFollowings}
        />
      </div>

      {/* Right — actions */}
      <div className="flex items-center gap-2 shrink-0">
        <Button
          size="sm"
          className={`h-8 px-4 text-xs font-semibold transition-all cursor-pointer ${
            isFollowing
              ? "bg-pink-600 hover:bg-pink-500"
              : "bg-blue-600 hover:bg-blue-500 text-white"
          }`}
        >
          {isFollowing ? (
            <span className="flex items-center gap-1.5">
              <UserMinus size={12} /> Unfollow
            </span>
          ) : (
            <span className="flex items-center gap-1.5">
              <UserPlus size={12} /> Follow
            </span>
          )}
        </Button>
      </div>
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <div className="flex items-center gap-1">
        {icon}
        <span className="text-[10px] font-medium uppercase tracking-wide">
          {label}
        </span>
      </div>
      <span className="text font-semibold">{value}</span>
    </div>
  );
}
