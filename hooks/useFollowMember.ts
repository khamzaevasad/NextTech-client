"use client";

import { useMutation, useReactiveVar } from "@apollo/client";
import { SUBSCRIBE, UN_SUBSCRIBE } from "@/apollo/user/user-mutation";
import { userVar } from "@/apollo/store";
import { toast } from "sonner";
import { Messages } from "@/lib/config";
import { useState } from "react";

interface UseFollowMemberProps {
  onFollowChange?: () => void | Promise<void>;
}

export function useFollowMember({ onFollowChange }: UseFollowMemberProps = {}) {
  const user = useReactiveVar(userVar);
  const [isProcessing, setIsProcessing] = useState(false); //
  const [subscribe] = useMutation(SUBSCRIBE);
  const [unsubscribe] = useMutation(UN_SUBSCRIBE);

  const subscribeHandler = async (memberId: string) => {
    if (isProcessing) return;

    try {
      setIsProcessing(true);

      if (!memberId) throw new Error(Messages.error1);
      if (!user._id) throw new Error(Messages.error2);

      await subscribe({ variables: { input: memberId } });
      toast.success("Subscribed");

      if (onFollowChange) {
        await onFollowChange();
      }
    } catch (err) {
      if (err instanceof Error) {
        console.log("subscribe error", err.message);
        toast.error(err.message);
      } else {
        toast.error("Unexpected error occurred");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const unsubscribeHandler = async (memberId: string) => {
    if (isProcessing) return;

    try {
      setIsProcessing(true);

      if (!memberId) throw new Error(Messages.error1);
      if (!user._id) throw new Error(Messages.error2);

      await unsubscribe({ variables: { input: memberId } });
      toast.success("Unsubscribed");

      if (onFollowChange) {
        await onFollowChange();
      }
    } catch (err) {
      if (err instanceof Error) {
        console.log("unsubscribe error", err.message);
        toast.error(err.message);
      } else {
        toast.error("Unexpected error occurred");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    subscribeHandler,
    unsubscribeHandler,
    isLoading: isProcessing,
  };
}
