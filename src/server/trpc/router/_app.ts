import { router } from "../trpc";
import { authRouter } from "./auth";
import { exampleRouter } from "./example";
import { markerRouter } from "./marker";
import { userRouter } from "./user";

export const appRouter = router({
  example: exampleRouter,
  marker: markerRouter,
  auth: authRouter,
  user: userRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
