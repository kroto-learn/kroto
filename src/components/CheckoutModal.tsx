import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import { type Dispatch, Fragment, type SetStateAction, useState } from "react";
import { type Discount, type Course } from "@prisma/client";
import ImageWF from "@/components/ImageWF";
import { api } from "@/utils/api";
import { initializeRazorpay } from "@/helpers/razorpay";
import useToast from "@/hooks/useToast";
import { useSession } from "next-auth/react";
import { MinusCircleIcon, TicketIcon } from "@heroicons/react/24/outline";
import ApplyPromoCodeModal from "./ApplyPromoCodeModal";

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
  const { data: session } = useSession();
  const { errorToast } = useToast();
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [applyPromoCodeModal, setApplyPromoCodeModal] = useState(false);

  const isDiscount =
    course?.permanentDiscount !== null ||
    (course?.discount &&
      course?.discount?.deadline?.getTime() > new Date().getTime());

  const discount =
    course?.discount &&
    course?.discount?.deadline?.getTime() > new Date().getTime()
      ? course?.discount?.price
      : course?.permanentDiscount ?? 0;

  const price = isDiscount
    ? discount - (promoDiscount / 100) * discount
    : course?.price - (promoDiscount / 100) * course?.price;

  const {
    mutateAsync: createCourseOrder,
    // isLoading: createCourseOrderLoading,
  } = api.enrollmentCourse.createBuyCourseOrder.useMutation();

  const {
    mutateAsync: verifyCoursePurchase,
    // isLoading: verifyCoursePurchaseLoading,
  } = api.enrollmentCourse.verifyCoursePurchase.useMutation();

  const handleEnrollCourse = async () => {
    const razorpaySDK = await initializeRazorpay();

    if (!razorpaySDK) {
      errorToast("Something went wrong. Please try again later.");
    }

    const courseOrder = await createCourseOrder({ courseId: course.id });

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
      name: "Kroto",
      currency: courseOrder.currency,
      amount: courseOrder.amount,
      order_id: courseOrder.id,
      description: "Hope you make the most out of this course :)",
      image: "https://kroto.in/kroto-logo-p.png",
      prefill: {
        name: session?.user?.name,
        email: session?.user?.email,
      },
      handler: async (response: {
        razorpay_payment_id: string;
        razorpay_order_id: string;
        razorpay_signature: string;
      }) => {
        await verifyCoursePurchase({
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature,
          courseId: course.id,
        });
        setIsOpen(false);
      },
    };

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    const paymentObject = new window.Razorpay(options);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    paymentObject.open();
  };

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
                        {course._count.chapters > 0 ? (
                          <p
                            className={`flex items-center text-xs text-neutral-300`}
                          >
                            {course._count.chapters} Chapters
                          </p>
                        ) : (
                          <></>
                        )}
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
                  <div className="mb-2 flex items-center justify-between gap-4 ">
                    <Link
                      className="text-sm text-neutral-400 hover:text-neutral-200"
                      href="/refund-policy"
                    >
                      Refund Policy
                    </Link>

                    {promoDiscount <= 0 ? (
                      <button
                        onClick={() => setApplyPromoCodeModal(true)}
                        className="flex items-center gap-1 text-sm font-bold"
                      >
                        <TicketIcon className="w-5 text-pink-600" />
                        Apply Promo Code
                      </button>
                    ) : (
                      <button
                        onClick={() => setPromoDiscount(0)}
                        className="flex items-center gap-1 text-xs font-bold"
                      >
                        <MinusCircleIcon className="w-4 text-red-600" />
                        Remove Promo Code
                      </button>
                    )}
                  </div>
                  <div className="mb-4 flex w-full flex-col">
                    <div className="flex w-full justify-between px-1 py-1">
                      <label>Price</label>
                      <p>₹{(course?.price).toFixed(2)}</p>
                    </div>
                    <div className="flex w-full justify-between px-1 py-1">
                      <label>Charges</label>
                      <p>₹{(0.02 * price).toFixed(2)}</p>
                    </div>
                    {isDiscount ? (
                      <div className="flex w-full justify-between px-1 py-1">
                        <label>Discount</label>
                        <p className="text-green-500">
                          -
                          {100 -
                            parseFloat(
                              ((discount / course?.price ?? 1) * 100).toFixed(2)
                            )}
                          %
                        </p>
                      </div>
                    ) : (
                      <></>
                    )}
                    {promoDiscount > 0 ? (
                      <div className="flex w-full justify-between px-1 py-1">
                        <label>Promo Code Discount</label>
                        <p className="text-green-500">-{promoDiscount}%</p>
                      </div>
                    ) : (
                      <></>
                    )}
                    <div className="flex w-full justify-between border-b border-t border-neutral-300 px-1 py-1">
                      <label>To pay</label>
                      <p className="text-xl font-bold">
                        ₹{(price + 0.02 * price).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      void handleEnrollCourse();
                    }}
                    className="flex w-full items-center justify-center rounded-lg bg-pink-500 px-3 py-2  text-center font-bold uppercase tracking-wider duration-150 hover:bg-pink-600"
                  >
                    Checkout
                  </button>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      <ApplyPromoCodeModal
        isOpen={applyPromoCodeModal}
        setIsOpen={setApplyPromoCodeModal}
        setPromoDiscount={setPromoDiscount}
        courseId={course?.id}
      />
    </>
  );
}
