import Layout from "@/components/layouts/main";
import { generateRandomGradientImages } from "@/helpers/randomGradientImages";
import { MagnifyingGlassIcon, PlusCircleIcon } from "@heroicons/react/20/solid";
import { zodResolver } from "@hookform/resolvers/zod";
// import { type MDEditorProps } from "@uiw/react-md-editor";
// import dynamic from "next/dynamic";
import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import { type UseFormProps, useForm } from "react-hook-form";
import { z } from "zod";
// import "@uiw/react-md-editor/markdown-editor.css";
// import "@uiw/react-markdown-preview/markdown.css";
import { api } from "@/utils/api";
import { TRPCError } from "@trpc/server";
import { Loader } from "@/components/Loader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faYoutube } from "@fortawesome/free-brands-svg-icons";
import useToast from "@/hooks/useToast";
import { useRouter } from "next/router";
import { ClockIcon } from "@heroicons/react/24/outline";
import youtubeBranding from "public/developed-with-youtube-sentence-case-light.png";
import useRevalidateSSG from "@/hooks/useRevalidateSSG";
import { CheckmarkIcon } from "react-hot-toast";
import ImageWF from "@/components/ImageWF";

// const MDEditor = dynamic<MDEditorProps>(() => import("@uiw/react-md-editor"), {
//   ssr: false,
// });

const titleLimit = 100;

