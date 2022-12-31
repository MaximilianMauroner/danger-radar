import { protectedProcedure, router } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const userRouter = router({
    getUser: protectedProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ ctx, input }) => {
        return ctx.prisma.user.findFirst({
          where: {
            id: input.id,
            userFriendsRecords: {
              every: {
                selfId: input.id
              }
            }
          },
          include: { userFriendsRecords: { include: { friend: true } } }
        });
      }),
    addFriend: protectedProcedure
      .input(z.object({ userId: z.string() }))
      .mutation(({ ctx, input }) => {
        if (!ctx.session.user.id || ctx.session.user.id === input.userId) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "You can't add yourself as a friend"
          });
        }
        return ctx.prisma.friend.createMany({
          data: [{
            friendId: input.userId,
            selfId: ctx.session.user.id
          }, {
            selfId: input.userId,
            friendId: ctx.session.user.id
          }]
        });
      }),
    managePermissions: protectedProcedure.input(z.object({
      friendId: z.string(),
      allowLocationSharing: z.boolean(),
      isEmergencyContact: z.boolean()
    })).mutation(({ ctx, input }) => {
      return ctx.prisma.friend.update({
        where: {
          selfId_friendId: {
            friendId: input.friendId,
            selfId: ctx.session.user.id
          }
        },
        data: {
          allowLocationSharing: input.allowLocationSharing,
          isEmergencyContact: input.isEmergencyContact
        }
      });
    })
  })
;