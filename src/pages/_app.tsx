import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { api } from "@/utils/api";

import { Progress } from "@/components/Progress";
import {
  type ProgressState,
  useProgressStore,
} from "@/helpers/useProgressStore";

import "@/styles/globals.css";
import { useRouter } from "next/router";
import { type ReactNode, useEffect } from "react";
import { type NextComponentType } from "next";
import { Toaster } from "react-hot-toast";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const setIsAnimating = useProgressStore(
    (state: ProgressState) => state.setIsAnimating
  );
  const isAnimating = useProgressStore(
    (state: ProgressState) => state.isAnimating
  );
  const router = useRouter();

  useEffect(() => {
    const handleStart = () => setIsAnimating(true);
    const handleStop = () => setIsAnimating(false);

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleStop);
    router.events.on("routeChangeError", handleStop);

    () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleStop);
      router.events.off("routeChangeError", handleStop);
    };
  }, [router, setIsAnimating]);

  return (
    <SessionProvider session={session}>
      <Progress isAnimating={isAnimating} />
      <Toaster />
      <Layout
        Component={
          Component as NextComponentType & {
            getLayout: (page: ReactNode) => JSX.Element;
          }
        }
        pageProps={pageProps}
      />
    </SessionProvider>
  );
};

const Layout = ({
  Component,
  pageProps,
}: {
  Component: NextComponentType & {
    getLayout: (page: ReactNode) => JSX.Element;
  };
  pageProps: object;
}) => {
  if (Component.getLayout) {
    return Component.getLayout(<Component {...pageProps} />);
  } else {
    return <Component {...pageProps} />;
  }
};

export default api.withTRPC(MyApp);
