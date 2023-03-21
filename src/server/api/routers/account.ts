//import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
//publicProcedure

export const accountRouter = createTRPCRouter({
  // deleteAccount:
  // 1. Retrieves the email address associated with the session.
  // 2. Deletes the user account with the retrieved email address using the Prisma delete method.
  deleteAccount: protectedProcedure.mutation(async ({ ctx }) => {
    return await ctx.prisma.user.delete({
      where: {
        email:
          ctx.session?.user.email !== null
            ? ctx.session?.user.email
            : undefined,
      },
    });
  }),

  getUserData: protectedProcedure.query(async ({ ctx }) => {
    // Check if the new username is already taken
    const existingUser = await ctx.prisma.user.findFirst({
      where: { id: ctx.session.user.id },
    });

    if (existingUser) {
      return ctx.prisma.user.findUnique({
        where: { id: existingUser.id },
      });
    }

    throw new Error("User doesn't exist");
  }),

  updateTheme: protectedProcedure.mutation(async ({ ctx }) => {
    // Check if user exists
    const existingUser = await ctx.prisma.user.findFirst({
      where: { id: ctx.session.user.id },
    });

    if (existingUser) {
      return ctx.prisma.user.update({
        where: { id: existingUser.id },
        data: { theme: existingUser.theme === "winter" ? "night" : "winter" },
      });
    }

    throw new Error("Error Changing Theme");
  }),
});
