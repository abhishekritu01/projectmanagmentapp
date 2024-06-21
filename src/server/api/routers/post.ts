import { z } from "zod";
import { getServerSession } from "next-auth";
import { db } from "~/server/db";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const postRouter = createTRPCRouter({
  // Existing hello route
  hello: protectedProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello this is abhishek ${input.text}`,
      };
    }),

  // New route that returns "Hello World" without input
  helloWorld: protectedProcedure
    .query(() => {
      return {
        greeting: "Hello World from tRPC!",
      };
    }),

  // New route that prints a message to the console
  printMessage: publicProcedure
    .input(z.object({ message: z.string() }))
    .mutation(({ input }) => {
      console.log(input.message);
      return {
        status: "Message printed to console",
      };
    }),

  // New route that fetches list of users (protected route)
  getListOfUsers: protectedProcedure.query(async ({ ctx }) => {
    const users = await db.user.findMany(
      {
        select: {
          id: true,
          email: true,
          username: true,
          createdAt: true,
          updatedAt: true,
        },
      }
    );
    return users;
  }),

});
