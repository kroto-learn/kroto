import { type ReactNode } from "react";
import "../styles/globals.css";

type Props = {
  children: ReactNode;
};

export default function RootLayout({ children }: Props) {
  return (
    <html className="antialiased" lang="en">
      <body className="box-border flex h-full flex-col bg-neutral-950 bg-[url('/topography.svg')] text-neutral-200">
        <body>{children}</body>
      </body>
    </html>
  );
}
