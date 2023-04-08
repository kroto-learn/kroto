import Link from "next/link";
import Image from "next/image";
import logo from "public/kroto-logo.png";

export default function ClaimLink({
  variant,
}: {
  variant: "sm" | "lg" | "md";
}) {
  return (
    <div>
      <div className="flex justify-center">
        <div className="flex rounded-full border-2 border-neutral-700">
          <span
            className={`flex items-center ${
              variant === "sm" ? "pl-3" : "pl-5"
            }  rounded-l-full border border-r-0 border-neutral-800 bg-neutral-900 text-lg shadow`}
          >
            <KrotoDotIn variant={variant} />
          </span>
          <input
            type="text"
            id="website-admin"
            className={`block w-min rounded-none rounded-r-full border border-l-0 border-neutral-800 bg-neutral-900 ${
              variant === "sm" ? "p-2" : "p-4"
            } pl-1 ${
              variant === "lg"
                ? "text-2xl"
                : variant === "md"
                ? "text-lg"
                : "text-md"
            } placeholder-neutral-400 shadow outline-none ring-transparent active:outline-none active:ring-transparent`}
            placeholder="noobmaster69"
          />
        </div>
      </div>
    </div>
  );
}

export function KrotoDotIn({ variant }: { variant: "sm" | "lg" | "md" }) {
  if (variant === "lg") {
    return (
      <div>
        <Link href="/">
          <div className="flex items-center">
            <div>
              <Image src={logo} width={512 / 12} height={512 / 12} alt="logo" />
            </div>
            <h2 className="flex -translate-x-1 -translate-y-[3px] items-center text-4xl ">
              roto.in /@
            </h2>
          </div>
        </Link>
      </div>
    );
  } else if (variant === "md") {
    return (
      <div>
        <Link href="/">
          <div className="flex items-center">
            <div>
              <Image src={logo} width={512 / 15} height={512 / 15} alt="logo" />
            </div>
            <h2 className="flex -translate-x-1 -translate-y-[1px] items-center text-2xl ">
              roto.in /@
            </h2>
          </div>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link href="/">
        <div className="flex items-center">
          <div>
            <Image src={logo} width={512 / 18} height={512 / 18} alt="logo" />
          </div>
          <h2 className="flex -translate-x-1 -translate-y-[1px] items-center text-xl">
            roto.in /@
          </h2>
        </div>
      </Link>
    </div>
  );
}
