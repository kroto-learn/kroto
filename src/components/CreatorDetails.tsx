import { api } from "@/utils/api";
import Image from "next/image";
import React from "react";
import { type AskedQuery } from "@prisma/client";
import { useSession } from "next-auth/react";

type Props = {
  query: AskedQuery;
};

const CreatorImage = ({ query }: Props) => {
  const { data: session } = useSession();

  const { data: creator } = api.creator.getPublicProfile.useQuery({
    creatorProfile: query.creatorProfile,
  });

  return (
    <div className="flex -space-x-2">
      <Image
        className="rounded-full dark:border-gray-800"
        width={25}
        height={25}
        src={session?.user.image ?? ""}
        alt={session?.user.name ?? ""}
      />
      <Image
        className="rounded-full dark:border-gray-800"
        width={25}
        height={25}
        src={creator?.image ?? ""}
        alt={creator?.name ?? ""}
      />
    </div>
  );
};

const SenderImage = ({ query }: Props) => {
  const { data: creator, isLoading: CreatorLaoding } =
    api.creator.getPublicProfile.useQuery({
      creatorProfile: query.creatorProfile,
    });

  return (
    <div className="flex">
      {CreatorLaoding ? (
        <Image
          className="rounded-full dark:border-gray-800"
          width={30}
          height={30}
          src="/empty/image.jpg"
          alt="emptyImage"
        />
      ) : (
        <Image
          className="rounded-full dark:border-gray-800"
          width={30}
          height={30}
          src={creator?.image ?? ""}
          alt={creator?.name ?? ""}
        />
      )}
    </div>
  );
};

const SenderName = ({ query }: Props) => {
  const { data: creator } = api.creator.getPublicProfile.useQuery({
    creatorProfile: query.creatorProfile,
  });

  return (
    <>
      <p className="text-sm font-bold">{creator?.name}</p>
    </>
  );
};

export { CreatorImage, SenderImage, SenderName };
