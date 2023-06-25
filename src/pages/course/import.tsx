import Layout from "@/components/layouts/main";
import { generateRandomGradientImages } from "@/helpers/randomGradientImages";
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
  PlusCircleIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
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
import { signIn } from "next-auth/react";
import { Listbox } from "@headlessui/react";
import { MixPannelClient } from "@/analytics/mixpanel";

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
  tags: z.array(z.object({ id: z.string(), title: z.string() })),
  category: z.object({ id: z.string(), title: z.string() }).optional(),
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
      tags: [],
    },
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);

  const [tagInput, setTagInput] = useState("");
  const [tagInputFocused, setTagInputFocused] = useState(false);
  const [debouncedTagInput, setDebouncedTagInput] = useState(tagInput);

  const [showFullDesc, setShowFullDesc] = useState(false);

  const [playlistId, setPlaylistId] = useState("");
  const revalidate = useRevalidateSSG();
  const { data: searchedTags, isLoading: searchingtags } =
    api.tagsCourse.searchTags.useQuery(debouncedTagInput);

  const { data: catgs } = api.categoriesCourse.getCategories.useQuery();

  const { errorToast } = useToast();

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timerId);
  }, [searchQuery]);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedTagInput(tagInput);
    }, 500);

    return () => clearTimeout(timerId);
  }, [tagInput]);

  useEffect(() => {
    methods.setValue("thumbnail", generateRandomGradientImages());
  }, [methods]);

  const { data: playlists } = api.ytCourse.searchYoutubePlaylists.useQuery({
    searchQuery: debouncedQuery,
  });

  const { data: playlistData, isLoading: playlistLoading } =
    api.ytCourse.getYoutubePlaylist.useQuery({
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
      <div className="relative mx-auto my-12 flex min-h-screen w-full max-w-2xl flex-col gap-8 px-4">
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
            <div className="absolute top-36 z-10 mt-2 flex max-h-[65vh] w-full flex-col overflow-y-auto overflow-x-hidden rounded-xl border border-neutral-700 bg-neutral-800/80 backdrop-blur">
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
                    className="group flex w-full items-center gap-2 border-b border-neutral-700 px-4 py-3 duration-150 hover:bg-neutral-800/90"
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
                <div className="flex flex-col gap-2 p-2 text-sm">
                  <p className="text-neutral-300">
                    {"🥲"} No public playlist found in your YouTube account.
                    Make sure you have granted sufficient permissions.
                  </p>
                  <div className="mb-1 flex items-center gap-2">
                    Click below and grant us permission to access your YouTube
                    playlist.
                  </div>
                  <button
                    className="mb-4 flex w-44 items-center gap-1 bg-[#4285F4] pr-2 text-sm font-bold drop-shadow"
                    onClick={() => {
                      void signIn(
                        "google",
                        {
                          callbackUrl: `/course/import`,
                        },
                        {
                          scope: `openid ${[
                            "https://www.googleapis.com/auth/youtube.readonly",
                            "https://www.googleapis.com/auth/userinfo.email",
                            "https://www.googleapis.com/auth/userinfo.profile",
                          ].join(" ")}`,
                        }
                      );
                    }}
                  >
                    <ImageWF
                      src="/btn_google_dark_normal_ios.svg"
                      alt="Google"
                      height={30}
                      width={30}
                    />
                    Sign in with Google
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        <form
          onSubmit={methods.handleSubmit(async (values) => {
            await importCourseMutation(values, {
              onSuccess: (courseCreated) => {
                if (courseCreated && !(courseCreated instanceof TRPCError)) {
                  MixPannelClient.getInstance().courseCreated({
                    courseId: courseCreated?.id,
                  });
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

              {methods.watch().description &&
              methods.watch().description != "" ? (
                <>
                  <label
                    htmlFor="description"
                    className="mt-2 text-xs font-medium uppercase tracking-wider text-neutral-400"
                  >
                    Description
                  </label>
                  <p
                    className={`${
                      !showFullDesc
                        ? "line-clamp-5 overflow-hidden text-ellipsis"
                        : ""
                    } text-xs sm:text-sm`}
                  >
                    {methods.watch()?.description}
                  </p>
                  <button
                    className="font-bold"
                    onClick={() => {
                      setShowFullDesc(!showFullDesc);
                    }}
                  >
                    {!showFullDesc ? "more" : "less"}
                  </button>
                </>
              ) : (
                <></>
              )}
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3">
            <div className="flex w-full justify-between">
              <label htmlFor="chapters" className="text-lg  text-neutral-200">
                {methods.watch()?.chapters.length !== 0 &&
                  methods.watch()?.chapters.length}{" "}
                Chapters
              </label>
            </div>
            <div className="max-h-[24rem] overflow-y-auto pr-2">
              {methods.watch()?.chapters.length > 0 ? (
                methods.watch()?.chapters.map((chapter, index) => (
                  <div
                    className="flex items-center gap-2 rounded-xl p-2 duration-150 hover:bg-neutral-800"
                    key={chapter.title + index.toString()}
                  >
                    <p className="w-8 text-sm text-neutral-300">{index + 1}</p>
                    <div className="relative mb-2 aspect-video w-40 overflow-hidden rounded-lg">
                      <Image
                        src={chapter?.thumbnail ?? ""}
                        alt={chapter?.title ?? ""}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex h-full w-full flex-col items-start gap-1">
                      <h5 className="line-clamp-2 overflow-hidden text-ellipsis text-xs font-medium sm:text-sm">
                        {chapter.title}
                      </h5>
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

          {playlistData ? (
            <div className="mt-4 flex flex-col gap-2">
              <label htmlFor="tags" className="text-lg  text-neutral-200">
                Tags
              </label>
              <div className="flex flex-wrap items-center gap-2">
                {methods.watch().tags.map((tag) => (
                  <span
                    className="flex items-center gap-1 overflow-hidden rounded bg-pink-600/30 pl-2 text-xs"
                    key={tag.id}
                  >
                    {tag.title}{" "}
                    <button
                      onClick={() => {
                        methods.setValue(
                          "tags",
                          methods.watch().tags.filter((t) => t.id !== tag.id)
                        );
                      }}
                      type="button"
                      className="ml-1 p-1 text-neutral-200 duration-150 hover:bg-pink-600"
                    >
                      <XMarkIcon className="w-4" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="relative flex w-full max-w-sm items-center justify-end">
                <input
                  type="text"
                  onFocus={() => setTagInputFocused(true)}
                  onBlur={() =>
                    setTimeout(() => {
                      setTagInputFocused(false);
                    }, 200)
                  }
                  value={tagInput}
                  onChange={(e) => {
                    setTagInput(e?.target?.value.substring(0, 30));
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      methods.setValue("tags", [
                        ...methods.watch().tags,
                        {
                          id: tagInput,
                          title: tagInput,
                        },
                      ]);
                      setTagInput("");
                    }
                  }}
                  className="peer block w-full rounded-xl border border-neutral-700 bg-neutral-800 px-3 py-1 pr-6 text-sm placeholder-neutral-500 outline-none ring-transparent transition duration-300 hover:border-neutral-500 focus:border-neutral-400 focus:ring-neutral-500 active:outline-none active:ring-transparent"
                  placeholder="Add tags..."
                />
                <div className="absolute">
                  {searchingtags ? <Loader /> : <></>}
                </div>
              </div>
              {tagInputFocused && searchedTags && searchedTags?.length > 0 ? (
                <div
                  className={`hide-scroll max-h-60 w-full max-w-sm overflow-y-auto`}
                >
                  <div className="flex w-full flex-col overflow-hidden rounded border border-neutral-600 bg-neutral-800/70 backdrop-blur">
                    {searchedTags?.map((st) => (
                      <button
                        type="button"
                        className="w-full border-b border-neutral-600 px-3 py-1 text-left text-sm hover:text-pink-600"
                        onClick={() => {
                          setTagInput("");
                          if (
                            !methods.watch().tags.find((tg) => tg.id === st.id)
                          )
                            methods.setValue("tags", [
                              ...methods.watch().tags,
                              st,
                            ]);
                        }}
                        key={st.id}
                      >
                        {st.title}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <></>
              )}
            </div>
          ) : (
            <></>
          )}

          {playlistData ? (
            <div className="mt-4 flex flex-col gap-2">
              <label htmlFor="category" className="text-lg  text-neutral-200">
                Category
              </label>
              <div className="relative flex w-full max-w-sm items-center justify-end">
                <Listbox
                  value={methods.watch().category?.id ?? "none"}
                  onChange={(val) => {
                    const selectedCatg = catgs?.find((ctg) => ctg.id === val);
                    if (selectedCatg)
                      methods.setValue("category", selectedCatg);
                    else methods.setValue("category", undefined);
                  }}
                >
                  {({ open }) => (
                    <div className="flex w-full flex-col gap-2">
                      <div className="relative flex w-full items-center justify-end">
                        <Listbox.Button className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 pr-8 text-left">
                          {methods.watch().category?.title ?? "none"}
                        </Listbox.Button>
                        <ChevronDownIcon
                          className={`${
                            open ? "rotate-180 duration-150" : ""
                          } absolute mr-4 w-4`}
                        />
                      </div>
                      <div
                        className={`hide-scroll max-h-60 w-full max-w-sm overflow-y-auto`}
                      >
                        <Listbox.Options className="flex w-full flex-col overflow-hidden rounded border border-neutral-600 bg-neutral-800/70 backdrop-blur">
                          <Listbox.Option
                            key={"none"}
                            value={"none"}
                            className="w-full border-b border-neutral-600 px-3 py-1 text-left text-sm hover:text-pink-600"
                          >
                            none
                          </Listbox.Option>
                          {catgs && catgs.length > 0 ? (
                            catgs.map((ctg) => (
                              <Listbox.Option
                                key={ctg.id}
                                value={ctg.id}
                                className="w-full border-b border-neutral-600 px-3 py-1 text-left text-sm hover:text-pink-600"
                              >
                                {ctg.title}
                              </Listbox.Option>
                            ))
                          ) : (
                            <></>
                          )}
                        </Listbox.Options>
                      </div>
                    </div>
                  )}
                </Listbox>
              </div>
            </div>
          ) : (
            <></>
          )}

          {playlistData ? (
            <div className="mt-4 flex flex-col gap-3">
              <label htmlFor="price" className="text-lg  text-neutral-200">
                Price
              </label>
              <div className="flex items-center gap-2">
                <div
                  className={`flex cursor-pointer items-center gap-2 rounded-lg border p-1 px-3 text-sm font-bold ${
                    methods.watch().price === "0"
                      ? "border-green-600 bg-green-600/40"
                      : "border-neutral-500 text-neutral-500"
                  }`}
                  onClick={() => {
                    methods.setValue("price", "0");
                  }}
                >
                  <div
                    className={`flex h-3 w-3 items-center rounded-full border ${
                      methods.watch().price === "0"
                        ? "border-neutral-300"
                        : "border-neutral-500"
                    }`}
                  >
                    {methods.watch().price === "0" ? (
                      <div className="h-full w-full rounded-full bg-neutral-300" />
                    ) : (
                      <></>
                    )}
                  </div>{" "}
                  Free
                </div>

                <div
                  className={`flex cursor-pointer items-center gap-2 rounded-lg border p-1 px-3 text-sm font-bold ${
                    methods.watch().price !== "0"
                      ? "border-pink-600 bg-pink-600/40"
                      : "border-neutral-500 text-neutral-500"
                  }`}
                  onClick={() => {
                    methods.setValue("price", "50");
                  }}
                >
                  <div
                    className={`flex h-3 w-3 items-center justify-center rounded-full border ${
                      methods.watch().price !== "0"
                        ? "border-neutral-300"
                        : "border-neutral-500"
                    }`}
                  >
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
          ) : (
            <></>
          )}

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
