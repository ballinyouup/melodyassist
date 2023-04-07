import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { env } from "~/env.mjs";
import { TRPCError } from "@trpc/server";
import { Prisma } from "@prisma/client";

const predictionSchema = z.object({
  completed_at: z.string().nullable(),
  created_at: z.string(),
  error: z.string().nullable(),
  id: z.string(),
  input: z.object({
    seed: z.string(),
  }),
  logs: z.string().nullable(),
  metrics: z.record(z.string()),
  output: z.string().nullable(),
  started_at: z.string().nullable(),
  status: z.string(),
  version: z.string(),
});
type Prediction = z.infer<typeof predictionSchema>;

interface ErrorResponse {
  detail: string;
  status?: string;
  id?: string;
  output: string | null;
}

const PredictionCompleted = z.object({
  id: z.string(),
  input: z.object({
    seed: z.string(),
  }),
  output: z.string(),
  status: z.string(),
});

interface UploadResponse {
  accountId: string;
  filePath: string;
  fileUrl: string;
}

type PredictionCompleted = z.infer<typeof PredictionCompletedWithPrediction>;

const PredictionCompletedWithPrediction = PredictionCompleted.extend({
  completed_at: z.string().nullable(),
  created_at: z.string(),
  error: z.string().nullable(),
  logs: z.string().nullable(),
  metrics: z.record(z.string()),
  started_at: z.string().nullable(),
  version: z.string(),
});

