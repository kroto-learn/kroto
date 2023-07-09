import React, {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useState,
  Fragment,
} from "react";
import { CourseNestedLayout } from ".";
import { PlusIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { api } from "@/utils/api";
import { useRouter } from "next/router";
import { Loader } from "@/components/Loader";
import AnimatedSection from "@/components/AnimatedSection";
import CreatePromoCodeModal from "@/components/CreatePromoCodeModal";
import {
  DocumentDuplicateIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import Switch from "@/components/Switch";
import { type PromoCode } from "@prisma/client";
import UpdatePromoCodeModal from "@/components/UpdatePromoCodeModal";
import useToast from "@/hooks/useToast";
import { Dialog, Transition } from "@headlessui/react";
import Head from "next/head";

const CoursePromoCodes = () => {
  const router = useRouter();
  const { id } = router.query as { id: string };

  const { data: promoCodess, isLoading: promosLoading } =
    api.promoCodeCourse.getAll.useQuery({ courseId: id });

  const { data: course } = api.course.get.useQuery({ id });

  const [createPromoOpen, setCreatePromoOpen] = useState(false);
  const [editPromoCode, setEditPromoCode] = useState<PromoCode | undefined>(
    undefined
  );
  const [deletePromoCode, setDeletePromoCode] = useState<PromoCode | undefined>(
    undefined
  );

  return (
    <>
      <Head>
        <title>{course?.title ?? "Course"} | Promo Codes</title>
      </Head>
      <AnimatedSection
        delay={0.2}
        className="min-h-[80%] w-full max-w-3xl rounded-xl bg-neutral-900 p-6"
      >
        <div className="flex items-center justify-between gap-4">
          <h3 className="mb-6 text-lg font-medium  sm:text-2xl">Promo Codes</h3>

          <button
            onClick={() => setCreatePromoOpen(true)}
            className="flex items-center gap-1 rounded-xl border border-pink-600 px-4 py-2 text-sm font-semibold text-pink-600 duration-300 hover:bg-pink-600 hover:text-neutral-200"
          >
            <PlusIcon className="w-5" /> Create Promo Code
          </button>
        </div>
        {promosLoading ? (
          <div className="flex h-64 w-full items-center justify-center">
            <Loader size="lg" />
          </div>
        ) : promoCodess && promoCodess.length !== 0 ? (
          <div className="flex w-full max-w-sm flex-col gap-4">
            {promoCodess?.map((pc) => (
              <PromoCodeCard
                key={pc.id}
                pc={pc}
                setEditPromoCode={setEditPromoCode}
                setDeletePromoCode={setDeletePromoCode}
              />
            ))}
          </div>
        ) : (
          <div className="flex min-h-[40vh] w-full flex-col items-center justify-center gap-2 p-4">
            <p className="text-5xl font-black text-neutral-400">****</p>
            <p className="mb-2 text-center text-sm text-neutral-400 sm:text-base">
              You have not created any promo codes.
            </p>
          </div>
        )}
      </AnimatedSection>
      <CreatePromoCodeModal
        isOpen={createPromoOpen}
        setIsOpen={setCreatePromoOpen}
        courseId={id}
      />
      <UpdatePromoCodeModal
        editPromoCode={editPromoCode}
        setEditPromoCode={setEditPromoCode}
      />
      <DeletePromoCodeModal
        deletePromoCode={deletePromoCode}
        setDeletePromoCode={setDeletePromoCode}
      />
    </>
  );
};

const PromoCodeCard = ({
  pc,
  setEditPromoCode,
  setDeletePromoCode,
}: {
  pc: PromoCode;
  setEditPromoCode: Dispatch<SetStateAction<PromoCode | undefined>>;
  setDeletePromoCode: Dispatch<SetStateAction<PromoCode | undefined>>;
}) => {
  const { mutateAsync: editActiveMutation } =
    api.promoCodeCourse.editActive.useMutation();

  const [active, setActive] = useState(false);

  useEffect(() => {
    if (pc) setActive(pc.active);
  }, [pc]);

  const ctx = api.useContext();

  return (
    <div className="relative flex w-full flex-col justify-center gap-2 rounded-lg bg-neutral-800">
      <div className="flex items-center justify-between gap-6 p-4 px-8">
        <div className="flex flex-col items-start gap-1">
          <p className="text-xs uppercase tracking-widest text-neutral-400">
            Code
          </p>
          <div className="flex items-center gap-1 text-2xl font-bold tracking-widest text-neutral-100">
            {pc.code}{" "}
            <button>
              <DocumentDuplicateIcon className="w-6 text-pink-600" />
            </button>
          </div>
        </div>
        <div className="flex flex-col items-start gap-1">
          <p className="text-xs uppercase tracking-widest text-neutral-400">
            Discount
          </p>
          <p className="">
            <span className="text-2xl font-bold">{pc.discountPercent}</span>
            <span className="font-bold text-pink-600">%</span>
          </p>
        </div>
      </div>
      <div className="flex w-full items-center justify-between gap-2 border-t border-neutral-700 p-1 px-4">
        <div className="flex items-center gap-1">
          <p className="text-sm">Active</p>
          <Switch
            value={active}
            onClick={() => {
              setActive(!pc.active);
              void editActiveMutation(
                {
                  promoId: pc.id,
                  active: !pc.active,
                },
                {
                  onSuccess: () => {
                    void ctx.promoCodeCourse.getAll.invalidate();
                  },
                }
              );
            }}
          />
        </div>

        <div className="flex items-center gap-3">
          <button onClick={() => setEditPromoCode(pc)}>
            <PencilSquareIcon className="w-4" />
          </button>
          <button onClick={() => setDeletePromoCode(pc)}>
            <TrashIcon className="w-4" />
          </button>
        </div>
      </div>

      <div className="absolute -right-4 aspect-square h-8 rounded-full bg-neutral-900" />
      <div className="absolute -left-4 aspect-square h-8 rounded-full bg-neutral-900" />
    </div>
  );
};

export function DeletePromoCodeModal({
  deletePromoCode,
  setDeletePromoCode,
}: {
  deletePromoCode: PromoCode | undefined;
  setDeletePromoCode: Dispatch<SetStateAction<PromoCode | undefined>>;
}) {
  const { mutateAsync: deleteMutation, isLoading } =
    api.promoCodeCourse.delete.useMutation();
  const ctx = api.useContext();
  const { errorToast } = useToast();

  return (
    <>
      <Transition appear show={!!deletePromoCode} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setDeletePromoCode(undefined)}
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
                      <h3 className="ml-2 text-xl font-medium text-neutral-200">
                        Delete Promo Code
                      </h3>
                      <button
                        onClick={() => {
                          setDeletePromoCode(undefined);
                        }}
                        type="button"
                        className="ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-neutral-400 hover:bg-neutral-600"
                      >
                        <XMarkIcon className="w-5" />
                      </button>
                    </div>
                  </Dialog.Title>
                  <div className="space-y-6 p-4">
                    <p className="text-base leading-relaxed text-neutral-500 dark:text-neutral-400">
                      Are you sure you want to delete the{" "}
                      <span className="font-bold tracking-widest">
                        {deletePromoCode?.code}
                      </span>{" "}
                      promo code?
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 rounded-b p-4 text-sm dark:border-neutral-600">
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          await deleteMutation(
                            { promoId: deletePromoCode?.id ?? "" },
                            {
                              onSuccess: () => {
                                void ctx.promoCodeCourse.getAll.invalidate();
                                setDeletePromoCode(undefined);
                              },
                              onError: () => {
                                errorToast("Error in deleting promo code!");
                              },
                            }
                          );
                        } catch (err) {
                          console.log(err);
                        }
                      }}
                      className="flex items-center gap-2 rounded-lg bg-red-700 px-5 py-2.5 text-center text-sm font-medium text-neutral-200/70 duration-300 hover:bg-red-500 hover:text-neutral-200"
                    >
                      {isLoading ? <Loader /> : <></>} Delete
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setDeletePromoCode(undefined);
                      }}
                      className="rounded-lg bg-neutral-600 px-5 py-2.5 text-center text-sm font-medium text-neutral-400 duration-300 hover:text-neutral-200"
                    >
                      Cancel
                    </button>
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

export default CoursePromoCodes;

CoursePromoCodes.getLayout = CourseNestedLayout;
