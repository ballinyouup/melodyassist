import { createTRPCRouter } from "~/server/api/trpc";
import { accountRouter } from "~/server/api/routers/account";
import { audioRouter } from "~/server/api/routers/audio";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  account: accountRouter,
  audio: audioRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
