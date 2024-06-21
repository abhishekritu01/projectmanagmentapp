import { postRouter } from "~/server/api/routers/post";
import { registerRouter } from "~/server/api/routers/register"
import { projectsRouter } from "~/server/api/routers/project";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { create } from "domain";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  registerUser: registerRouter,
  project: projectsRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
