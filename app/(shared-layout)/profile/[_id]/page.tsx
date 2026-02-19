"use client";

import { useParams } from "next/navigation";
import { useQuery, useReactiveVar } from "@apollo/client";
import { userVar } from "@/apollo/store";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  FileText,
  Users,
  UserPlus,
  Clock,
  Settings,
  Heart,
} from "lucide-react";

import { ProfileHeader } from "@/components/my-page/ProfileHeader";
import { AuthGuard } from "@/app/auth/AuthGuard";

import MemberArticle from "@/components/community/MemberArticle";
import RecentlyVisited from "@/components/my-page/Visited";
import WishListPage from "../../wishlist/page";
import { useState } from "react";
import { T } from "@/lib/types/common";
import { GET_MEMBER } from "@/apollo/user/user-query";

export default function ProfilePage() {
  const params = useParams();
  const profileId = params._id as string;
  const user = useReactiveVar(userVar);

  /* -------------------------------------------------------------------------- */
  /*                                APOLLO CLIENT                               */
  /* -------------------------------------------------------------------------- */

  /* -------------------------------------------------------------------------- */
  /*                                APOLLO CLIENT                               */
  /* -------------------------------------------------------------------------- */
  const isMe = profileId === "me" || profileId === user?._id;

  const { data: getMemberData } = useQuery(GET_MEMBER, {
    variables: { input: profileId },
    fetchPolicy: "cache-and-network",
    skip: isMe || !profileId || profileId === "me",
  });

  const member = isMe ? user : getMemberData?.getMember;

  return (
    <AuthGuard>
      <div className="my-8">
        <main>
          <ProfileHeader member={member} isMe={isMe} />

          <Tabs defaultValue="articles" className="w-full">
            <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-md pt-2">
              <TabsList
                variant="line"
                className="w-full justify-start h-auto p-0 bg-transparent gap-8 overflow-x-auto no-scrollbar"
              >
                <TabTrigger
                  value="articles"
                  icon={<FileText size={18} />}
                  label="Articles"
                />

                {isMe && (
                  <TabTrigger
                    value="favorites"
                    icon={<Heart size={18} />}
                    label="My favorites"
                  />
                )}

                {isMe && (
                  <TabTrigger
                    value="visited"
                    icon={<Clock size={18} />}
                    label="Recently Visited"
                  />
                )}

                <TabTrigger
                  value="followers"
                  icon={<Users size={18} />}
                  label="Followers"
                />

                <TabTrigger
                  value="following"
                  icon={<UserPlus size={18} />}
                  label="Following"
                />

                {isMe && (
                  <TabTrigger
                    value="settings"
                    icon={<Settings size={18} />}
                    label="Settings"
                  />
                )}
              </TabsList>

              <Separator className="mt-4" />
            </div>

            <div className="mt-10">
              <TabsContent value="articles">
                <MemberArticle _id={member?._id} />
              </TabsContent>

              {isMe && (
                <TabsContent value="favorites">
                  <WishListPage />
                </TabsContent>
              )}

              {isMe && (
                <TabsContent value="visited">
                  <RecentlyVisited />
                </TabsContent>
              )}

              <TabsContent value="followers">
                <p className="text-muted-foreground italic text-center py-20">
                  followers
                </p>
              </TabsContent>

              <TabsContent value="following">
                <p className="text-muted-foreground italic text-center py-20">
                  following
                </p>
              </TabsContent>

              {isMe && (
                <TabsContent value="settings">
                  <p className="text-muted-foreground italic text-center py-20">
                    settings
                  </p>
                </TabsContent>
              )}
            </div>
          </Tabs>
        </main>
      </div>
    </AuthGuard>
  );
}

function TabTrigger({
  value,
  icon,
  label,
}: {
  value: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <TabsTrigger value={value}>
      <span className="text-pink-500">{icon}</span>
      <span className="font-semibold text-sm">{label}</span>
    </TabsTrigger>
  );
}
