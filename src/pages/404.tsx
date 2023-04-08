import { HiArrowSmRight } from "react-icons/hi";
import Link from "next/link";

export default function Page() {
  return (
    <section className="flex h-screen items-center justify-center">
      <div className="mx-auto max-w-screen-xl px-4 py-8 lg:px-6 lg:py-16">
        <div className="mx-auto max-w-screen-sm text-center">
          <h1 className="mb-4 text-7xl font-extrabold tracking-tight text-neutral-200 lg:text-9xl">
            404
          </h1>
          <p className="mb-4 text-3xl font-bold tracking-tight text-neutral-300 md:text-4xl">
            Something&apos;s missing.
          </p>
          <p className="mb-4 text-lg font-light text-neutral-400">
            Sorry, we can&apos;t find that page. You&apos;ll find lots to
            explore on the home page.{" "}
          </p>
          <Link
            href="/"
            className={`group inline-flex items-center gap-[0.15rem] rounded-xl bg-pink-600 px-6 py-2 text-center text-lg font-medium text-white transition-all duration-300 hover:bg-pink-700 `}
          >
            Back to Homepage
            <HiArrowSmRight className="text-xl duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
