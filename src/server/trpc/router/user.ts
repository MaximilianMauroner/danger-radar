import { protectedProcedure, router } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const userRouter = router({
    getUser: protectedProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ ctx, input }) => {
        return ctx.prisma.user.findFirst({
          where: {
            id: input.id
          },
          include: { friends: { include: { friendRelation: true } } }
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
        return ctx.prisma.user.update({
          where: {
            id: ctx.session.user.id
          },
          data: {
            friends: {
              connectOrCreate: {
                create: {
                  friendRelationId: input.userId
                },
                where: {
                  friendId_friendRelationId: {
                    friendRelationId: input.userId,
                    friendId: ctx.session.user.id
                  }
                }
              }
            }
          }
        });
      })
  })
;