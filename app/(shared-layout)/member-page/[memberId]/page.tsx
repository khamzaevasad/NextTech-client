"use client";

import { GET_MEMBER } from "@/apollo/user/user-query";
import { ProfileHeader } from "@/components/my-page/ProfileHeader";
import { useQuery } from "@apollo/client";
import { use } from "react";

interface MemberPageProps {
  params: Promise<{ memberId: string }>;
}

export default function MemberPage({ params }: MemberPageProps) {
  const { memberId } = use(params);
  /* -------------------------------------------------------------------------- */
  /*                                APOLLO CLIENT                               */
  /* -------------------------------------------------------------------------- */

  const { data: getMemberData } = useQuery(GET_MEMBER, {
    variables: { input: memberId },
    fetchPolicy: "cache-and-network",
    skip: !memberId,
  });

  console.log("getMemberData", getMemberData);

  const member = getMemberData?.getMember;

  return (
    <div className="my-8">
      <main>
        <ProfileHeader member={member} />
      </main>
    </div>
  );
}