export const audioRouter = createTRPCRouter({
  getPrediction: protectedProcedure.query(async ({ ctx }) => {
    try {
      const existingUser = await ctx.prisma.user.findUnique({
        where: { id: ctx.session.user.id },
      });

      if (existingUser) {
        const response = await fetch(
          "https://api.replicate.com/v1/predictions",
          {
            method: "POST",
            headers: {
              Authorization: `Token ${env.REPLICATE_API_TOKEN}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              version:
                "0de4a5f14b9120ce02c590eb9cf6c94841569fafbc4be7ab37436ce738bcf49f",
              input: { seed: "-1" },
            }),
          }
        );

        if (response.status !== 201) {
          const error = await response.json();
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `Uploading Failed ${JSON.stringify(error)}`,
          });
        }

        const prediction = (await response.json()) as
          | Prediction
          | ErrorResponse;
        return prediction;
      }
      if (!existingUser) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not logged in.",
        });
      }
    } catch (error) {
      if (error instanceof TRPCError) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Error Creating Prediction. ${error.message}`,
        });
      } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Error from database while creating prediction. ${error.message}`,
        });
      } else {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong while creating prediction.",
        });
      }
    }
  }),

  getPredictionData: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      try {
        const existingUser = await ctx.prisma.user.findUnique({
          where: { id: ctx.session.user.id },
        });
        if (existingUser) {
          const secondResponse = await fetch(
            `https://api.replicate.com/v1/predictions/${input}`,
            {
              headers: {
                Authorization: `Token ${env.REPLICATE_API_TOKEN}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (secondResponse.status !== 200) {
            const error = await secondResponse.json();
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: `Fetching AI Audio File Failed. ${JSON.stringify(error)}`,
            });
          }

          const result = (await secondResponse.json()) as PredictionCompleted;

          if (result.status === "succeeded") {
            // Fetch the audio data from the URL
            const audioResponse = await fetch(result.output);
            const blob = await audioResponse.blob();

            //Upload the file to the specified URL
            const response = await fetch(
              `https://api.upload.io/v2/accounts/W142hjQ/uploads/binary?fileName=Seed-${
                result.logs?.split(" ")[2]?.split("ffmpeg")[0] as string
              }.mp3`,
              {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${env.UPLOAD_API_KEY}`,
                  "Content-Type": "audio/mpeg", // Replace with the appropriate MIME type
                },
                body: blob,
              }
            );

            if (response.status !== 200) {
              const error = await response.json();
              throw new TRPCError({
                code: "BAD_REQUEST",
                message: `Uploading Failed ${JSON.stringify(error)}`,
              });
            }

            const uploadResult = (await response.json()) as UploadResponse;
            return uploadResult;
            //return response;
          } else {
            return result;
          }
        }
        if (!existingUser) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "User not signed in",
          });
        }
      } catch (error) {
        if (error instanceof TRPCError) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `Error Getting Second Prediction. ${error.message}`,
          });
        } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `Error from database while getting second prediction. ${error.message}`,
          });
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Something went wrong while getting second prediction.",
          });
        }
      }
    }),
  createAudio: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        content: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // Check if user exists
        const existingUser = await ctx.prisma.user.findFirst({
          where: { id: ctx.session.user.id },
        });

        if (existingUser) {
          return ctx.prisma.user.update({
            where: { id: existingUser.id },
            data: {
              posts: {
                create: {
                  title: input.title,
                  content: input.content,
                },
              },
            },
          });
        }
        if (!existingUser) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "User not logged in",
          });
        }
      } catch (error) {
        if (error instanceof TRPCError) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `Error Creating Audio. ${error.message}`,
          });
        } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `Error from database while creating audio. ${error.message}`,
          });
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Something went wrong while creating audio.",
          });
        }
      }
    }),
  getAudio: protectedProcedure.query(async ({ ctx }) => {
    try {
      // Check if user exists
      const existingUser = await ctx.prisma.user.findFirst({
        where: { id: ctx.session.user.id },
      });
      if (existingUser) {
        const userAudios = await ctx.prisma.user.findUnique({
          where: {
            id: existingUser.id,
          },
          select: {
            posts: {
              select: {
                title: true,
                content: true,
                createdAt: true,
                id: true,
                author: true,
              },
              orderBy: {
                createdAt: "desc",
              },
            },
          },
        });
        return userAudios;
      }
      if (!existingUser) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not logged in.",
        });
      }
    } catch (error) {
      if (error instanceof TRPCError) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Error Fetching User Audio. ${error.message}`,
        });
      } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Error from database while getting user audio. ${error.message}`,
        });
      } else {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong while fetching for user audio.",
        });
      }
    }
  }),
  getFeed: publicProcedure.query(async ({ ctx }) => {
    try {
      const feed = await ctx.prisma.post.findMany({
        select: {
          title: true,
          content: true,
          createdAt: true,
          id: true,
          author: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      if (feed) {
        return feed;
      } else {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Could not find posts."
        })
      }
    } catch (error) {
      if (error instanceof TRPCError) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Error Getting Feed. ${error.message}`,
        });
      } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Error from database while getting feed. ${error.message}`,
        });
      } else {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong while getting feed.",
        });
      }
    }
  }),
  deleteAllAudio: protectedProcedure.mutation(async ({ ctx }) => {
    try {
      const existingUser = await ctx.prisma.user.findFirst({
        where: { id: ctx.session.user.id },
      });
      if (existingUser) {
        return ctx.prisma.post.deleteMany({
          where: {
            authorId: existingUser.id,
          },
        });
      }
      if (!existingUser) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not logged in.",
        });
      }
    } catch (error) {
      if (error instanceof TRPCError) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Error Deleting Audio. ${error.message}`,
        });
      } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Error from database while deleting audio. ${error.message}`,
        });
      } else {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong while deleting all audio.",
        });
      }
    }
  }),
  deleteAudio: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      try {
        const existingUser = await ctx.prisma.user.findFirst({
          where: { id: ctx.session.user.id },
        });
        if (existingUser) {
          return ctx.prisma.post.delete({
            where: {
              id: input,
            },
          });
        }
        if (!existingUser) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "User not logged in.",
          });
        }
      } catch (error) {
        if (error instanceof TRPCError) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `Error Deleting Audio. ${error.message}`,
          });
        } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `Error from database while deleting audio. ${error.message}`,
          });
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Something went wrong while deleting audio.",
          });
        }
      }
    }),
});