export const importCourseFormSchema = z.object({
  thumbnail: z.string().nonempty("Please upload a cover"),
  title: z.string().max(titleLimit).nonempty("Please enter course title."),
  description: z.string().max(3000).optional(),
  chapters: z.array(
    z.object({
      title: z.string(),
      thumbnail: z.string(),
      videoUrl: z.string(),
      ytId: z.string(),
      description: z.string(),
      duration: z.number(),
    })
  ),
  price: z.string().nonempty("Please enter course price."),
  ytId: z.string(),
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

const Index = () => {
  const methods = useZodForm({
    schema: importCourseFormSchema,
    defaultValues: {
      title: "Your course title",
      description: "Your course description...",
      thumbnail: "",
      chapters: [],
      price: "0",
    },
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
  const [playlistId, setPlaylistId] = useState("");
  const revalidate = useRevalidateSSG();

  // const [playlistDetailInit, setPlaylistDetailInit] = useState(false);

  const { errorToast } = useToast();

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timerId);
  }, [searchQuery]);

  useEffect(() => {
    methods.setValue("thumbnail", generateRandomGradientImages());
  }, [methods]);

  const { data: playlists } = api.course.searchYoutubePlaylists.useQuery({
    searchQuery: debouncedQuery,
  });

  const { data: playlistData, isLoading: playlistLoading } =
    api.course.getYoutubePlaylist.useQuery({
      playlistId,
    });

  const { data: courses } = api.course.getAll.useQuery();

  const {
    mutateAsync: importCourseMutation,
    isLoading: importCourseMutationLoading,
  } = api.course.import.useMutation();

  const router = useRouter();

  useEffect(() => {
    if (playlistData) {
      // if (!playlistDetailInit) {
      // setPlaylistDetailInit(true);
      methods.setValue("title", playlistData.title);
      methods.setValue("description", playlistData.description);
      methods.setValue("thumbnail", playlistData.thumbnail);
      // }
      methods.setValue("chapters", playlistData.videos);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playlistData]);
  return (
    <Layout>
      <Head>
        <title>Import Course</title>
      </Head>
      <div className="relative mx-auto my-12 flex min-h-screen w-full max-w-2xl flex-col gap-8">
        <div className="mt-4 flex w-full items-center justify-center text-neutral-500">
          <p
            className={`mr-1 flex items-center text-sm font-bold uppercase tracking-wider ${
              playlistData ? "text-green-500" : ""
            }`}
          >
            {playlistData ? <CheckmarkIcon className="mr-1" /> : "1."} Select
            Playlist
          </p>
          <div
            className={`w-4 border-b border-neutral-600 ${
              playlistData ? "border-green-500" : ""
            }`}
          />
          <div className="w-4 border-b border-neutral-600" />
          <p className="ml-1 text-sm font-bold uppercase tracking-wider">
            2. Import Course
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="text-xl font-medium">
            Select your <FontAwesomeIcon icon={faYoutube} className="ml-1" />{" "}
            YouTube playlist
          </h3>
          <div className="relative flex items-center">
            <input
              onFocus={() => setSearchFocused(true)}
              onBlur={() =>
                setTimeout(() => {
                  setSearchFocused(false);
                }, 200)
              }
              placeholder="Search playlist..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="peer w-full rounded-lg bg-pink-500/10 px-3 py-2 pl-8 font-medium text-neutral-200   outline outline-2 outline-pink-500/40 backdrop-blur-sm transition-all duration-300 placeholder:text-neutral-200/50 hover:outline-pink-500/80 focus:outline-pink-500"
            />
            <div className="absolute right-4">
              {playlistLoading && <Loader />}
            </div>

            <MagnifyingGlassIcon className="absolute ml-2 w-4 text-pink-500/50 duration-300 peer-hover:text-pink-500/80 peer-focus:text-pink-500" />
          </div>

          <Image
            src={youtubeBranding}
            alt="Developed with YouTube"
            width={168}
            height={60}
            className="mt-1"
          />

          {!playlists || playlists instanceof TRPCError || !searchFocused ? (
            <></>
          ) : (
            <div className="absolute top-36 z-10 mt-2 flex max-h-[65vh] w-full flex-col overflow-y-auto overflow-x-hidden rounded-xl border border-neutral-700 backdrop-blur">
              {playlists.length > 0 ? (
                playlists.map((playlist) => (
                  <button
                    onClick={() => {
                      if (
                        courses?.find((c) => c.ytId === playlist.playlistId)
                      ) {
                        errorToast("This playlist has already been imported!");
                        return;
                      }
                      setPlaylistId(playlist.playlistId ?? "");
                      methods.setValue("ytId", playlist.playlistId ?? "");
                      setSearchFocused(false);
                    }}
                    className="group flex w-full items-center gap-2 border-b border-neutral-700 bg-neutral-800/80 px-4 py-3 duration-150 hover:bg-neutral-800/90"
                    key={playlist.playlistId}
                  >
                    <div className="relative aspect-video w-40 overflow-hidden rounded-lg">
                      <ImageWF
                        src={playlist?.thumbnail ?? ""}
                        alt={playlist?.title ?? ""}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="group flex h-full w-full flex-col items-start justify-start gap-1">
                      <h5 className="font-medium">{playlist?.title}</h5>
                      <p className="text-xs text-neutral-400">
                        {playlist?.channelTitle} • {playlist?.videoCount} videos
                      </p>
                    </div>
                    <div
                      className={`inline-flex items-center justify-center gap-[0.15rem] rounded-lg bg-pink-500/20 px-4 py-1 text-center text-xs font-medium text-pink-500 transition-all duration-300 group-hover:bg-pink-500 group-hover:text-neutral-200`}
                    >
                      {false ? (
                        <div>
                          <Loader white />
                        </div>
                      ) : (
                        <>Select</>
                      )}
                    </div>
                  </button>
                ))
              ) : (
                <p className="p-2 text-sm text-neutral-400">
                  {"🥲"} No public playlist found in your YouTube account.
                </p>
              )}
            </div>
          )}
        </div>
        <form
          onSubmit={methods.handleSubmit(async (values) => {
            console.log("this ran", values);
            await importCourseMutation(values, {
              onSuccess: (courseCreated) => {
                if (courseCreated && !(courseCreated instanceof TRPCError)) {
                  void router.push(
                    `/creator/dashboard/course/${courseCreated?.id}`
                  );
                  void revalidate(`/course/${courseCreated?.id}`);
                  void revalidate(
                    `/${courseCreated?.creator?.creatorProfile ?? ""}`
                  );
                }
              },
              onError: () => {
                errorToast("Error in importing course from YouTube!");
              },
            });
          })}
          className="mt-12s mx-auto flex w-full flex-col gap-4"
        >
          <div className="flex w-full items-start gap-4">
            <div className="relative flex aspect-video w-1/3 items-end justify-start overflow-hidden rounded-xl bg-neutral-700">
              {!!methods.getValues("thumbnail") && (
                <Image
                  src={methods.getValues("thumbnail")}
                  alt="thumbnail"
                  fill
                  className="object-cover"
                />
              )}
            </div>
            <div className="w-2/3">
              <label
                htmlFor="title"
                className="text-xs font-medium uppercase tracking-wider text-neutral-400"
              >
                Title
              </label>
              <p className="w-full text-sm font-medium text-neutral-200 duration-300 sm:text-base">
                {methods.watch()?.title}
              </p>

              <label
                htmlFor="description"
                className="mt-2 text-xs font-medium uppercase tracking-wider text-neutral-400"
              >
                Description
              </label>
              <p className="hide-scroll max-h-24 overflow-y-auto text-xs sm:text-sm">
                {methods.watch()?.description}
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3">
            <div className="flex w-full justify-between">
              <label
                htmlFor="description"
                className="text-lg  text-neutral-200"
              >
                {methods.watch()?.chapters.length !== 0 &&
                  methods.watch()?.chapters.length}{" "}
                Chapters
              </label>
              {/* <button
                type="button"
                className="flex items-center gap-1 rounded-lg border border-pink-600 px-3 py-1 text-sm font-semibold text-pink-600 duration-300 hover:bg-pink-600 hover:text-neutral-200"
              >
                <PlusIcon className="w-4" /> Add Course block
              </button> */}
            </div>
            <div className="max-h-[24rem] overflow-y-auto pr-2">
              {methods.watch()?.chapters.length > 0 ? (
                methods.watch()?.chapters.map((chapter, index) => (
                  <div
                    className="flex items-center gap-2 rounded-xl p-2 duration-150 hover:bg-neutral-800"
                    key={chapter.title + index.toString()}
                  >
                    <p className="text-sm text-neutral-300">{index + 1}</p>
                    <div className="relative mb-2 aspect-video w-40 overflow-hidden rounded-lg">
                      <Image
                        src={chapter?.thumbnail ?? ""}
                        alt={chapter?.title ?? ""}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex h-full w-full flex-col items-start gap-1">
                      <h5 className="font-medium">{chapter.title}</h5>
                      <label className="flex items-center gap-1 text-xs text-neutral-300">
                        <ClockIcon className="w-4" />
                        {chapter?.duration} min
                      </label>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-neutral-400">
                  Select your Youtube playlist above to populate chapters here.
                </p>
              )}
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3">
            <label htmlFor="description" className="text-lg  text-neutral-200">
              Price
            </label>
            <div className="flex items-center gap-2">
              <div
                className={`flex cursor-pointer items-center gap-1 rounded-lg border p-1 px-3 ${
                  methods.watch().price === "0"
                    ? "border-green-500 bg-green-500/70"
                    : "border-neutral-400 text-neutral-400"
                }`}
                onClick={() => {
                  methods.setValue("price", "0");
                }}
              >
                <div className="h-3 w-3 rounded-full border border-neutral-300 p-[1px]">
                  {methods.watch().price === "0" ? (
                    <div className="h-full w-full rounded-full bg-neutral-300" />
                  ) : (
                    <></>
                  )}
                </div>{" "}
                Free
              </div>

              <div
                className={`flex cursor-pointer items-center gap-1 rounded-lg border p-1 px-3 ${
                  methods.watch().price !== "0"
                    ? "border-pink-600 bg-pink-600/70"
                    : "border-neutral-400 text-neutral-400"
                }`}
                onClick={() => {
                  methods.setValue("price", "50");
                }}
              >
                <div className="h-3 w-3 rounded-full border border-neutral-300 p-[1px]">
                  {methods.watch().price !== "0" ? (
                    <div className="h-full w-full rounded-full bg-neutral-300" />
                  ) : (
                    <></>
                  )}
                </div>{" "}
                Paid
              </div>
            </div>
            {methods.watch().price !== "0" ? (
              <div className="relative flex w-full max-w-[7rem] items-center">
                <input
                  type="number"
                  {...methods.register("price")}
                  className="peer block w-full rounded-xl border border-neutral-700 bg-neutral-800 px-3 py-2 pl-8 placeholder-neutral-500 outline-none ring-transparent transition duration-300 [appearance:textfield] hover:border-neutral-500 focus:border-neutral-400 focus:ring-neutral-500 active:outline-none active:ring-transparent [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  placeholder="00"
                  defaultValue={50}
                />
                <p className="absolute ml-3 text-neutral-400 duration-150 peer-focus:text-neutral-300">
                  ₹
                </p>
              </div>
            ) : (
              <></>
            )}
          </div>
          <div className="flex w-full flex-col items-center">
            <button
              className={`group inline-flex w-full items-center justify-center gap-[0.15rem] rounded-xl bg-pink-600 px-[1.5rem] py-2  text-center text-lg font-medium text-neutral-200 transition-all duration-300 hover:bg-pink-700 disabled:bg-neutral-700 disabled:text-neutral-300`}
              type="submit"
              disabled={methods.formState.isSubmitting}
            >
              {importCourseMutationLoading ? (
                <Loader white />
              ) : (
                <PlusCircleIcon className="mr-1 w-5" />
              )}
              Import Course
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};
export default Index;
