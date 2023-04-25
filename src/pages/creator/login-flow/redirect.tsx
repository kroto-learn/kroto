import { Loader } from "@/components/Loader";
import useToast from "@/hooks/useToast";
import { api } from "@/utils/api";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function RedirectToSettings() {
  const router = useRouter();
  const { creatorProfile } = router.query as { creatorProfile: string };

  const { mutateAsync: makeProfile, isLoading } =
    api.creator.makeCreator.useMutation();
  const { errorToast } = useToast();

  useEffect(() => {
    void makeProfile(
      { creatorProfile },
      {
        onError: () => {
          errorToast("Error in creating creator profile!");
        },
      }
    );
    if (!isLoading) {
      void router.push("/creator/dashboard/settings");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [creatorProfile, isLoading, makeProfile, router]);

  return (
    <div className="flex h-screen scale-150 items-center justify-center">
      <Loader />
    </div>
  );
}
