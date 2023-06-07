import { api } from "@/utils/api";
import { Dialog, Transition } from "@headlessui/react";
import { PlayIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { type Dispatch, Fragment, type SetStateAction } from "react";
import { Loader } from "./Loader";
import { TRPCError } from "@trpc/server";
import YouTube from "react-youtube";
import Image from "next/image";
import { signIn, useSession } from "next-auth/react";
import useToast from "@/hooks/useToast";
import Link from "next/link";
import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline";

const CoursePreviewModal = ({
  isOpen,
  setIsOpen,
  courseId,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  courseId: string;
}) => {
  const { data: course, isLoading: courseLoading } =
    api.course.getCourse.useQuery({ id: courseId });

  const youtubeOpts = {
    height: "100%",
    width: "100%",
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
      modestbranding: 1,
      rel: 0,
      origin: typeof window !== "undefined" ? window.location.origin : 0,
      showinfo: 0,
    },
  };
  const session = useSession();
  const { mutateAsync: enrollMutation, isLoading: enrollLoading } =
    api.course.enroll.useMutation();
  const { data: isEnrolled } = api.course.isEnrolled.useQuery({ courseId });
  const { successToast, errorToast } = useToast();
  const ctx = api.useContext();

  if (course instanceof TRPCError || !course) return <>Course not found!</>;

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setIsOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-6 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-neutral-800 p-4 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="div"
                    className="mb-2 flex w-full flex-col gap-4"
                  >
                    <div className="flex w-full justify-between">
                      <h3 className="ml-2 text-xl font-medium text-neutral-200">
                        {course?.title}
                      </h3>
                      <button
                        onClick={() => {
                          setIsOpen(false);
                        }}
                        type="button"
                        className="ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-neutral-400 hover:bg-neutral-600"
                      >
                        <XMarkIcon className="w-5" />
                      </button>
                    </div>
                  </Dialog.Title>
                  {courseLoading ? (
                    <div className="flex h-24 items-center justify-center">
                      <Loader size="lg" />
                    </div>
                  ) : (
                    <div className="flex w-full flex-col items-start gap-2">
                      {course.previewChapter?.type !== "TEXT" ? (
                        <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-neutral-700">
                          <YouTube
                            className="absolute bottom-0 left-0 right-0 top-0 h-full w-full"
                            videoId={course.previewChapter?.ytId ?? ""}
                            opts={youtubeOpts}
                            // onReady={this._onReady}
                          />
                        </div>
                      ) : (
                        <></>
                      )}
                      <h3 className="mb-0 mt-2 font-medium">
                        {course.previewChapter?.title}
                      </h3>
                      <div className="flex w-full items-center gap-2">
                        <p>
                          Chapter {(course.previewChapter?.position ?? 0) + 1}
                        </p>
                        <span className="rounded border border-pink-500 bg-pink-500/10 p-1 px-2 text-xs font-medium uppercase tracking-wider text-pink-500">
                          PREVIEW
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <Image
                          src={course?.creator?.image ?? ""}
                          alt={course?.creator?.name}
                          width={25}
                          height={25}
                          className="rounded-full"
                        />
                        <p className="text-sm font-medium text-neutral-400">
                          {course?.creator?.name}
                        </p>
                      </div>
                    </div>
                  )}
                  {session.data?.user.id !== course?.creator?.id ? (
                    isEnrolled ? (
                      <Link
                        href={`/course/play/${course?.id}`}
                        className={`group my-4 inline-flex items-center justify-center gap-[0.15rem] rounded-xl bg-pink-500 px-6 py-1  text-center font-medium text-neutral-200 transition-all duration-300 hover:bg-pink-600`}
                      >
                        <>
                          <PlayIcon className="w-4" />
                          <span>Play</span>
                        </>
                      </Link>
                    ) : (
                      <div className="mt-4 flex flex-col items-start gap-2">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={async () => {
                              if (!session.data) {
                                void signIn(undefined, {
                                  callbackUrl: `/course/${courseId}`,
                                });
                                return;
                              }
                              await enrollMutation(
                                { courseId: course?.id },
                                {
                                  onSuccess: () => {
                                    void ctx.course.isEnrolled.invalidate();
                                    successToast(
                                      "Successfully enrolled in course!"
                                    );
                                  },
                                  onError: () => {
                                    errorToast("Error in enrolling in course!");
                                  },
                                }
                              );
                            }}
                            className={`group inline-flex items-center justify-center gap-[0.15rem] rounded-xl bg-pink-500 px-6 py-1  text-center font-medium text-neutral-200 transition-all duration-300 hover:bg-pink-600`}
                          >
                            {enrollLoading ? <Loader white /> : <></>}
                            <span>Enroll now</span>
                          </button>
                          {course?.price === 0 ? (
                            <span className="uppercase tracking-wider text-green-600">
                              FREE
                            </span>
                          ) : (
                            <span className="font-bold uppercase tracking-wider text-white">
                              ₹ {course?.price}
                            </span>
                          )}
                        </div>

                        <p className="text-sm text-neutral-400">
                          Enroll to access the complete course.
                        </p>
                      </div>
                    )
                  ) : (
                    <Link
                      href={`/creator/dashboard/course/${course?.id}`}
                      className={`group my-4 inline-flex items-center justify-center gap-1 rounded-xl bg-pink-500/10 px-6 py-1  text-center font-medium text-pink-500 transition-all duration-300 hover:bg-pink-600 hover:text-neutral-200`}
                    >
                      <>
                        <AdjustmentsHorizontalIcon className="w-4" />
                        <span>Manage</span>
                      </>
                    </Link>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default CoursePreviewModal;
