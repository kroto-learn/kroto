import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html className="antialiased" lang="en">
      <Head></Head>
      <body className="flex h-full flex-col bg-neutral-950 bg-[url('/topography.svg')] text-neutral-200">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
