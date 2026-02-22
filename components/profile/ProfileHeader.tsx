"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { API_URL } from "@/lib/config";
import { GridPattern } from "@/components/ui/grid-pattern";
import { T } from "@/lib/types/common";
import { Button, buttonVariants } from "../ui/button";
import {
  Loader2,
  LucideSettings2,
  StoreIcon,
  UserMinus,
  UserPlus,
} from "lucide-react";
import { useFollowMember } from "@/hooks/useFollowMember";
import Link from "next/link";
import { MemberType } from "@/lib/enums/member.enum";
import { cn } from "@/lib/utils";
import { useQuery } from "@apollo/client";
import { GET_MY_STORE } from "@/apollo/user/user-query";

interface ProfileHeaderProps {
  member: T;
  isMe: boolean;
  onFollowChange?: () => void | Promise<void>;
}

export function ProfileHeader({
  member,
  isMe,
  onFollowChange,
}: ProfileHeaderProps) {
  const isFollowing = member?.meFollowed?.[0]?.myFollowing;

  const { subscribeHandler, unsubscribeHandler, isLoading } = useFollowMember({
    onFollowChange,
  });

  /* -------------------------------------------------------------------------- */
  /*                                APOLLO CLIENT                               */
  /* -------------------------------------------------------------------------- */

  const { data: storeData, loading: storeLoading } = useQuery(GET_MY_STORE, {
    variables: { input: member?._id },
    fetchPolicy: "network-only",
    skip: !isMe || member.memberType !== MemberType.SELLER,
  });

  const myStore = storeData?.getMyStore;

  return (
    <div className="relative overflow-hidden rounded-xl border p-8 md:p-12 mb-8 dark:bg-[radial-gradient(85%_30%_at_85%_0%,--theme(--color-foreground/.1),transparent)]">
      <div className="pointer-events-none absolute inset-0 z-0 opacity-20 mask-[radial-gradient(circle_at_center,white,transparent)]">
        <GridPattern className="stroke-border" height={20} width={20} />
      </div>

      <div className="flex items-center justify-between md:flex-row flex-col">
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <Avatar className="h-32 w-32 border-4 border-background shadow-2xl">
            <AvatarImage src={`${API_URL}/${member?.memberImage}`} />
            <AvatarFallback className="bg-pink-500 text-white text-4xl font-bold">
              {member?.memberNick?.charAt(0)}
            </AvatarFallback>
          </Avatar>

          <div className="text-center md:text-left space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              {member?.memberNick}
            </h1>
            <p className="text-muted-foreground max-w-md">
              {member?.memberDesc || ""}
            </p>
            <p className="text-muted-foreground max-w-md">
              {member?.memberType}
            </p>

            <div className="flex flex-wrap justify-center md:justify-start gap-6 pt-4">
              <StatItem label="Articles" value={member?.memberArticles} />
              <StatItem label="Followers" value={member?.memberFollowers} />
              <StatItem label="Following" value={member?.memberFollowings} />
              {/* <StatItem label="Points" value={member?.memberPoints} /> */}
            </div>
          </div>
        </div>

        {!isMe && (
          <div className="flex items-center gap-2 shrink-0  mt-8 sm:mt-0">
            <Button
              disabled={isLoading}
              onClick={() =>
                isFollowing
                  ? unsubscribeHandler(member?._id)
                  : subscribeHandler(member?._id)
              }
              size="sm"
              className={`h-8 px-4 text-xs font-semibold transition-all cursor-pointer ${
                isFollowing
                  ? "bg-pink-600 hover:bg-pink-500"
                  : "bg-blue-600 hover:bg-blue-500 text-white"
              }`}
            >
              {isLoading ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : isFollowing ? (
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
        )}
        {isMe &&
          member.memberType === MemberType.SELLER &&
          !storeLoading &&
          (myStore ? (
            <Link
              href="/dashboard"
              className={cn(
                buttonVariants({ variant: "secondary" }),
                "mt-8 sm:mt-0",
              )}
            >
              <LucideSettings2 /> Manage Store
            </Link>
          ) : (
            <Link
              href="/create-store"
              className={cn(
                buttonVariants({ variant: "secondary" }),
                "bg-pink-600 hover:bg-pink-500 text-white mt-8 sm:mt-0",
              )}
            >
              <StoreIcon /> Create Store
            </Link>
          ))}
      </div>
    </div>
  );
}

function StatItem({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col">
      <span className="text-xl font-bold">{value}</span>
      <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
        {label}
      </span>
    </div>
  );
}
