import { KrotoLogo } from "@/pages/auth/sign-in";
import Link from "next/link";

export default function Navbar() {
  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex items-center gap-4 p-5 py-10">
        <KrotoLogo />
        <Link href="#features">Features</Link>
        <Link href="#features">Discover</Link>
        <Link href="#features">Claim Link</Link>
      </div>
    </div>
  );
}
