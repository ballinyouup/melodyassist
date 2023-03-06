//import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
//publicProcedure
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
