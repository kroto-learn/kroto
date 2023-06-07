import Layout from "@/components/layouts/main";
import { useSession } from "next-auth/react";
import ImageWF from "@/components/ImageWF";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function ColdLoading() {
  const router = useRouter();
  const { status } = useSession();
  const { path } = router.query as { path: string };

  useEffect(() => {
    if (status !== "loading") {
      void router.push(path);
    }
  }, [status, path, router]);

  return (
    <Layout>
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
        <div className="relative">
          <ImageWF src="/cat-what.gif" alt="loading" width={500} height={500} />
        </div>
        <h2 className="text-4xl ">Hang in there... this happens only once</h2>
      </div>
    </Layout>
  );
}
