import Link from "next/link";
import Image from "next/image";
import logo from "public/kroto-logo.png";
import React, { useState } from "react";
import { BsArrowRight } from "react-icons/bs";
import { useRouter } from "next/router";

export default function ClaimLink({
  variant,
}: {
  variant: "sm" | "lg" | "md";
}) {
  const router = useRouter();
  const [creatorProfile, setCreatorProfile] = useState<string>("");
  return (
    <div>
      <div className="flex justify-center">
        <div className="group relative flex rounded-full border-neutral-700">
          <span
            className={`flex items-center ${
              variant === "sm" ? "pl-3" : "pl-5"
            }  rounded-l-full border border-r-0 border-neutral-800 bg-neutral-900/50 text-lg shadow backdrop-blur  transition duration-300 group-hover:border-neutral-700`}
          >
            <KrotoDotIn variant={variant} />
          </span>
          <input
            type="text"
            id="website-admin"
            onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
              setCreatorProfile(e.target.value)
            }
            className={`block w-min rounded-none rounded-r-full border border-l-0 border-neutral-800 bg-neutral-900/50  backdrop-blur transition duration-300 group-hover:border-neutral-700 ${
              variant === "sm" ? "p-2" : "p-4"
            } pl-1 ${
              variant === "lg"
                ? "text-3xl"
                : variant === "md"
                ? "text-lg"
                : "text-md"
            } placeholder-neutral-400 shadow outline-none ring-transparent active:outline-none active:ring-transparent`}
            placeholder="noobmaster69"
          />
          {creatorProfile && (
            <button
              onClick={() => {
                localStorage.setItem("creatorProfile", creatorProfile);
                void router.push("/creator/login-flow/auth");
              }}
              className={`absolute  cursor-pointer rounded-full ${
                variant === "md"
                  ? "right-8 translate-y-5  text-xl"
                  : variant === "sm"
                  ? "text-md right-5 translate-y-3"
                  : "right-8 translate-y-3 text-3xl "
              } transition-all duration-300 hover:translate-x-1`}
            >
              <BsArrowRight />
            </button>
          )}
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
            <div className="translate-y-[2px]">
              <Image src={logo} width={512 / 12} height={512 / 12} alt="logo" />
            </div>
            <h2 className="flex -translate-x-1 items-center text-4xl ">
              roto.in/
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
            <div className="translate-y-[2px]">
              <Image src={logo} width={512 / 15} height={512 / 15} alt="logo" />
            </div>
            <h2 className="flex -translate-x-1 items-center text-2xl ">
              roto.in/
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
            roto.in/
          </h2>
        </div>
      </Link>
    </div>
  );
}
