import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
//publicProcedure
export const accountRouter = createTRPCRouter({

  // deleteAccount:
  // 1. Retrieves the email address associated with the session.
  // 2. Deletes the user account with the retrieved email address using the Prisma delete method.
  deleteAccount: protectedProcedure.mutation(({ ctx }) => {
    return ctx.prisma.user.delete({
      where: {
        email:
          ctx.session?.user.email !== null
            ? ctx.session?.user.email
            : undefined,
      },
    });
  }),

  // updateUserName:
  // 1. Retrieves the email address associated with the session.
  // 2. Checks if the new username is already taken by querying the database using the Prisma findUnique method.
  // 3. Updates the username of the user with the retrieved email address using the Prisma update method.
  updateUserName: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const userEmail = ctx.session?.user.email;
      if (!userEmail) throw new Error("User not found");

      // Check if the new username is already taken
      const existingUser = await ctx.prisma.user.findUnique({
        where: { userName: input },
      });
      if (existingUser) throw new Error("Username already taken");

      // Update the user's username
      return ctx.prisma.user.update({
        where: { email: userEmail },
        data: { userName: input },
      });
    }),

  // getUserTheme:
  // 1. Retrieves the email address associated with the session.
  // 2. Queries the database using the Prisma findUnique method
  // to retrieve the user's theme settings (i.e., dark or light mode)
  // based on the retrieved email address.
  getUserTheme: protectedProcedure.query(async ({ ctx }) => {
    const getTheme = await ctx.prisma.user.findUnique({
      where: {
        email:
          ctx.session?.user.email !== null
            ? ctx.session?.user.email
            : undefined,
      },
      select: {
        settings: {
          select: {
            dark: true,
          },
        },
      },
    });
    return getTheme;
  }),
  
  // updateUserTheme:
  // 1. Retrieves the email address associated with the session.
  // 2. Updates the user's theme settings (i.e., dark or light mode) based
  // on the retrieved email address using the Prisma update method.
  updateUserTheme: protectedProcedure
    .input(z.boolean())
    .mutation(async ({ ctx, input }) => {
      const updateUser = await ctx.prisma.user.update({
        where: {
          email:
            ctx.session?.user.email !== null
              ? ctx.session?.user.email
              : undefined,
        },
        data: {
          settings: {
            update: {
              dark: input,
            },
          },
        },
      });
      return updateUser;
    }),
});
