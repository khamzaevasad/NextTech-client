"use client";

import { useParams } from "next/navigation";
import { useQuery, useReactiveVar } from "@apollo/client";
import { userVar } from "@/apollo/store";
import { AuthGuard } from "@/app/auth/AuthGuard";
import { GET_MEMBER } from "@/apollo/user/user-query";
import ProfileContent from "@/components/profile/ProfileContent";

export default function ProfilePage() {
  const params = useParams();
  const profileId = params._id as string;
  const user = useReactiveVar(userVar);

  /* -------------------------------------------------------------------------- */
  /*                                APOLLO CLIENT                               */
  /* -------------------------------------------------------------------------- */
  const isMe = profileId === "me" || profileId === user?._id;

  const { data: getMemberData, refetch: getMemberRefetch } = useQuery(
    GET_MEMBER,
    {
      variables: { input: profileId },
      fetchPolicy: "cache-and-network",
      skip: isMe || !profileId || profileId === "me",
    },
  );

  const member = isMe ? user : getMemberData?.getMember;
  const handleRefetch = async () => {
    await getMemberRefetch();
  };

  if (isMe) {
    return (
      <AuthGuard>
        <ProfileContent onRefetch={handleRefetch} member={member} isMe={isMe} />
      </AuthGuard>
    );
  }

  return (
    <ProfileContent onRefetch={handleRefetch} member={member} isMe={isMe} />
  );
}
