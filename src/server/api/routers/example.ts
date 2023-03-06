import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const exampleRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.example.findMany();
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message! Or can you?";
  }),
});

export const accountRouter = createTRPCRouter({

  deleteAccount: protectedProcedure
  .mutation(({ ctx }) => {
    return ctx.prisma.user.delete({
      where: {
        email: ctx.session?.user.email != null ? ctx.session?.user.email : undefined
      }
    })
  }),
});
