//import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";
//publicProcedure

export const accountRouter = createTRPCRouter({
  // deleteAccount:
  // 1. Retrieves the email address associated with the session.
  // 2. Deletes the user account with the retrieved email address using the Prisma delete method.
  deleteAccount: protectedProcedure.mutation(async ({ ctx }) => {
    // Check if the new username is already taken
    const existingUser = await ctx.prisma.user.findFirst({
      where: { id: ctx.session.user.id },
    });
    if (existingUser) {
      return await ctx.prisma.user.delete({
        where: { id: existingUser.id },
      });
    }
    throw new Error("Error Deleting Account");
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
  getUserCount: publicProcedure.query(async ({ ctx }) => {
    const users = await ctx.prisma.user.findMany();
    if (users) {
      return users;
    }
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Error Fetching Feed",
    });
  }),
});
