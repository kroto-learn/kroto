import useToast from "@/hooks/useToast";
import { api } from "@/utils/api";
import { Dialog, Transition } from "@headlessui/react";
import { EnvelopeIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { zodResolver } from "@hookform/resolvers/zod";
import { type Dispatch, Fragment, type SetStateAction } from "react";
import { type UseFormProps, useForm } from "react-hook-form";
import { z } from "zod";
import { Loader } from "./Loader";

const claimCourseSchema = z.object({
  email: z.string().email(),
});

function useZodForm<TSchema extends z.ZodType>(
  props: Omit<UseFormProps<TSchema["_input"]>, "resolver"> & {
    schema: TSchema;
  }
) {
  const form = useForm<TSchema["_input"]>({
    ...props,
    resolver: zodResolver(props.schema, undefined),
  });

  return form;
}

export default function ClaimCourseModal({
  courseId,
  isOpen,
  setIsOpen,
}: {
  courseId: string;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const methods = useZodForm({
    schema: claimCourseSchema,
  });

  const {
    mutateAsync: addClaimCourseRequest,
    isLoading: addClaimCourseLoading,
  } = api.course.addClaimCourseRequest.useMutation();

  const { successToast } = useToast();

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
                      <h2 className="text-xl">Claim your course</h2>
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
                  <form
                    onSubmit={methods.handleSubmit((values) => {
                      void addClaimCourseRequest(
                        { ...values, courseId },
                        {
                          onSuccess: () => {
                            successToast(
                              "Your course claim request was submitted successfully! Our team will contact you through your email shortly."
                            );
                            setIsOpen(false);
                            methods.setValue("email", "");
                          },
                        }
                      );
                    })}
                    className="w-full"
                  >
                    <p className="my-4">
                      If you are the creator of this course, claim this course
                      now and get access to features like{" "}
                      <strong>database of your audience</strong>,{" "}
                      <strong>market content to your audience</strong> and{" "}
                      <strong>answer queries from your audience</strong>.
                    </p>

                    <div className="relative flex w-full max-w-xs items-center">
                      <input
                        {...methods.register("email")}
                        placeholder="Enter your email..."
                        className="peer w-full rounded-lg bg-pink-500/10 px-3 py-2 pl-8 font-medium text-neutral-200   outline outline-2 outline-pink-500/40 backdrop-blur-sm transition-all duration-300 placeholder:text-neutral-200/50 hover:outline-pink-500/80 focus:outline-pink-500"
                      />
                      <EnvelopeIcon className="absolute ml-2 w-4 text-pink-500/50 duration-300 peer-hover:text-pink-500/80 peer-focus:text-pink-500" />
                    </div>
                    {methods.formState.errors.email?.message && (
                      <p className="my-2 text-red-700">
                        {methods.formState.errors.email?.message}
                      </p>
                    )}
                    <p className="mb-4 mt-4 text-sm">
                      We will use this email for identification and to contact
                      you regarding the claiming process.
                    </p>
                    <p className="mb-4 mt-2 text-sm">
                      Once we have processed your request, we will give you the
                      ownership of all of your courses on Kroto.
                    </p>

                    <button
                      type="submit"
                      className="flex w-full items-center justify-center rounded-lg bg-pink-500 px-3 py-2  text-center font-bold tracking-wider duration-150 hover:bg-pink-600"
                    >
                      {addClaimCourseLoading ? <Loader white /> : <></>} Submit
                      claim request
                    </button>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
