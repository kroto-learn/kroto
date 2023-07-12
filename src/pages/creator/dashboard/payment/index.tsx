import { DashboardLayout } from "..";
import Head from "next/head";
import { Dialog, Transition } from "@headlessui/react";
import {
  CircleStackIcon,
  EyeIcon,
  IdentificationIcon,
  CurrencyRupeeIcon,
} from "@heroicons/react/24/outline";
import { api } from "@/utils/api";
import SavingAccount from "@/components/SavingAccounts";
import CurrentAccount from "@/components/CurrentAccount";
import { Fragment, useState } from "react";

const Index = () => {
  const { data: paymentDetails } = api.example.getPaymentDetails.useQuery();

  const [isSaving, setIsSaving] = useState<boolean>(true);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <>
      <Head>
        <title>Payments | Dashboard</title>
      </Head>
      <div className="flex min-h-screen w-full flex-col gap-4 p-8">
        <div className="flex w-full flex-col gap-2">
          <h1 className="text-2xl font-bold text-neutral-200">Payments</h1>
          <div className="flex gap-8 py-2">
            <div className=" flex w-3/12 flex-col gap-1 rounded-lg bg-neutral-900 px-6 py-8">
              <EyeIcon className="w-5 text-pink-500" />
              <p className="font-semibold">Balance</p>
              <div className="flex gap-2">
                <CurrencyRupeeIcon className="w-4 text-neutral-500" />
                <p className="font-bold">
                  {paymentDetails?.withdrawAmount ?? "0"}
                </p>
              </div>
              <button className="w-4/12 rounded-2xl border  border-pink-600 bg-pink-600 px-2 py-1 text-sm font-bold text-neutral-200 transition  duration-300 hover:bg-pink-700">
                Withdraw
              </button>
            </div>
            <div className=" flex w-3/12 flex-col gap-2 rounded-lg bg-neutral-900 px-6 py-6">
              <CircleStackIcon className="w-5 text-pink-500" />
              <p className="font-semibold">Lifetime earning</p>
              <div className="flex gap-2">
                <CurrencyRupeeIcon className="w-4 text-neutral-500" />
                <p className="font-bold">
                  {paymentDetails?.lifeTimeEarnings ?? "0"}
                </p>
              </div>
            </div>
            <div className=" flex w-3/12 flex-col gap-2 rounded-lg bg-neutral-900 px-6 py-6">
              <IdentificationIcon className="w-5 text-pink-500" />
              <p className="font-semibold">Bank Details</p>
              <div className="flex">
                <button
                  onClick={() => {
                    setIsOpen(true);
                  }}
                  type="button"
                  className="rounded-2xl bg-pink-600 px-5 py-1  hover:bg-pink-700"
                >
                  update
                </button>
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
                            <Dialog.Title
                              as="div"
                              className="flex w-full flex-col gap-4"
                            >
                              <div className="flex w-full justify-between">
                                Bank Details
                              </div>
                            </Dialog.Title>
                            <div className="flex flex-col gap-2 p-2">
                              <p className="mb-1 text-xs uppercase tracking-widest">
                                Account Type
                              </p>
                              <div className="flex gap-2 pb-3">
                                <button
                                  onClick={() => setIsSaving(true)}
                                  className={`rounded-3xl ${
                                    isSaving
                                      ? "bg-pink-600 text-neutral-200"
                                      : "text-pink-500"
                                  } border border-pink-500 px-2 py-1 text-sm font-bold  transition duration-300 `}
                                >
                                  Saving
                                </button>
                                <button
                                  onClick={() => setIsSaving(false)}
                                  className={`rounded-3xl ${
                                    !isSaving
                                      ? "bg-pink-600 text-neutral-200"
                                      : "text-pink-500"
                                  } border border-pink-500 px-2 py-1 text-sm font-bold  transition duration-300 `}
                                >
                                  Current
                                </button>
                              </div>
                              {isSaving ? (
                                <SavingAccount setIsOpen={setIsOpen} />
                              ) : (
                                <CurrentAccount setIsOpen={setIsOpen} />
                              )}
                            </div>
                          </Dialog.Panel>
                        </Transition.Child>
                      </div>
                    </div>
                  </Dialog>
                </Transition>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Index;

Index.getLayout = DashboardLayout;
