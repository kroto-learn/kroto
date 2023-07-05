import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import { type Dispatch, Fragment, type SetStateAction } from "react";

import { type Discount, type Course } from "@prisma/client";
import ImageWF from "@/components/ImageWF";

export default function CheckoutModal({
  course,
  isOpen,
  setIsOpen,
}: {
  course: Course & {
    _count: {
      chapters: number;
    };
    discount: Discount | null;
  };
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const isDiscount =
    course?.permanentDiscount !== null ||
    (course?.discount &&
      course?.discount?.deadline?.getTime() > new Date().getTime());

  const discount =
    course?.discount &&
    course?.discount?.deadline?.getTime() > new Date().getTime()
      ? course?.discount?.price
      : course?.permanentDiscount ?? 0;

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
                    <div className="flex w-full justify-end">
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
                  <div className="mb-12 flex flex-col gap-3">
                    <p className="text-xl">1 course</p>
                    <div className="flex w-full max-w-lg gap-3 rounded-xl p-2 backdrop-blur-sm duration-150 hover:bg-neutral-200/10">
                      <div
                        className={`relative aspect-video w-40 overflow-hidden rounded-lg`}
                      >
                        <ImageWF
                          src={course?.thumbnail ?? ""}
                          alt={course?.title ?? ""}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex h-full w-full flex-col items-start gap-1">
                        <h5
                          className={`line-clamp-2 overflow-hidden text-ellipsis text-xs font-medium sm:max-h-12 sm:text-base`}
                        >
                          {course?.title}
                        </h5>
                        <p
                          className={`flex items-center text-xs text-neutral-300`}
                        >
                          {course._count.chapters} Chapters
                        </p>
                        {course?.price === 0 ? (
                          <p
                            className={`text-xs font-semibold uppercase tracking-widest text-green-500/80 sm:text-sm`}
                          >
                            free
                          </p>
                        ) : (
                          <p
                            className={`text-xs font-semibold uppercase tracking-wide sm:text-sm`}
                          >
                            ₹{course?.price}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mb-2 text-neutral-400 hover:text-neutral-200">
                    <Link className="text-sm" href="/refund-policy">
                      Refund Policy
                    </Link>
                  </div>
                  <div className="mb-4 flex w-full flex-col">
                    <div className="flex w-full justify-between px-1 py-1">
                      <label>Price</label>
                      <p>₹{course?.price}</p>
                    </div>
                    {isDiscount ? (
                      <div className="flex w-full justify-between px-1 py-1">
                        <label>Discount</label>
                        <p className="text-green-500">
                          -
                          {100 -
                            Math.round((discount / course?.price ?? 1) * 100)}
                          %
                        </p>
                      </div>
                    ) : (
                      <></>
                    )}
                    <div className="flex w-full justify-between border-b border-t border-neutral-300 px-1 py-1">
                      <label>To pay</label>
                      <p className="font-bold">
                        ₹{isDiscount ? discount : course?.price}
                      </p>
                    </div>
                  </div>

                  <button className="flex w-full items-center justify-center rounded-lg bg-pink-500 px-3 py-2  text-center font-bold uppercase tracking-wider duration-150 hover:bg-pink-600">
                    Checkout
                  </button>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
