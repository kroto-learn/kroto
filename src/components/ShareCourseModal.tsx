import useToast from "@/hooks/useToast";
import { Dialog, Transition } from "@headlessui/react";
import { LinkIcon, ShareIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { type Dispatch, Fragment, type SetStateAction } from "react";
import {
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "next-share";
import { MixPannelClient } from "@/analytics/mixpanel";
import { useSession } from "next-auth/react";

export default function ShareCourseModal({
  courseId,
  courseTitle,
  isOpen,
  setIsOpen,
}: {
  courseId: string;
  courseTitle: string;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const { successToast } = useToast();

  const courseUrl = `https://kroto.in/course/${courseId}`;

  const session = useSession();

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setIsOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-6 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-neutral-800 p-4 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title as="div" className="flex w-full flex-col gap-4">
                    <div className="flex w-full justify-between">
                      <h3 className="ml-2 flex items-center gap-2 text-xl font-medium text-neutral-200">
                        <ShareIcon className="w-4" /> Share Course
                      </h3>
                      <button
                        onClick={() => {
                          setIsOpen(false);
                        }}
                        type="button"
                        className="ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-neutral-400 hover:bg-neutral-600"
                      >
                        <XMarkIcon className="w-5" />
                      </button>
                    </div>
                  </Dialog.Title>
                  <div className="flex flex-col gap-4 p-6">
                    <p className="text-center text-neutral-300">
                      Share the <span className="font-bold">{courseTitle}</span>{" "}
                      course among your friends!
                    </p>
                    <div className="flex items-center justify-center gap-3">
                      <button
                        className="aspect-square rounded-full bg-neutral-700 p-2 grayscale duration-300 hover:bg-neutral-600 hover:grayscale-0"
                        onClick={() => {
                          void navigator.clipboard.writeText(courseUrl);
                          successToast("Course URL copied to clipboard!");
                          MixPannelClient.getInstance().courseSharedType({
                            courseId,
                            userId: session.data?.user?.id ?? "",
                            type: "copy-link",
                          });
                        }}
                      >
                        <LinkIcon className="w-5" />
                      </button>
                      <LinkedinShareButton
                        url={courseUrl}
                        onClick={() => {
                          MixPannelClient.getInstance().courseSharedType({
                            courseId,
                            userId: session.data?.user?.id ?? "",
                            type: "linkedin",
                          });
                        }}
                      >
                        <LinkedinIcon
                          size={36}
                          round
                          className="grayscale duration-300 hover:grayscale-0"
                        />
                      </LinkedinShareButton>
                      <FacebookShareButton
                        url={courseUrl}
                        quote={`Enroll the "${courseTitle}" course on Kroto.in`}
                        hashtag={"#kroto"}
                        onClick={() => {
                          MixPannelClient.getInstance().courseSharedType({
                            courseId,
                            userId: session.data?.user?.id ?? "",
                            type: "facebook",
                          });
                        }}
                      >
                        <FacebookIcon
                          size={36}
                          round
                          className="grayscale duration-300 hover:grayscale-0"
                        />
                      </FacebookShareButton>
                      <TwitterShareButton
                        url={courseUrl}
                        title={`Enroll the "${courseTitle}" course on Kroto`}
                        onClick={() => {
                          MixPannelClient.getInstance().courseSharedType({
                            courseId,
                            userId: session.data?.user?.id ?? "",
                            type: "twitter",
                          });
                        }}
                      >
                        <TwitterIcon
                          size={36}
                          round
                          className="grayscale duration-300 hover:grayscale-0"
                        />
                      </TwitterShareButton>
                      <WhatsappShareButton
                        url={courseUrl}
                        title={`Enroll the "${courseTitle}" course on Kroto.in`}
                        separator=": "
                        onClick={() => {
                          MixPannelClient.getInstance().courseSharedType({
                            courseId,
                            userId: session.data?.user?.id ?? "",
                            type: "whatsapp",
                          });
                        }}
                      >
                        <WhatsappIcon
                          size={36}
                          round
                          className="grayscale duration-300 hover:grayscale-0"
                        />
                      </WhatsappShareButton>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
