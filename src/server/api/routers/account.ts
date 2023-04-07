//import { z } from "zod";
import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
//publicProcedure

export const accountRouter = createTRPCRouter({
  // deleteAccount:
  // 1. Retrieves the email address associated with the session.
  // 2. Deletes the user account with the retrieved email address using the Prisma delete method.
  deleteAccount: protectedProcedure.mutation(async ({ ctx }) => {
    try {
      const existingUser = await ctx.prisma.user.findFirst({
        where: { id: ctx.session.user.id },
      });
      if (existingUser) {
        return await ctx.prisma.user.delete({
          where: { id: existingUser.id },
        });
      } else {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `User does not exist`,
        });
      }
    } catch (error) {
      if (error instanceof TRPCError) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Error Deleting Account. ${error.message}`,
        });
      } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Error from database while deleting account. ${error.message}`,
        });
      } else {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong while deleting account.",
        });
      }
    }
  }),

  getUserData: protectedProcedure.query(async ({ ctx }) => {
    try {
      const existingUser = await ctx.prisma.user.findFirst({
        where: { id: ctx.session.user.id },
      });

      if (existingUser) {
        return ctx.prisma.user.findUnique({
          where: { id: existingUser.id },
        });
      } else {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `User does not exist`,
        });
      }
    } catch (error) {
      if (error instanceof TRPCError) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Error Getting User Data. ${error.message}`,
        });
      } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Error from database while getting user data. ${error.message}`,
        });
      } else {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong while getting user data.",
        });
      }
    }
  }),

  updateTheme: protectedProcedure.mutation(async ({ ctx }) => {
    try {
      // Check if user exists
      const existingUser = await ctx.prisma.user.findFirst({
        where: { id: ctx.session.user.id },
      });

      if (existingUser) {
        return ctx.prisma.user.update({
          where: { id: existingUser.id },
          data: { theme: existingUser.theme === "winter" ? "night" : "winter" },
        });
      } else {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `User does not exist`,
        });
      }
    } catch (error) {
      if (error instanceof TRPCError) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Error Updating Theme. ${error.message}`,
        });
      } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Error from database while updating theme. ${error.message}`,
        });
      } else {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong while updating theme.",
        });
      }
    }
  }),
  getUserCount: publicProcedure.query(async ({ ctx }) => {
    try {
      const users = await ctx.prisma.user.findMany();
      if (users) {
        return users;
      } else {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Users not found",
        });
      }
    } catch (error) {
      if (error instanceof TRPCError) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Error Getting User count. ${error.message}`,
        });
      } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Error from database while getting user count. ${error.message}`,
        });
      } else {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong while getting user count.",
        });
      }
    }
  }),

  updateUsername: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      try {
        // Check if the new username is already taken
        const currentUser = await ctx.prisma.user.findFirst({
          where: { id: ctx.session.user.id },
        });

        const existingUsername = await ctx.prisma.user.findFirst({
          where: { userName: input },
        });

        if (!currentUser) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "User not logged in.",
          });
        }

        if (existingUsername) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Username already taken",
          });
        } else {
          return await ctx.prisma.user.update({
            where: {
              id: currentUser.id,
            },
            data: {
              userName: input,
            },
          });
        }
      } catch (error) {
        if (error instanceof TRPCError) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `Error Updating Username. ${error.message}`,
          });
        } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `Error from database while updating username. ${error.message}`,
          });
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Something went wrong while updating username.",
          });
        }
      }
    }),
});
