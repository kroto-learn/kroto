import { Menu, Transition } from "@headlessui/react";
import Image from "next/image";
import { Fragment } from "react";

const Index = () => {
  return (
    <div className="h-screen w-full rounded-lg border border-neutral-700 bg-neutral-200/5 backdrop-blur">
      <div className="relative flex h-full w-full flex-col items-start">
        <div className="flex flex-col items-start justify-start gap-12 p-16">
          <h3 className="m-0 p-0 text-3xl font-bold text-pink-500">
            Have some doubts in our courses?
          </h3>
          <h3 className="m-0 max-w-xl p-0 text-4xl font-bold text-neutral-200">
            Book a free 1:1 Doubt resolving session with our experts!
          </h3>
          <Menu as="div" className="relative inline-block text-left">
            <div className="flex flex-col items-end">
              <Menu.Button
                as="button"
                className="z-2 mt-1 rounded-lg bg-pink-500 px-8 py-3 text-2xl font-bold hover:bg-pink-600 hover:text-neutral-200"
              >
                Book now
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute left-0 top-[4rem] mt-2 flex w-40 origin-top-right flex-col divide-y divide-neutral-800 overflow-hidden rounded-xl bg-neutral-900/80 backdrop-blur-sm duration-300">
                  <Menu.Item>
                    <button
                      data-cal-link="rosekamallove/15min"
                      className={`w-full px-2 py-1 text-sm font-bold transition-all duration-300 hover:text-pink-500 active:text-pink-600`}
                    >
                      15 mins call
                    </button>
                  </Menu.Item>
                  <Menu.Item>
                    <button
                      data-cal-link="rosekamallove/30min"
                      className={`w-full px-2 py-1 text-sm font-bold transition-all duration-300 hover:text-pink-500 active:text-pink-600`}
                    >
                      30 mins call
                    </button>
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </div>
          </Menu>
        </div>

        <div className="absolute bottom-0 -z-10 h-16 w-full rounded-b-lg bg-neutral-800" />
        <Image
          src="/book-ta.png"
          alt="Book TA Session"
          width={824}
          height={496}
          className="absolute bottom-0 right-0"
        />
      </div>
    </div>
  );
};

export default Index;
