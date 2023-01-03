import {z} from "zod";

import {router, publicProcedure, protectedProcedure} from "../trpc";

export const feedbackRouter = router({
    add: protectedProcedure
        .input(z.object({message: z.string()}))
        .mutation(({input, ctx}) => {
            return ctx.prisma.feedback.create({
                data: {
                    message: input.message,
                    userId: ctx.session.user.id
                }
            })
        }),
    getAll: publicProcedure.query(({ctx}) => {
        return ctx.prisma.feedback.findMany();
    }),
});
