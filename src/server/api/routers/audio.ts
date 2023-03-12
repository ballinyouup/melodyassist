import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { env } from "~/env.mjs";

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

type PredictionCompleted = z.infer<typeof PredictionCompleted>

export const audioRouter = createTRPCRouter({
  getPrediction: protectedProcedure.query(async ({ ctx }) => {
    const existingUser = await ctx.prisma.user.findUnique({
      where: { id: ctx.session.user.id },
    });

    if (existingUser) {
      const response = await fetch("https://api.replicate.com/v1/predictions", {
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
      });

      if (response.status !== 201) {
        const error = await response.json();
        throw new Error(JSON.stringify(error));
      }

      const prediction = (await response.json()) as Prediction | ErrorResponse;
      return prediction;
    }
    const error = new Error("Unauthorized");
    throw error;
  }),

  getPredictionData: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
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
          throw new Error(JSON.stringify(error));
        }

        const result = await secondResponse.json();
        return result as PredictionCompleted;
      }
      const error = new Error("Unauthorized");
      throw error;
    }),
});
