import { router } from "../trpc";
import { authRouter } from "./auth";
import { exampleRouter } from "./example";
import { markerRouter } from "./marker";

export const appRouter = router({
  example: exampleRouter,
  marker: markerRouter,
  auth: authRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
