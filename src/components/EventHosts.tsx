import useToast from "@/hooks/useToast";
import { api } from "@/utils/api";
import { UserPlusIcon, TrashIcon } from "@heroicons/react/20/solid";

import Link from "next/link";
import { type Dispatch, type SetStateAction } from "react";
import { Loader } from "./Loader";
import { useRouter } from "next/router";
import ImageWF from "@/components/ImageWF";
import useRevalidateSSG from "@/hooks/useRevalidateSSG";
import AnimatedSection from "./AnimatedSection";

type Props = {
  setIsHostModalOpen: Dispatch<SetStateAction<boolean>>;
};

const Hosts = ({ setIsHostModalOpen }: Props) => {
  const router = useRouter();
  const { id } = router.query as { id: string };
  const { data: event } = api.event.get.useQuery({
    id,
  });
  const {
    data: hosts,
    refetch: refetchHosts,
    isError: isHostsError,
  } = api.eventHost.getHosts.useQuery({
    eventId: id,
  });

  const { mutateAsync: removeHost, isLoading: removingHost } =
    api.eventHost.removeHost.useMutation();

  const { errorToast } = useToast();

  const revalidate = useRevalidateSSG();
  const ctx = api.useContext();

  if (!event) return <></>;

  const isEventOver = event && event?.endTime?.getTime() < new Date().getTime();

  return (
    <>
      <AnimatedSection delay={0.3} className="w-full max-w-3xl">
        <div className="mb-2 mt-5 flex w-full items-center justify-between">
          <h3 className="text-2xl font-medium text-neutral-200">Hosts</h3>
          {!isEventOver ? (
            <button
              onClick={() => setIsHostModalOpen(true)}
              className={`group inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-700 px-4 py-2 text-center text-sm font-medium text-neutral-200 transition-all duration-300 hover:bg-neutral-200 hover:text-neutral-800`}
            >
              <UserPlusIcon className="w-4" /> Add Host
            </button>
          ) : (
            <></>
          )}
        </div>
        <ul className="w-full divide-y divide-neutral-700">
          {isHostsError ? (
            <></>
          ) : (
            hosts?.map((host) => {
              const isHostCreator = host?.user?.id === event?.creatorId;

              return (
                <li key={host?.id} className="py-3 sm:py-2">
                  <div className="flex w-full items-center space-x-4">
                    <div className="relative h-8 w-8 flex-shrink-0 rounded-full">
                      <ImageWF
                        className="rounded-full"
                        src={host?.user?.image ?? ""}
                        alt="host img"
                        fill
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <Link href={`/${host?.user?.creatorProfile ?? ""}`}>
                        <Link
                          href={`/${host?.user?.creatorProfile ?? ""}`}
                          className="truncate text-sm font-medium text-neutral-200 hover:underline"
                        >
                          {host?.user?.name ?? ""}
                        </Link>
                        <p className="truncate text-sm text-neutral-400">
                          {host?.user?.email ?? ""}
                        </p>
                      </Link>
                    </div>
                    {!isEventOver && !isHostCreator ? (
                      <button
                        onClick={async () => {
                          await removeHost(
                            {
                              id: host?.id ?? "",
                            },
                            {
                              onSuccess: () => {
                                void revalidate(`/event/${id}`);
                                void ctx.event.get.invalidate();
                              },
                              onError: () => {
                                errorToast("Error in removing host!");
                              },
                            }
                          );
                          void refetchHosts();
                        }}
                        className="flex items-center gap-1 rounded-lg bg-red-500/20 p-1 px-2 text-xs font-medium text-red-800 backdrop-blur-sm transition duration-300 hover:bg-red-600 hover:text-neutral-200"
                      >
                        {removingHost ? (
                          <Loader />
                        ) : (
                          <TrashIcon className="w-3" />
                        )}{" "}
                        Remove
                      </button>
                    ) : (
                      <></>
                    )}
                  </div>
                </li>
              );
            })
          )}
        </ul>
      </AnimatedSection>
    </>
  );
};

export default Hosts;
