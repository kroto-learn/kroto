import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import {
  sendCalendarInvite,
  sendEventStarted,
  sendEventUpdate,
  sendUpdatePreview,
} from "@/server/helpers/emailHelper";

export const emailSenderRouter = createTRPCRouter({
  sendCalendarInvite: protectedProcedure
    .input(z.object({ eventId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { prisma } = ctx;

      const event = await prisma.event.findUnique({
        where: {
          id: input.eventId,
        },
      });
      const creator = await prisma.user.findUnique({
        where: {
          id: event?.creatorId,
        },
        include: {
          host: {
            include: {
              user: true,
            },
          },
        },
      });

      if (!event || !creator) throw new Error("Event or creator not found");

      // This bad.
      if (event.id === ctx.session.user.id) {
        for (const h of creator.host) {
          await sendCalendarInvite(event, creator, h.user.email ?? "");
        }
      }
      await sendCalendarInvite(event, creator, ctx.session.user.email ?? "");
    }),

  eventStarting: protectedProcedure
    .input(z.object({ eventId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { prisma } = ctx;

      const event = await prisma.event.findUnique({
        where: {
          id: input.eventId,
        },
      });
      const creator = await prisma.user.findUnique({
        where: {
          id: event?.creatorId,
        },
      });

      if (!event || !creator) throw new Error("Event or creator not found");

      const registrationsIds = await prisma.registration.findMany({
        where: {
          eventId: input.eventId,
        },
      });

      const registrations = await prisma.user.findMany({
        where: {
          id: { in: registrationsIds.map((id) => id.userId) },
        },
      });

      try {
        await sendEventStarted(
          event,
          registrations.map((r) => r.email)
        );
      } catch (e) {
        console.log(e);
      }
    }),

  sendUpdate: protectedProcedure
    .input(
      z.object({ eventId: z.string(), body: z.string(), subject: z.string() })
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma } = ctx;
      const event = await prisma.event.findUnique({
        where: {
          id: input.eventId,
        },
      });
      if (!event || event.creatorId !== ctx.session.user.id)
        throw new TRPCError({ code: "BAD_REQUEST" });

      const registrationsIds = await prisma.registration.findMany({
        where: {
          eventId: input.eventId,
        },
      });

      const registrations = await prisma.user.findMany({
        where: {
          id: { in: registrationsIds.map((id) => id.userId) },
        },
      });

      // this not working as well.
      await sendEventUpdate(
        input.subject,
        input.body,
        registrations.map((r) => r.email)
      );
    }),

  sendUpdatePreview: protectedProcedure
    .input(z.object({ body: z.string(), subject: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await sendUpdatePreview(
        input.subject,
        input.body,
        ctx.session.user.email ?? ""
      );
    }),
});
