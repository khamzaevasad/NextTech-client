import { T } from "@/lib/types/common";
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
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import MemberArticle from "@/components/community/MemberArticle";
import RecentlyVisited from "@/components/profile/Visited";
import WishListPage from "@/app/(shared-layout)/wishlist/page";
import { FollowersList } from "../member/MemberFollowers";
import { FollowingsList } from "../member/MemberFollowings";

interface ProfileContentProps {
  member: T;
  isMe: boolean;
}

export default function ProfileContent({ member, isMe }: ProfileContentProps) {
  return (
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
              <FollowersList _id={member?._id} />
            </TabsContent>

            <TabsContent value="following">
              <FollowingsList _id={member?._id} />
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
