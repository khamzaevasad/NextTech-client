"use client";

import { T } from "@/lib/types/common";
import { MemberFollowCard } from "./MemberFollowCard";
import { ChevronLeft, ChevronRight, Users } from "lucide-react";
import { useQuery } from "@apollo/client";
import { GET_MEMBER_FOLLOWINGS } from "@/apollo/user/user-query";
import { useMemo, useState } from "react";
import { Separator } from "../ui/separator";
import { EmptyState } from "../web/EmptyState";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface FollowingsListProps {
  _id: string;
}

export function FollowingsList({ _id }: FollowingsListProps) {
  const [page, setPage] = useState(1);

  const input = useMemo(() => {
    if (!_id) return null;

    return {
      page,
      limit: 10,
      search: {
        followerId: _id,
      },
    };
  }, [_id, page]);

  /* -------------------------------------------------------------------------- */
  /*                                APOLLO CLIENT                               */
  /* -------------------------------------------------------------------------- */

  const { data: getMemberFollowingsData } = useQuery(GET_MEMBER_FOLLOWINGS, {
    variables: { input: input },
    fetchPolicy: "network-only",
    skip: !input,
  });

  const followingsData =
    getMemberFollowingsData?.getMemberFollowings?.list || [];

  /* -------------------------------------------------------------------------- */
  /*                                  HANDLERS                                  */
  /* -------------------------------------------------------------------------- */

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const totalFollowers =
    getMemberFollowingsData?.getMemberFollowings?.[0]?.total ??
    followingsData.length;

  const totalPages = Math.ceil(totalFollowers / 10);

  return (
    <div className="my-8">
      {/* List Header */}
      <div>
        <h2 className="text-4xl font-semibold my-6 text-center">Followings</h2>
      </div>

      {/* List items */}
      {followingsData.length > 0 ? (
        <div className="grid grid-cols-1">
          <>
            {followingsData.map((item: T) => (
              <>
                <MemberFollowCard key={item._id} data={item} />
                <Separator />
              </>
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
            title={"Followings not found"}
          />
        </div>
      )}
    </div>
  );
}
