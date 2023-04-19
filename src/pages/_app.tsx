import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { api } from "@/utils/api";

import NextNProgress from "nextjs-progressbar";
import { type ReactNode } from "react";
import { type NextComponentType } from "next";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/react";

import "@/styles/globals.css";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <NextNProgress
        showOnShallow={false}
        options={{ showSpinner: false }}
        color="#db2777"
      />
      <Toaster />
      <Analytics />
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
