import { router } from "../trpc";
import { authRouter } from "./auth";
import { feedbackRouter } from "./feedback";
import { markerRouter } from "./marker";
import { userRouter } from "./user";

export const appRouter = router({
  feedback: feedbackRouter,
  marker: markerRouter,
  auth: authRouter,
  user: userRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
