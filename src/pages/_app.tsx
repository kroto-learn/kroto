import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { api } from "@/utils/api";
import NextProgress from "next-progress";
import { useEffect, type ReactNode } from "react";
import { type NextComponentType } from "next";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/react";
import "@/styles/globals.css";
import ProtectedRoutes from "@/components/ProtectedRoutes";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import { MixPannelClient } from "@/analytics/mixpanel";
import { useRouter } from "next/router";
import { AnimatePresence } from "framer-motion";
import Script from "next/script";

config.autoAddCss = false;

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const router = useRouter();

  useEffect(() => {
    if (session?.user?.email) {
      MixPannelClient.getInstance().authenticatedVisit({
        email: session.user.email,
        name: session.user.name ?? "",
        id: session.user.id,
        avatar: session.user.image ?? "",
      });
    }

    MixPannelClient.getInstance().pageViewed({
      pagePath: router.asPath,
    });
  }, [router, session]);

  return (
    <>
      {/* Google tag (gtag.js) */}

      <Script
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=G-X2LKVN7H4M"
      />

      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-X2LKVN7H4M', {
            page_path: window.location.pathname,
          });
        `,
        }}
      />

      <SessionProvider session={session}>
        <NextProgress
          delay={300}
          color="#db2777"
          options={{
            showSpinner: false,
          }}
        />
        <Toaster />
        <Analytics />
        <ProtectedRoutes />
        <AnimatePresence mode="wait" initial={true}>
          <Layout
            Component={
              Component as NextComponentType & {
                getLayout: (page: ReactNode) => JSX.Element;
              }
            }
            pageProps={pageProps}
          />
        </AnimatePresence>
      </SessionProvider>
    </>
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
