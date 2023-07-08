import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord, faTwitter } from "@fortawesome/free-brands-svg-icons";
import Link from "next/link";
import ImageWF from "@/components/ImageWF";
import { EnvelopeIcon } from "@heroicons/react/20/solid";
import { faPhone } from "@fortawesome/free-solid-svg-icons";

export default function Footer() {
  return (
    <footer className="display mt-12 flex w-full justify-center bg-neutral-950 px-4 py-8">
      <div className="flex w-full max-w-6xl flex-col items-center">
        <div className="mb-4 flex w-full items-center justify-between gap-4 sm:items-start">
          <div className="flex flex-col items-start gap-1">
            <Link href="/">
              <div className="flex items-center">
                <div className="relative aspect-square h-12 sm:h-16">
                  <ImageWF src="/kroto-logo.png" alt="logo" fill />
                </div>
                <h2 className="hidden -translate-x-3 text-5xl font-medium text-white sm:flex">
                  roto
                </h2>
              </div>
            </Link>
            <div className="mb-2 ml-3 hidden text-sm text-neutral-400 sm:block">
              Created by{" "}
              <span className="text-neutral-200">Kroto Kreator Labs</span>
            </div>
            <p className="ml-3 items-center gap-2 text-xs text-neutral-500 sm:flex hidden">
              Pbt by pass road, street bo-3, PN/11/14/2 <br /> Shamat Ganj,
              Bareilly, 243005, Uttar Pradesh.
            </p>
          </div>
          <div className="hidden items-start gap-12 sm:flex">
            <div className="flex flex-col items-start justify-center gap-2">
              <h3 className="text-xs font-medium uppercase tracking-widest text-neutral-400">
                Contact
              </h3>
              <Link
                href="https://twitter.com/RoseKamalLove1"
                className="flex items-center gap-2 text-sm text-neutral-300 transition duration-300 hover:text-neutral-200"
              >
                <FontAwesomeIcon icon={faTwitter} /> Twitter
              </Link>
              <Link
                href="https://discord.com/invite/e5SnnVP3ad"
                className="flex items-center gap-2 text-sm text-neutral-300 transition duration-300 hover:text-neutral-200"
              >
                <FontAwesomeIcon icon={faDiscord} /> Discord
              </Link>
              <Link
                href="mailto:kamal@kroto.in"
                className="flex items-center gap-2 text-sm text-neutral-300 transition duration-300 hover:text-neutral-200"
              >
                <EnvelopeIcon className="w-4" /> kamal@kroto.in
              </Link>
              <p className="flex items-center gap-2 text-sm text-neutral-300">
                <FontAwesomeIcon icon={faPhone} className="w-4" /> +917906682655
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 sm:hidden">
            <Link
              href="https://twitter.com/RoseKamalLove1"
              className="flex items-center gap-2 text-sm text-neutral-300 transition duration-300 hover:text-neutral-200"
            >
              <FontAwesomeIcon icon={faTwitter} />
            </Link>
            <Link
              href="https://discord.com/invite/e5SnnVP3ad"
              className="flex items-center gap-2 text-sm text-neutral-300 transition duration-300 hover:text-neutral-200"
            >
              <FontAwesomeIcon icon={faDiscord} />
            </Link>
            <Link
              href="mailto:kamal@kroto.in"
              className="flex items-center gap-2 text-sm text-neutral-300 transition duration-300 hover:text-neutral-200"
            >
              <EnvelopeIcon className="w-4" />
            </Link>
          </div>
        </div>

        <div className="mb-4 text-sm text-neutral-400 sm:hidden">
          Created by{" "}
          <span className="font-medium text-neutral-200">
            Kroto Kreator Labs
          </span>
        </div>

        <div className="mb-3 flex flex-col items-center sm:gap-8 gap-2 sm:flex-row">
          <Link
            className="text-sm text-neutral-400 transition duration-300 hover:text-neutral-200"
            href="/terms-and-conditions"
          >
            Terms & Conditions
          </Link>
          <Link
            className="text-sm text-neutral-400 transition duration-300 hover:text-neutral-200"
            href="/privacy"
          >
            Privacy Policy
          </Link>
          <Link
            className="text-sm text-neutral-400 transition duration-300 hover:text-neutral-200"
            href="/contact-us"
          >
            Contact Us
          </Link>
        </div>

        <p className="text-center text-xs text-neutral-500 sm:text-sm">
          © 2023 Kroto Kreator Labs Private Limited, All rights reserved.
        </p>
      </div>
    </footer>
  );
}
