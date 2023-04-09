import Footer from "../Footer";
import Navbar from "../Navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      {/* <Head> */}
      {/*   <title>{title ?? "Rose Kamal Love"}</title> */}
      {/*   <meta property="og:title" content={title ?? "Rose Kamal Love"} /> */}
      {/*   <meta */}
      {/*     property="og:description" */}
      {/*     content="A friendly ambivert who loves writing code, with a craving to create music. I take photos too" */}
      {/*   /> */}
      {/*   <meta name="description" content="@rosekamallove on the web" /> */}
      {/*   <meta name="author" content="Rose Kamal Love" /> */}
      {/*   <meta name="twitter:title" content="Rose Kamal Love" /> */}
      {/*   <meta name="twitter:card" content="summary_large_image" /> */}
      {/*   <meta name="twitter:site" content="@RoseKamalLove1" /> */}
      {/*   <meta name="twitter:creator" content="@RoseKamalLove1" /> */}
      {/*   <meta property="og:site_name" content="Rose Kamal Love" /> */}
      {/*   <meta name="og:title" content="Rose Kamal Love" /> */}
      {/*   <meta property="og:type" content="website" /> */}
      {/* </Head> */}
      {/* <header className="mt-10 flex justify-center"> */}
      {/*   {home ? <></> : ""} */}
      {/* </header> */}
      <nav>
        <Navbar />
      </nav>
      <main className="mt-20">{children}</main>

      {/* {!home && ( */}
      {/*   <div> */}
      {/*     <Link href="/"> */}
      {/*       <p className="absolute left-0 top-3 ml-3 flex cursor-pointer items-center rounded-full bg-gray-200/60 p-2 shadow backdrop-blur-sm transition-all hover:scale-105 hover:bg-gray-200/100 hover:text-black focus:scale-100 dark:bg-neutral-900/70 dark:hover:bg-neutral-900/100 dark:hover:text-white md:top-5 md:-ml-4"> */}
      {/*         <RxCaretLeft /> */}
      {/*       </p> */}
      {/*     </Link> */}
      {/*   </div> */}
      {/* )} */}
      <Footer />
    </div>
  );
}
