import { type ReactNode } from "react";
import "../src/styles/globals.css";

type Props = {
  children: ReactNode;
};

export default function RootLayout({ children }: Props) {
  return (
    <html className="antialiased" lang="en">
      <body className="flex h-full flex-col bg-neutral-900 bg-[url('/topography.svg')] text-neutral-200">
        <body>{children}</body>
      </body>
    </html>
  );
}
