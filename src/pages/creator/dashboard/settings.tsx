import { type Creator } from "interfaces/Creator";
import { getCreatorsClient } from "mock/getCreatorsClient";
import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaSave } from "react-icons/fa";
import DashboardLayout from "./layout";

const Settings = () => {
  const [creator, setCreator] = useState<Creator | undefined>(undefined);
  useEffect(() => {
    const loadCreator = async () => {
      const creators = await getCreatorsClient();
      const mcreator = creators.find((c) => c.id === "@rosekamallove");
      if (mcreator) setCreator(mcreator);
    };
    void loadCreator();
  }, []);
  return (
    <>
      <Head>
        <title>Settings | Dashboard</title>
      </Head>
      <div className="mx-5 my-10 w-full text-neutral-400">
        <div className="my-5 rounded-xl border border-neutral-700 bg-neutral-800 p-5">
          <h2 className="mb-5 text-2xl">Profile</h2>
          <div
            className={`relative mb-5 aspect-square w-28 overflow-hidden rounded-full border border-neutral-900 outline outline-neutral-800 transition-all`}
          >
            <Image
              src={creator?.image_url ?? ""}
              alt={creator?.name ?? ""}
              fill
            />
          </div>
          <div>
            <div className="flex gap-5">
              <div>
                <label className="mb-2 block font-medium text-neutral-400">
                  Name
                </label>
                <div className="relative mb-6">
                  <input
                    type="text"
                    id="input-group-1"
                    className="block min-w-[20rem] rounded-xl border border-neutral-700 bg-neutral-800 px-3 py-2 placeholder-neutral-400 outline-none ring-transparent transition duration-300 hover:border-neutral-500 focus:border-neutral-400 focus:ring-neutral-500 active:outline-none active:ring-transparent"
                    placeholder="Your Name, not your mom's"
                  />
                </div>
              </div>
              <div>
                <label className="mb-2 block font-medium text-neutral-400">
                  Kreator Profile
                </label>
                <div className="flex">
                  <span className="inline-flex items-center rounded-l-xl border border-r-0 border-neutral-600 bg-neutral-700 px-3 font-medium text-neutral-400">
                    kroto.in/@
                  </span>
                  <input
                    type="text"
                    id="website-admin"
                    className="block min-w-[14rem] rounded-r-xl border border-neutral-700 bg-neutral-800 px-3 py-2 placeholder-neutral-400 outline-none ring-transparent transition duration-300 hover:border-neutral-500 focus:border-neutral-400 focus:ring-neutral-500 active:outline-none active:ring-transparent"
                    placeholder="rosekamallove"
                  />
                </div>
              </div>
            </div>
            <div>
              <label className="mb-2 block font-medium text-neutral-400">
                Bio
              </label>
              <div className="relative mb-6">
                <textarea
                  id="input-group-2"
                  className="block w-full rounded-xl border border-neutral-700 bg-neutral-800 px-3 py-2 placeholder-neutral-400 outline-none ring-transparent transition duration-300 hover:border-neutral-500 focus:border-neutral-400 focus:ring-neutral-500 active:outline-none active:ring-transparent"
                  placeholder="I am this, and this and this"
                />
              </div>
            </div>
            <button
              className={`group my-5 inline-flex items-center gap-1 rounded-xl bg-pink-600 px-6 py-2 text-center font-medium text-white transition-all duration-300 hover:bg-pink-700 `}
            >
              <FaSave /> Save Changes
            </button>
          </div>
        </div>
        <div className="my-5 rounded-xl border border-neutral-700 bg-neutral-800 p-5">
          <h2 className="text-2xl">Social Links</h2>
          <div></div>
        </div>
      </div>
    </>
  );
};
export default Settings;

Settings.getLayout = DashboardLayout;
