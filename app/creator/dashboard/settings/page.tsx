import React from "react";

export const metadata = {
  title: "Settings | Dashboard",
};

const Settings = () => {
  return (
    <div className="my-10 text-neutral-400">
      <h1 className="mx-5 text-3xl">Account Settings</h1>
      <div className="mx-5 my-5 rounded-xl bg-neutral-800 p-5">
        <h2 className="text-2xl">Profile</h2>
        <div></div>
      </div>
      <div className="mx-5 my-5 rounded-xl bg-neutral-800 p-5">
        <h2 className="text-2xl">Social Links</h2>
        <div></div>
      </div>
      <div className="mx-5 my-5 rounded-xl bg-neutral-800 p-5">
        <h2 className="text-2xl">Manage Featured</h2>
        <div></div>
      </div>
      <div className="mx-5 my-5 rounded-xl bg-neutral-800 p-5">
        <h2 className="text-2xl">Private Info</h2>
        <div></div>
      </div>
    </div>
  );
};
export default Settings;
