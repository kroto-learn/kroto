import AnimatedSection from "@/components/AnimatedSection";
import ImageWF from "@/components/ImageWF";
import { Loader } from "@/components/Loader";
import Layout from "@/components/layouts/main";
import { generateSSGHelper } from "@/server/helpers/ssgHelper";
import { api } from "@/utils/api";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { BookOpenIcon } from "@heroicons/react/24/outline";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Index = () => {
  const { data: categories } = api.course.getCategories.useQuery();
  const router = useRouter();
  const { category } = router.query as { category: string | undefined };

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedQuery, setDebouncedQuery] = useState<string>("");

  const { data: courses, isLoading: coursesLoading } =
    api.course.getAllPublic.useQuery({
      searchQuery: debouncedQuery,
      categoryTitle: category,
    });

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timerId);
  }, [searchQuery]);

  return (
    <Layout>
      <Head>
        <title>Discover Courses | Kroto</title>
        <meta name="description" content="Discover courses on Kroto" />
      </Head>
      <main className="flex h-full min-h-screen w-full flex-col items-center overflow-x-hidden p-4 pb-24">
        <AnimatedSection className="flex w-full max-w-4xl flex-col items-center gap-2">
          <h3>All Categories</h3>
          <div className="flex w-full flex-wrap justify-center gap-2">
            {categories?.map((catg) => (
              <Link
                key={catg?.id}
                href={
                  category === catg?.title
                    ? "/courses"
                    : `/courses?category=${catg?.title}`
                }
                className={`rounded-full border border-neutral-500 px-3 py-1 text-xs font-bold uppercase ${
                  category === catg?.title
                    ? "border-pink-500 bg-pink-500 text-neutral-200"
                    : "text-neutral-300/50"
                }`}
              >
                {catg?.title}
              </Link>
            ))}
          </div>
        </AnimatedSection>

        <AnimatedSection
          delay={0.1}
          className="mt-8 flex w-full max-w-4xl flex-col gap-4"
        >
          <div className="relative mb-4 flex items-center">
            <input
              placeholder="What do you want to learn today?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="peer w-full rounded-lg bg-pink-500/10 px-3 py-2 pl-8 font-medium text-neutral-200   outline outline-2 outline-pink-500/40 backdrop-blur-sm transition-all duration-300 placeholder:text-neutral-200/50 hover:outline-pink-500/80 focus:outline-pink-500"
            />
            <div className="absolute right-4">{false && <Loader />}</div>

            <MagnifyingGlassIcon className="absolute ml-2 w-4 text-pink-500/50 duration-300 peer-hover:text-pink-500/80 peer-focus:text-pink-500" />
          </div>
          {coursesLoading ? (
            <div className="flex h-60 w-full items-center justify-center">
              <Loader size="lg" />
            </div>
          ) : courses && courses?.length > 0 ? (
            <div className="flex w-full flex-wrap justify-center gap-8">
              {courses?.map((course) => (
                <Link
                  href={`/course/${course?.id}`}
                  key={course.id}
                  className="group relative h-[15.5rem] w-64 rounded-lg border border-neutral-800 bg-neutral-200/5 backdrop-blur-sm duration-150 hover:border-neutral-700"
                >
                  <div className="flex w-full flex-col gap-1 p-2">
                    <div className="relative mb-1 aspect-video w-full overflow-hidden rounded-lg">
                      <ImageWF
                        src={course?.thumbnail ?? ""}
                        alt={course?.title ?? ""}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <title className="line-clamp-2 overflow-hidden text-ellipsis text-sm font-bold text-neutral-200">
                      {course.title}
                    </title>
                    <Link
                      href={`${
                        course?.creator
                          ? `/${course?.creator?.creatorProfile ?? ""}`
                          : `https://www.youtube.com/${
                              course?.ytChannelId ?? ""
                            }`
                      }`}
                      target={!course?.creator ? "_blank" : undefined}
                      className="flex w-full items-center gap-1"
                    >
                      <ImageWF
                        src={
                          course?.creator?.image ?? course?.ytChannelImage ?? ""
                        }
                        alt={
                          course?.creator?.name ?? course?.ytChannelName ?? ""
                        }
                        width={18}
                        height={18}
                        className="rounded-full"
                      />
                      <p className="w-full text-xs duration-150 hover:text-neutral-200 hover:underline">
                        {course?.creator?.name ?? course?.ytChannelName ?? ""}
                      </p>
                    </Link>
                  </div>
                  <div className="absolute bottom-0 flex w-full items-center justify-center gap-1 border-t border-neutral-800 px-2 py-1 text-xs duration-150 group-hover:border-neutral-700">
                    <BookOpenIcon className="w-3" /> {course?._count.chapters}{" "}
                    Chapters
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex w-full flex-col items-center justify-center gap-2 p-4">
              <div className="relative aspect-square w-40 object-contain">
                <ImageWF src="/empty/course_empty.svg" alt="empty" fill />
              </div>
              <p className="mb-2 text-center text-neutral-400">
                Sorry, no courses found!
              </p>
            </div>
          )}
        </AnimatedSection>
      </main>
    </Layout>
  );
};

export async function getStaticProps() {
  const ssg = generateSSGHelper();

  await ssg.course.getCategories.prefetch();
  await ssg.course.getAllPublic.prefetch();

  return {
    props: {
      trpcState: ssg.dehydrate(),
    },
  };
}

export default Index;
