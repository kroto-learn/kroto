import useToast from "@/hooks/useToast";
import { Dialog, Transition } from "@headlessui/react";
import { LinkIcon, XMarkIcon } from "@heroicons/react/20/solid";
import {
  type Dispatch,
  Fragment,
  type SetStateAction,
  useState,
  useEffect,
} from "react";
import { Loader } from "./Loader";
import { z } from "zod";
import { type UseFormProps, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LightBulbIcon } from "@heroicons/react/24/outline";
import { api } from "@/utils/api";
import ImageWF from "./ImageWF";

export const suggestCourseSchema = z.object({
  playlistId: z.string({
    required_error: "A valid YouTube playlist is required.",
  }),
});

function useZodForm<TSchema extends z.ZodType>(
  props: Omit<UseFormProps<TSchema["_input"]>, "resolver"> & {
    schema: TSchema;
  }
) {
  const form = useForm<TSchema["_input"]>({
    ...props,
    resolver: zodResolver(props.schema, undefined),
  });

  return form;
}

export default function SuggestCourseModal({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const { successToast } = useToast();
  const [playlistLink, setPlaylistLink] = useState("");

  const { data: playlist, isLoading: playlistLoading } =
    api.ytCourse.getYoutubePlaylistShallow.useQuery({
      playlistId: new URLSearchParams(playlistLink).get("list") ?? "",
    });

  const { mutateAsync: suggestCourseMutation, isLoading: suggestLoading } =
    api.suggestionsCourse.suggestCourse.useMutation();

  const methods = useZodForm({
    schema: suggestCourseSchema,
  });

  useEffect(() => {
    if (playlist) methods.setValue("playlistId", playlist?.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playlist]);

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
                  <Dialog.Title as="div" className="flex w-full flex-col gap-4">
                    <div className="flex w-full justify-between">
                      <h3 className="ml-2 flex items-center gap-2 text-xl font-medium text-neutral-200">
                        <LightBulbIcon className="w-4" /> Suggest Course
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
                  <form
                    onSubmit={methods.handleSubmit((values) => {
                      void suggestCourseMutation(values, {
                        onSuccess: () => {
                          successToast(
                            "Your course suggestion was sent succesfully!"
                          );
                          methods.setValue("playlistId", "");
                          setPlaylistLink("");
                          setIsOpen(false);
                        },
                      });
                    })}
                    className="flex flex-col items-start gap-2 p-6"
                  >
                    <p className="text-neutral-300">
                      Can&apos;t find the course you are looking for.
                    </p>
                    <p>
                      Suggest us a YouTube playlist you want to learn on Kroto.
                    </p>
                    <div className="relative mt-4 flex w-full items-center">
                      <input
                        value={playlistLink}
                        onChange={(e) => setPlaylistLink(e.target.value)}
                        placeholder="Paste YouTube playlist link here..."
                        className="peer w-full rounded-lg bg-pink-500/10 px-8 py-2 text-sm font-medium text-neutral-200   outline outline-2 outline-pink-500/40 backdrop-blur-sm transition-all duration-300 placeholder:text-neutral-200/50 hover:outline-pink-500/80 focus:outline-pink-500"
                      />
                      <div className="absolute right-4">
                        {playlistLoading && <Loader />}
                      </div>

                      <LinkIcon className="absolute ml-2 w-4 text-pink-500/50 duration-300 peer-hover:text-pink-500/80 peer-focus:text-pink-500" />
                    </div>
                    {methods.formState.errors.playlistId?.message && (
                      <p className="text-sm text-red-700">
                        {methods.formState.errors.playlistId?.message}
                      </p>
                    )}
                    {playlist ? (
                      <div className="mt-2 flex items-start gap-2">
                        <div
                          className={`relative aspect-video w-20 overflow-hidden rounded-lg`}
                        >
                          <ImageWF
                            src={playlist?.thumbnail ?? ""}
                            alt={""}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <h4>{playlist.title}</h4>
                      </div>
                    ) : (
                      <></>
                    )}
                    <button
                      type="submit"
                      className="mt-2 flex items-center gap-1 rounded-lg bg-pink-500 px-4 py-2 text-sm font-bold duration-150 hover:bg-pink-600"
                    >
                      {suggestLoading ? <Loader white /> : <></>} Submit
                      Suggestion
                    </button>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
