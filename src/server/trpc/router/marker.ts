import { z } from "zod";
import { MarkerLevel, MarkerSource, MarkerType } from "@prisma/client";
import { router, publicProcedure, protectedProcedure } from "../trpc";

export const markerRouter = router({
  addMarker: protectedProcedure
    .input(z.object({
      lat: z.number(),
      lng: z.number(),
      zoomLevel: z.number(),
      message: z.string(),
      markerLevel: z.nativeEnum(MarkerLevel),
      type: z.nativeEnum(MarkerType)
    }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.marker.create({
        data: {
          lat: input.lat,
          lng: input.lng,
          zoomLevel: input.zoomLevel,
          message: input.message,
          userId: ctx.session.user.id,
          level: input.markerLevel,
          markerType: input.type
        }
      });
    }),
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.marker.findMany({});
  }),
  getVisibleMarkers: protectedProcedure.input(z.object({
    north: z.number(),
    south: z.number(),
    west: z.number(),
    east: z.number(),
    zoomLevel: z.number()
  })).query(async ({ ctx, input }) => {
    return ctx.prisma.marker.findMany({
      where: {
        lat: {
          gte: input.south,
          lte: input.north
        },
        lng: {
          gte: input.west,
          lte: input.east
        },
        zoomLevel: {
          gte: input.zoomLevel - 4,
          lte: input.zoomLevel + 4
        }
      }
    });
  })
});
