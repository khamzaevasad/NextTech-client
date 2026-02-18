"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { API_URL } from "@/lib/config";
import { GridPattern } from "@/components/ui/grid-pattern";
import { T } from "@/lib/types/common";

export function MyProfileHeader({ member }: { member: T }) {
  return (
    <div className="relative overflow-hidden rounded-xl border p-8 md:p-12 mb-8 dark:bg-[radial-gradient(85%_30%_at_85%_0%,--theme(--color-foreground/.1),transparent)]">
      <div className="pointer-events-none absolute inset-0 z-0 opacity-20 mask-[radial-gradient(circle_at_center,white,transparent)]">
        <GridPattern className="stroke-border" height={20} width={20} />
      </div>

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
          <p className="text-muted-foreground max-w-md">{`${member.memberDesc ? member.memberDesc : ""}`}</p>

          <div className="flex flex-wrap justify-center md:justify-start gap-6 pt-4">
            <StatItem label="Articles" value={member?.memberArticles} />
            <StatItem label="Followers" value={member?.memberFollowers} />
            <StatItem label="Following" value={member?.memberFollowings} />
            <StatItem label="Points" value={member?.memberPoints} />
          </div>
        </div>
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
