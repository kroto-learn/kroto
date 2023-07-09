import { api } from "@/utils/api";
import { Dialog, Transition } from "@headlessui/react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { type Dispatch, Fragment, type SetStateAction } from "react";
import { Loader } from "./Loader";

import YouTube from "react-youtube";

const ChapterManagePreviewModal = ({
  isOpen,
  setIsOpen,
  courseId,
  position,
  setPosition,
}: {
  position: number;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  setPosition: Dispatch<SetStateAction<number>>;
  courseId: string;
}) => {
  const { data: course, isLoading: courseLoading } = api.course.get.useQuery({
    id: courseId,
  });

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

  if (!course) return <>Course not found!</>;

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
                      {course.chapters[position]?.type !== "TEXT" ? (
                        <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-neutral-700">
                          <YouTube
                            className="absolute bottom-0 left-0 right-0 top-0 h-full w-full"
                            videoId={course.chapters[position]?.ytId ?? ""}
                            opts={youtubeOpts}
                            // onReady={this._onReady}
                          />
                        </div>
                      ) : (
                        <></>
                      )}
                      <h3 className="mb-0 mt-2 font-medium">
                        {course.chapters[position]?.title}
                      </h3>
                      <div className="flex w-full items-center gap-2">
                        <p>
                          Chapter{" "}
                          {(course.chapters[position]?.position ?? 0) + 1}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="mt-3 flex w-full items-center gap-2 space-x-2 rounded-b text-sm dark:border-neutral-600">
                    {position > 0 ? (
                      <button
                        type="button"
                        onClick={() => setPosition(position - 1)}
                        className="flex items-center gap-1 rounded-lg bg-neutral-600 p-2 px-3 text-center text-sm font-medium text-neutral-400 duration-300 hover:text-neutral-200 active:scale-95 disabled:hidden"
                      >
                        <ChevronLeftIcon className="w-4" /> Previous
                      </button>
                    ) : (
                      <></>
                    )}
                    {position < course.chapters.length - 1 ? (
                      <button
                        type="button"
                        onClick={() => setPosition(position + 1)}
                        className="flex items-center gap-1 rounded-lg bg-neutral-600 p-2 px-3 text-center text-sm font-medium text-neutral-400 duration-300 hover:text-neutral-200 active:scale-95 disabled:hidden"
                      >
                        Next <ChevronRightIcon className="w-4" />
                      </button>
                    ) : (
                      <></>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default ChapterManagePreviewModal;
