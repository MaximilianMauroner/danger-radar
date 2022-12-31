import { protectedProcedure, router } from "../trpc";
import { z } from "zod";

export const userRouter = router({
  getUser: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.user.findUnique({
        where: {
          id: input.id
        }
      });
    })
});