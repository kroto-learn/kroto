import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

const ProtectedRoutes = () => {
  const router = useRouter();

  const { data: session, status } = useSession();

  useEffect(() => {
    const publicRoutes = [
      "/",
      "/privacy",
      "/auth/sign-in",
      "/[creator_id]",
      "/event/[id]",
      "/course/[id]",
    ];

    if (publicRoutes.includes(router.pathname)) return;

    if (status === "unauthenticated") {
      void router.push("/");
    }
  }, [status, router, session]);

  return <></>;
};

export default ProtectedRoutes;
