"use client";

import { useQuery, useReactiveVar } from "@apollo/client";
import { userVar } from "@/apollo/store";
import { GET_MY_STORE, GET_STORE } from "@/apollo/user/user-query";
import { Store } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { StoreSettingsForm } from "@/components/dashboard/store-setting/StoreSettingForm";
import { _Store } from "@/lib/types/store/store";
import { LoadingBar } from "@/components/web/LoadingBar";

export default function StoreSettingsPage() {
  const user = useReactiveVar(userVar);

  /* -------------------------------------------------------------------------- */
  /*                                APOLLO CLIENT                               */
  /* -------------------------------------------------------------------------- */
  const { data: storeData } = useQuery(GET_MY_STORE, {
    variables: { input: user._id },
    fetchPolicy: "network-only",
    skip: !user._id,
  });

  const myStore: _Store = storeData?.getMyStore;
  const storeId = myStore?._id;

  const { data, loading, error, refetch } = useQuery(GET_STORE, {
    variables: { input: storeId },
    fetchPolicy: "cache-and-network",
    skip: !storeId,
  });

  const store = data?.getStore;

  return (
    <>
      <LoadingBar loading={loading} />
      <div className="container mx-auto max-w-4xl py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Store className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Store Settings</h1>
              <p className="text-sm text-muted-foreground">
                Manage your store information
              </p>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && !loading && (
          <Alert variant="destructive">
            <AlertDescription>
              Failed to load store information. Please try again.
            </AlertDescription>
          </Alert>
        )}

        {/* Settings Form */}
        {store && !loading && (
          <StoreSettingsForm
            store={store}
            onSuccess={() => {
              refetch();
            }}
          />
        )}
      </div>
    </>
  );
}
