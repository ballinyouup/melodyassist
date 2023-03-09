 import type { inferRouterOutputs } from "@trpc/server";
// import {z} from "zod";
 import type { AppRouter } from "~/server/api/root";

export type RouterOutputs = inferRouterOutputs<AppRouter>
