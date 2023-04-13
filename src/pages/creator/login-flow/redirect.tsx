import { Loader } from "@/components/Loader";
import { api } from "@/utils/api";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function RedirectToSettings() {
  const router = useRouter();
  const { creatorProfile } = router.query as { creatorProfile: string };

  const { mutateAsync: makeProfile } = api.creator.makeCreator.useMutation();

  useEffect(() => {
    void makeProfile({ creatorProfile })
      .then(() => {
        void router.push("/creator/dashboard/settings");
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  return (
    <div className="flex h-screen scale-150 items-center justify-center">
      <Loader />
    </div>
  );
}
