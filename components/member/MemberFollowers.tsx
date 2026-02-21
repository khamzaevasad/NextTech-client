"use client";

import { T } from "@/lib/types/common";
import { MemberFollowCard } from "./MemberFollowCard";
import { ChevronLeft, ChevronRight, Users } from "lucide-react";
import { useQuery } from "@apollo/client";
import { GET_MEMBER_FOLLOWERS } from "@/apollo/user/user-query";
import { useMemo, useState } from "react";
import { Separator } from "../ui/separator";
import { EmptyState } from "../web/EmptyState";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface FollowersListProps {
  _id: string;
}

export function FollowersList({ _id }: FollowersListProps) {
  const [page, setPage] = useState(1);

  const input = useMemo(() => {
    if (!_id) return null;

    return {
      page,
      limit: 10,
      search: {
        followingId: _id,
      },
    };
  }, [_id, page]);

  /* -------------------------------------------------------------------------- */
  /*                                APOLLO CLIENT                               */
  /* -------------------------------------------------------------------------- */

  const { data: getMemberFollowersData, refetch: getMemberFollowersRefetch } =
    useQuery(GET_MEMBER_FOLLOWERS, {
      variables: { input: input },
      fetchPolicy: "network-only",
      skip: !input,
    });

  const followersData = getMemberFollowersData?.getMemberFollowers?.list || [];

  /* -------------------------------------------------------------------------- */
  /*                                  HANDLERS                                  */
  /* -------------------------------------------------------------------------- */

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const totalFollowers =
    getMemberFollowersData?.getMemberFollowers?.[0]?.total ??
    followersData.length;

  const totalPages = Math.ceil(totalFollowers / 10);

  return (
    <div className="my-8">
      {/* List Header */}
      <div>
        <h2 className="text-4xl font-semibold my-6 text-center">Followers</h2>
      </div>

      {/* List items */}
      {followersData.length > 0 ? (
        <div className="grid grid-cols-1">
          <>
            {followersData.map((item: T) => (
              <div key={item._id}>
                <MemberFollowCard
                  data={item}
                  onFollowChange={async () => {
                    await getMemberFollowersRefetch();
                  }}
                />
                <Separator />
              </div>
            ))}
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  disabled={page === 1}
                  onClick={() => handlePageChange(page - 1)}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (p) => (
                    <Button
                      key={p}
                      variant={page === p ? "default" : "outline"}
                      className={cn(
                        "w-10 h-10",
                        page === p && "bg-pink-500 hover:bg-pink-600",
                      )}
                      onClick={() => handlePageChange(p)}
                    >
                      {p}
                    </Button>
                  ),
                )}

                <Button
                  variant="outline"
                  size="icon"
                  disabled={page === totalPages}
                  onClick={() => handlePageChange(page + 1)}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </>
        </div>
      ) : (
        <div className="text-center py-20 bg-accent/10 rounded-3xl border-2 border-dashed">
          <EmptyState
            icon={<Users size={"40"} />}
            title={"Followers not found"}
          />
        </div>
      )}
    </div>
  );
}
