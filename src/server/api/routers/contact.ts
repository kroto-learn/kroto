import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { contactFormSchema } from "@/pages/contact-us";
import { sendContactus } from "@/server/helpers/emailHelper";

export const contactRouter = createTRPCRouter({
  contactUs: publicProcedure
    .input(contactFormSchema)
    .mutation(async ({ input }) => {
      await sendContactus(input);

      return input;
    }),
});
