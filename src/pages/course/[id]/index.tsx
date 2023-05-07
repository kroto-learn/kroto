import { Loader } from "@/components/Loader";
import Layout from "@/components/layouts/main";
import { generateSSGHelper } from "@/server/helpers/ssgHelper";
import { api } from "@/utils/api";
import { ArrowRightIcon, PlayIcon } from "@heroicons/react/20/solid";
import { type GetStaticPropsContext } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { type ParsedUrlQuery } from "querystring";

type Props = {
  courseId: string;
};

const Index = ({ courseId }: Props) => {
  const { data: course } = api.course.getCourse.useQuery({ id: courseId });

  return (
    <Layout>
      <Head>
        <title>{course?.title}</title>
        <meta name="description" content={course?.description ?? ""} />

        {/* Google SEO */}
        <meta itemProp="name" content={course?.title ?? ""} />
        <meta itemProp="description" content={course?.description ?? ""} />
        {/* <meta itemProp="image" content={course?.ogImage ?? dynamicOgImage} /> */}
        {/* Facebook meta */}
        <meta property="og:title" content={course?.title ?? ""} />
        <meta property="og:description" content={course?.description ?? ""} />
        {/* <meta property="og:image" content={course?.ogImage ?? dynamicOgImage} /> */}
        {/* <meta property="image" content={course?.ogImage ?? dynamicOgImage} /> */}
        <meta
          property="og:url"
          content={`https://kroto.in/course/${course?.id ?? ""}`}
        />
        <meta property="og:type" content="website" />
        {/* twitter meta */}
        <meta name="twitter:title" content={course?.title ?? ""} />
        <meta name="twitter:description" content={course?.description ?? ""} />
        {/* <meta
          name="twitter:image"
          content={course?.ogImage ?? dynamicOgImage}
        /> */}
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <main className="mx-auto -mt-10 flex h-[98vh] w-full max-w-4xl gap-4 overflow-x-hidden py-12">
        <div className="flex h-full w-[30rem] flex-col items-start gap-2 rounded-xl bg-gradient-to-b from-neutral-600 via-neutral-700 to-transparent p-4 backdrop-blur-sm">
          <div className="relative mb-2 aspect-video w-full content-center overflow-hidden rounded-xl">
            <Image
              src={course?.thumbnail ?? ""}
              alt={course?.title ?? ""}
              fill
            />
          </div>
          <h2 className="mb-2 text-xl font-semibold">{course?.title}</h2>

          <Link
            href={`/${course?.creator.creatorProfile ?? ""}`}
            className="group flex items-center gap-2"
          >
            <Image
              src={course?.creator.image ?? ""}
              alt={course?.creator.name ?? ""}
              className="aspect-square rounded-full"
              width={18}
              height={18}
            />
            <p className="text-sm text-neutral-300 duration-150 group-hover:text-neutral-200 group-hover:underline">
              {course?.creator.name}
            </p>
          </Link>

          <button
            className={`group my-4 inline-flex items-center justify-center gap-[0.15rem] rounded-xl bg-pink-500 px-6 py-1  text-center font-medium text-neutral-200 transition-all duration-300 hover:bg-pink-600`}
          >
            {false ? (
              <div>
                <Loader white />
              </div>
            ) : (
              <>
                <PlayIcon className="w-4" />
                <span>Enroll now</span>
              </>
            )}
          </button>

          <p className="text-sm text-neutral-300">{course?.description}</p>
        </div>
        <div className="flex w-full flex-col gap-2">
          {course?.CourseBlockVideos.map((cbv) => (
            <h4 key={cbv.id} className="text-xl font-semibold">
              {cbv.title}
            </h4>
          ))}
        </div>
      </main>
    </Layout>
  );
};

export default Index;

export function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
}

interface CParams extends ParsedUrlQuery {
  id: string;
}

export async function getStaticProps(context: GetStaticPropsContext) {
  const ssg = generateSSGHelper();
  const courseId = (context.params as CParams).id;

  if (typeof courseId !== "string") throw new Error("no slug");

  await ssg.course.getCourse.prefetch({ id: courseId });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      courseId,
    },
  };
}
