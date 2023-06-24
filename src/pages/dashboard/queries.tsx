import { Loader } from "@/components/Loader";
import Image from "next/image";
import  { CreatorImage,SenderImage, SenderName }  from "@/components/CreatorDetails"
import Layout from "@/components/layouts/main";
import { api } from "@/utils/api";
import { Disclosure } from "@headlessui/react";
import {
  ChevronDownIcon,
} from "@heroicons/react/20/solid";
import Head from "next/head";
import ImageWF from "@/components/ImageWF";
import Link from "next/link";
import { useSession } from "next-auth/react";


const Index = () => {
  const { data: session } = useSession();

  const { data: queries, isLoading: queriesLoading } =
    api.askedQuery.getAllUser.useQuery();  

  if (queriesLoading)
    return (
      <>
        <Head>
          <title>Queries Given | Dashboard</title>
        </Head>
        <div className="flex min-h-screen w-full items-center justify-center">
          <Loader size="lg" />
        </div>
      </>
    );
  return (
    <Layout>
      <Head>
        <title>Queries</title>
      </Head>
      <div className="my-12 flex w-full flex-col items-center p-6">
        <div className="flex min-h-screen w-full max-w-2xl flex-col items-start gap-4">
          <h1 className="text-3xl font-medium">Queries</h1>
          {queries && queries.length > 0 ? (
            <div className="flex w-full flex-col items-start gap-4">
              {queries.map((query) => (
                <Disclosure key={query?.id ?? ""}>
                  {({ open }) => (
                    <>
                    <Disclosure.Button className="z-2 flex w-full items-center justify-between rounded-xl bg-neutral-800 px-4 py-2">
                       <div className={`flex flex-col truncate line-clamp-1 gap-2`}>
                         <Link
                           href={`/${query?.creatorProfile}`}
                           className={`text-center text-neutral-300 transition-all ${open ? "hidden" : ""} duration-300 hover:text-neutral-200 lg:text-left`}
                         >
                         <CreatorImage query={query}/>
                         </Link>
                         <p className={`truncate w-full line-clamp-1 ${open ? "hidden" : ""}`}>{query?.question}</p>
                       </div>
                       {query.answer ? (open ?  "" : <p className="bg-neutral-800 text-xs p-1 rounded-xl">Answered</p>) : "" }
                       <div className="flex gap-2">
                         <ChevronDownIcon
                           className={`${
                             open ? "rotate-180 duration-150" : ""
                           } w-5`}
                         />
                       </div>
                     </Disclosure.Button>
                     <Disclosure.Panel className="realtive z-0 w-full -translate-y-6 rounded-b-xl bg-neutral-800 px-4 py-4 text-gray-300">
                       <div className="w-full">
                           <div className="flex w-full">
                              <div>
                                  <Image className="rounded-full dark:border-gray-800"  src={session?.user.image ?? ""} width={30} height={30} alt={session?.user.name ?? ""}/>
                              </div>
                              <div className="pl-3 w-full" >
                                  <p className="font-bold text-sm">{session?.user.name}</p>
                                  <p className="">{query.question}</p>
                              </div>
                           </div>
                           <div className="flex pt-2 truncate text-ellipsis">
                              <div>
                                  <SenderImage query={query} />
                              </div> 
                              <div className="pl-3">
                                  <SenderName query={query} />
                                  <p>{query.answer}</p>
                              </div>
                           </div>
                       </div>
                     </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
              ))}
            </div>
          ) : (
            <div className="flex w-full flex-col items-center justify-center gap-2 p-4">
              <div className="relative aspect-square w-40 object-contain">
                <ImageWF src="/empty/testimonial_empty.svg" alt="empty" fill />
              </div>
              <p className="mb-2 text-center text-sm text-neutral-400 sm:text-base">
                You have not wrote any Queries.
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Index;
