import { IoLogoTwitter } from "react-icons/io5";
import { BsDiscord } from "react-icons/bs";
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-neutral-950">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-y-4 px-4 py-12 sm:px-6 md:justify-between lg:flex-row lg:px-8">
        <div className="text-center font-medium text-neutral-400">
          Created by <span className="text-neutral-200">The Kreator Labs</span>
        </div>
        <nav className="flex flex-wrap justify-center" aria-label="Footer">
          <div className="px-5 py-2">
            <Link
              className="text-base text-neutral-500 hover:text-neutral-400"
              href="/info/terms-of-service"
            >
              Terms of Service
            </Link>
          </div>
          <div className="px-5 py-2">
            <Link
              className="text-base text-neutral-500 hover:text-neutral-400"
              href="/privacy"
            >
              Privacy Policy
            </Link>
          </div>
        </nav>
        <div className="flex items-center justify-center space-x-6">
          <Link
            href="https://twitter.com/RoseKamalLove1"
            className="text-base text-neutral-300 hover:text-neutral-200"
          >
            <IoLogoTwitter />
          </Link>
          <Link
            href="https://discord.com/invite/e5SnnVP3ad"
            className="text-base text-neutral-300 hover:text-neutral-200"
          >
            <BsDiscord />
          </Link>
        </div>
        <p className="text-center text-neutral-400">
          © 2023 The Kreator Labs, All rights reserved.
        </p>
      </div>
    </footer>
  );
}
