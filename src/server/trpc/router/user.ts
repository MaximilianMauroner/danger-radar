import { protectedProcedure, router } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { beamsClient, pusher } from "../../pusher";
import { session } from "next-auth/core/routes";
import { env } from "../../../env/server.mjs";

export const userRouter = router({
  getUser: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.user.findFirst({
        where: {
          id: input.id,
          userFriendsRecords: {
            every: {
              selfId: input.id,
            },
          },
        },
        include: { userFriendsRecords: { include: { friend: true } } },
      });
    }),
  me: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.user.findFirst({
      where: {
        id: ctx.session.user.id,
        userFriendsRecords: {
          every: {
            selfId: ctx.session.user.id,
          },
        },
      },
      include: { userFriendsRecords: { include: { friend: true } } },
    });
  }),
  addFriend: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(({ ctx, input }) => {
      if (!ctx.session.user.id || ctx.session.user.id === input.userId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You can't add yourself as a friend",
        });
      }
      return ctx.prisma.friend.createMany({
        data: [
          {
            friendId: input.userId,
            selfId: ctx.session.user.id,
          },
          {
            selfId: input.userId,
            friendId: ctx.session.user.id,
          },
        ],
      });
    }),
  managePermissions: protectedProcedure
    .input(
      z.object({
        friendId: z.string(),
        allowLocationSharing: z.boolean(),
        isEmergencyContact: z.boolean(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.friend.update({
        where: {
          selfId_friendId: {
            friendId: input.friendId,
            selfId: ctx.session.user.id,
          },
        },
        data: {
          allowLocationSharing: input.allowLocationSharing,
          isEmergencyContact: input.isEmergencyContact,
        },
      });
    }),
  shareLocation: protectedProcedure
    .input(
      z.object({
        lat: z.number(),
        lng: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const position = await ctx.prisma.position.upsert({
        where: {
          userId: ctx.session.user.id,
        },
        update: {
          lat: input.lat,
          lng: input.lng,
        },
        create: {
          lat: input.lat,
          lng: input.lng,
          userId: ctx.session.user.id,
        },
      });
      const friends = await ctx.prisma.friend.findMany({
        where: {
          selfId: ctx.session.user.id,
          allowLocationSharing: true,
        },
        include: { friend: { include: { position: true } } },
      });
      friends.forEach((friend) => {
        pusher.trigger(friend.friend.id, "emergency-mode", {
          id: ctx.session.user.id,
          name: ctx.session.user.name,
          lat: position.lat,
          lng: position.lng,
          timestamp: position.timestamp,
        });
      });
      return position;
    }),
  enableEmergencyMode: protectedProcedure.mutation(async ({ ctx }) => {
    await ctx.prisma.user.update({
      where: {
        id: ctx.session.user.id,
      },
      data: {
        emergencyMode: true,
      },
    });
    const friends = await ctx.prisma.friend.findMany({
      where: {
        selfId: ctx.session.user.id,
        isEmergencyContact: true,
      },
      include: { friend: { include: { position: true } } },
    });
    const intrests: string[] = [];
    friends.forEach((friend) => {
      intrests.push("emergency-notification-" + friend.friendId);
    });
    await beamsClient.publishToInterests(intrests, {
      web: {
        notification: {
          title: "Emergency Mode Triggered",
          body: `The User ${ctx.session.user.name} has activated emergency mode`,
          deep_link: env.NEXTAUTH_URL,
        },
      },
    });
  }),
  disableEmergencyMode: protectedProcedure.mutation(({ ctx }) => {
    return ctx.prisma.user.update({
      where: {
        id: ctx.session.user.id,
      },
      data: {
        emergencyMode: false,
      },
    });
  }),
});
