import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { env } from "~/env.mjs";


export const audioRouter = createTRPCRouter({
  getPrediction: protectedProcedure
  .query(async ({ ctx }) => {
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

      const prediction = (await response.json());
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
        return result;
      }
      const error = new Error("Unauthorized");
      throw error;
    }),
});
