import Link from "next/link";
import { DashboardLayout } from "..";
import { PlusIcon } from "@heroicons/react/20/solid";
import Head from "next/head";
import { api } from "@/utils/api";

const Index = () => {
  const { data: ytplaylist } = api.course.getYoutubePlaylists.useQuery({
    query: "",
  });

  return (
    <>
      <Head>
        <title>Courses | Dashboard</title>
      </Head>
      <div className="flex min-h-screen w-full flex-col items-start justify-start gap-4 p-8">
        <div className="flex w-full items-center justify-between gap-4 px-4">
          <h1 className="text-2xl text-neutral-200">Courses</h1>
          <Link
            href="/course/create"
            className="flex items-center gap-1 rounded-xl border border-pink-600 px-4 py-2 text-sm font-semibold text-pink-600 duration-300 hover:bg-pink-600 hover:text-neutral-200"
          >
            <PlusIcon className="w-5" /> Create Course
          </Link>
        </div>
      </div>
    </>
  );
};

export default Index;

Index.getLayout = DashboardLayout;
