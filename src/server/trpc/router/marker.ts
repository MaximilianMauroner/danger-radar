import { z } from "zod";

import { router, publicProcedure, protectedProcedure } from "../trpc";

export const markerRouter = router({
  addMarker: protectedProcedure
    .input(z.object({ lat: z.number(), lng: z.number(), zoomLevel: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.marker.create({
        data: {
          lat: input.lat,
          lng: input.lng,
          zoomLevel: input.zoomLevel,
          userId: ctx.session.user.id
        }
      });
    }),
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.marker.findMany({});
  })
});
