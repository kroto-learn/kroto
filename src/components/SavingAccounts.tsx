import { type Dispatch, type SetStateAction } from "react";
import { object, string, type z } from "zod";
import useToast from "@/hooks/useToast";
import { type UseFormProps, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/utils/api";

export const bankDetailschema = object({
  accountName: string().nonempty("Please enter your name."),
  IFSC: string().nonempty("Please enter your IFSC code."),
  accountNumber: string().nonempty("Please enter your account number."),
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

const SavingAccount = ({
  setIsOpen,
}: {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const { mutateAsync: bankDetails } =
    api.example.updateBankDetails.useMutation();

  const methods = useZodForm({
    schema: bankDetailschema,
  });
  const { successToast, errorToast } = useToast();
  return (
    <form
      onSubmit={methods.handleSubmit(async (values) => {
        try {
          await bankDetails(
            {
              accountName: values?.accountName ?? "",
              accountNumber: values?.accountNumber ?? "",
              ifscCode: values?.IFSC ?? "",
            },
            {
              onSuccess: () => {
                successToast("succesfully submmited");
              },
              onError: () => {
                errorToast("Error updating your profile!");
              },
            }
          );
        } catch (e) {
          console.log(e);
        }
        setIsOpen(false);
      })}
      className="flex w-full flex-col gap-2 rounded-xl"
    >
      <div className="flex flex-col">
        <label className="mb-1 text-xs uppercase tracking-widest">
          Account holder name
        </label>
        <input
          {...methods.register("accountName")}
          className="block w-full rounded-xl border border-neutral-700 bg-neutral-800 px-3 py-2 placeholder-neutral-400 outline-none ring-transparent transition duration-300 hover:border-neutral-500 focus:border-neutral-400 focus:ring-neutral-500 active:outline-none active:ring-transparent"
        />
      </div>
      {methods.formState.errors.accountName?.message && (
        <p className="text-red-700">
          {methods.formState.errors.accountName?.message}
        </p>
      )}
      <div className="flex flex-col">
        <label className="mb-1 text-xs uppercase tracking-widest">
          IFSC Code
        </label>
        <input
          {...methods.register("IFSC")}
          className="block w-full rounded-xl border border-neutral-700 bg-neutral-800 px-3 py-2 placeholder-neutral-400 outline-none ring-transparent transition duration-300 hover:border-neutral-500 focus:border-neutral-400 focus:ring-neutral-500 active:outline-none active:ring-transparent"
        />
      </div>
      {methods.formState.errors.IFSC?.message && (
        <p className="text-red-700">{methods.formState.errors.IFSC?.message}</p>
      )}
      <div className="flex flex-col">
        <label className="mb-1 text-xs uppercase tracking-widest">
          Account Number
        </label>
        <input
          {...methods.register("accountNumber")}
          className="block w-full rounded-xl border border-neutral-700 bg-neutral-800 px-3 py-2 placeholder-neutral-400 outline-none ring-transparent transition duration-300 hover:border-neutral-500 focus:border-neutral-400 focus:ring-neutral-500 active:outline-none active:ring-transparent"
        />
      </div>
      {methods.formState.errors.accountNumber?.message && (
        <p className="text-red-700">
          {methods.formState.errors.accountNumber?.message}
        </p>
      )}
      <div className="flex flex-col">
        <label className="mb-1 text-xs uppercase tracking-widest">
          Account Number
        </label>
        <input
          {...methods.register("accountNumber")}
          className="block w-full rounded-xl border border-neutral-700 bg-neutral-800 px-3 py-2 placeholder-neutral-400 outline-none ring-transparent transition duration-300 hover:border-neutral-500 focus:border-neutral-400 focus:ring-neutral-500 active:outline-none active:ring-transparent"
        />
      </div>
      {methods.formState.errors.accountNumber?.message && (
        <p className="text-red-700">
          {methods.formState.errors.accountNumber?.message}
        </p>
      )}
      <button className="mt-4 w-full rounded-xl bg-pink-600 p-2 font-bold text-neutral-200 transition duration-300 hover:bg-pink-700">
        Submit
      </button>
    </form>
  );
};

export default SavingAccount;
