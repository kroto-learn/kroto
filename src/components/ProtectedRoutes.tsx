import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

const ProtectedRoutes = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    // const timeout = setTimeout(() => {
    //   if (status === "loading" && router.asPath !== "/")
    //     void router.push(`/cold-loading?path=${router.asPath}`);
    // }, 2000);

    const publicRoutes = [
      "/",
      "/privacy",
      "/cold-loading",
      "/terms-and-conditions",
      "/refund-policy",
      "/auth/sign-in",
      "/[creator_id]",
      "/event/[id]",
      "/course/[id]",
      "/courses",
      "/courses/landing",
    ];

    if (publicRoutes.includes(router.pathname)) return;

    if (status === "unauthenticated") {
      void router.push("/");
    }
  }, [status, router, session]);

  return <></>;
};

export default ProtectedRoutes;
