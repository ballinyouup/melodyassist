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
  // getUserName:
  // 1. Retrieves the id associated with the session.
  // 2. If the user exists, query the database using the Prisma findUnique method.
  // 3. Displays the username of the user with the retrieved id using the Prisma findUnique method.
  getUserName: protectedProcedure.query(async ({ ctx }) => {
    // Check if the new username is already taken
    const existingUser = await ctx.prisma.user.findFirst({
      where: { id: ctx.session.user.id },
    });

    if (existingUser) {
      // Display the user's username
      return ctx.prisma.user.findUnique({
        where: { id: existingUser.id },
        select: { userName: true },
      });
    }

    throw new Error("User doesn't exist");
  }),

  // updateUserName:
  // 1. Retrieves the email address associated with the session.
  // 2. Checks if the new username is already taken by querying the database using the Prisma findUnique method.
  // 3. Updates the username of the user with the retrieved email address using the Prisma update method.
  updateUserName: protectedProcedure
    .input((input) => {
      if (typeof input === "string") {
        return input;
      }
      throw new Error("Invalid input");
    })
    .mutation(async ({ ctx, input }) => {
      const userEmail = ctx.session?.user.email;
      if (!userEmail) throw new Error("User not found");

      // Check if the new username is already taken
      const existingUser = await ctx.prisma.user.findUnique({
        where: { userName: input },
      });
      if (existingUser) throw new Error("Username already taken");

      if (userEmail && typeof input === "string" && !existingUser) {
        // Update the user's username
        return ctx.prisma.user.update({
          where: { email: userEmail },
          data: { userName: input },
        });
      }
    }),

  // // getUserTheme:
  // // 1. Retrieves the email address associated with the session.
  // // 2. Queries the database using the Prisma findUnique method
  // // to retrieve the user's theme settings (i.e., dark or light mode)
  // // based on the retrieved email address.
  // getUserTheme: protectedProcedure.query(async ({ ctx }) => {
  //   const theme = await ctx.prisma.user.findUnique({
  //     where: {
  //       email:
  //         ctx.session?.user.email !== null
  //           ? ctx.session?.user.email
  //           : undefined,
  //     },
  //     select: {
  //       settings: {
  //         select: {
  //           dark: true,
  //         },
  //       },
  //     },
  //   });
  //   return theme;
  // }),

  // // updateUserTheme:
  // // 1. Retrieves the email address associated with the session.
  // // 2. Updates the user's theme settings (i.e., dark or light mode) based
  // // on the retrieved email address using the Prisma update method.
  // updateUserTheme: protectedProcedure
  //   .input(
  //     z.object({
  //       dark: z.boolean(),
  //     })
  //   )
  //   .mutation(async ({ ctx, input }) => {
  //     const updateUser = await ctx.prisma.user.update({
  //       where: {
  //         email:
  //           ctx.session?.user.email !== null
  //             ? ctx.session?.user.email
  //             : undefined,
  //       },
  //       data: {
  //         settings: {
  //           update: {
  //             dark: input?.dark,
  //           },
  //         },
  //       },
  //     });
  //     return updateUser;
  //   }),
});
