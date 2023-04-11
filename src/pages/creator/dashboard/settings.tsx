import { api } from "@/utils/api";
import Head from "next/head";
import Image from "next/image";
import { FaSave } from "react-icons/fa";
import { Loader } from "@/components/Loader";
import { DashboardLayout } from ".";
import { useEffect, useState } from "react";
import { BsUpload } from "react-icons/bs";

const Settings = () => {
  const { data: creator, isLoading } = api.creator.getProfile.useQuery();
  const { mutateAsync: updateProfile } =
    api.creator.updateProfile.useMutation();

  const [updating, setUpdating] = useState<boolean>(false);

  const [bio, setBio] = useState<string>(creator?.bio ?? "");
  const [name, setName] = useState<string>(creator?.name ?? "");
  const [image, setImage] = useState<string>(creator?.image ?? "");
  const [creatorProfile, setCreatorProfile] = useState<string>(
    creator?.creatorProfile ?? ""
  );

  useEffect(() => {
    setName(creator?.name ?? "");
    setBio(creator?.bio ?? "");
    setCreatorProfile(creator?.creatorProfile ?? "");
    setImage(creator?.image ?? "");
  }, [creator]);

  if (isLoading)
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader />
      </div>
    );

  const handleUpdate = async () => {
    setUpdating(true);
    try {
      await updateProfile({ bio, name, creatorProfile });
    } catch (error) {
      console.log(error);
    }
    setUpdating(false);
  };

  return (
    <>
      <Head>
        <title>Settings | Dashboard</title>
      </Head>
      <div className="mx-5 my-10 w-full">
        <div className="my-5 flex flex-col items-center rounded-xl p-5">
          {/* <h2 className="mb-5 text-2xl">Profile</h2> */}
          <div className="relative mb-5">
            <div
              className={`relative mb-5 aspect-square w-28 overflow-hidden rounded-full border border-neutral-900 outline outline-neutral-800 transition-all`}
            >
              <Image src={image} alt={name} fill />
            </div>
            <div className="absolute bottom-4 right-2 z-50 cursor-pointer rounded-full bg-neutral-800 p-2 text-base transition-all duration-300 hover:bg-neutral-700">
              <BsUpload />
            </div>
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
                    value={name}
                    onChange={(e) => setName(e.target.value)}
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
                    value={creatorProfile}
                    onChange={(e) => setCreatorProfile(e.target.value)}
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
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  id="input-group-2"
                  className="block w-full rounded-xl border border-neutral-700 bg-neutral-800 px-3 py-2 placeholder-neutral-400 outline-none ring-transparent transition duration-300 hover:border-neutral-500 focus:border-neutral-400 focus:ring-neutral-500 active:outline-none active:ring-transparent"
                  placeholder="I am this, and this and this"
                />
              </div>
            </div>
            <button
              onClick={() => void handleUpdate()}
              className={`group my-5 inline-flex items-center gap-1 rounded-xl bg-pink-600 px-6 py-2 text-center font-medium text-white transition-all duration-300 hover:bg-pink-700 `}
            >
              {updating ? <Loader /> : <FaSave />} Save Changes
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
export default Settings;

Settings.getLayout = DashboardLayout;
