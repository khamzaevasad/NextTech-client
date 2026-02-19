"use client";

import { useReactiveVar } from "@apollo/client";
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
import WishListPage from "../wishlist/page";
import MemberArticle from "@/components/community/MemberArticle";
import RecentlyVisited from "@/components/my-page/Visited";

export default function MyPage() {
  const user = useReactiveVar(userVar);

  return (
    <AuthGuard>
      <div className="my-8">
        <main>
          <ProfileHeader member={user} />

          <Tabs defaultValue="articles" className="w-full">
            <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-md pt-2">
              <TabsList
                variant={"line"}
                className="w-full justify-start h-auto p-0 bg-transparent gap-8 overflow-x-auto no-scrollbar"
              >
                <TabTrigger
                  value="articles"
                  icon={<FileText size={18} />}
                  label="Articles"
                />
                <TabTrigger
                  value="favorites"
                  icon={<Heart size={18} />}
                  label="My favorites"
                />
                <TabTrigger
                  value="visited"
                  icon={<Clock size={18} />}
                  label="Recently Visited"
                />
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
                <TabTrigger
                  value="settings"
                  icon={<Settings size={18} />}
                  label="Settings"
                />
              </TabsList>
              <Separator className="mt-4" />
            </div>

            <div className="mt-10">
              <TabsContent
                value="articles"
                className="animate-in fade-in slide-in-from-bottom-4 duration-500"
              >
                {/*  MyArticles  */}
                <MemberArticle _id={user?._id} />
              </TabsContent>

              <TabsContent
                value="favorites"
                className="animate-in fade-in slide-in-from-bottom-4 duration-500"
              >
                {/*  favorite */}
                <WishListPage />
              </TabsContent>

              <TabsContent
                value="visited"
                className="animate-in fade-in slide-in-from-bottom-4 duration-500"
              >
                <RecentlyVisited />
              </TabsContent>

              <TabsContent
                value="followers"
                className="animate-in fade-in slide-in-from-bottom-4 duration-500"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/*  followers */}
                  <p className="text-muted-foreground italic text-center col-span-full py-20">
                    my followers
                  </p>
                </div>
              </TabsContent>

              <TabsContent
                value="following"
                className="animate-in fade-in slide-in-from-bottom-4 duration-500"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/*  following */}
                  <p className="text-muted-foreground italic text-center col-span-full py-20">
                    my following
                  </p>
                </div>
              </TabsContent>

              <TabsContent
                value="settings"
                className="animate-in fade-in slide-in-from-bottom-4 duration-500"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/*  settings */}
                  <p className="text-muted-foreground italic text-center col-span-full py-20">
                    settings
                  </p>
                </div>
              </TabsContent>
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
