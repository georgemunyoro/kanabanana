import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { createBoardInputSchema } from "@/common/schema/board";

export const boardRouter = createTRPCRouter({
  create: publicProcedure
    .input(createBoardInputSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.auth.userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You must be logged in to perform this action.",
        });
      }

      const board = await ctx.db.board.create({
        data: {
          name: input.name,
          userId: ctx.auth.userId,
          data: {},
        },
      });

      return board;
    }),

  getAll: publicProcedure.query(async ({ ctx, input }) => {
    if (!ctx.auth.userId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You must be logged in to do this.",
      });
    }

    const boards = await ctx.db.board.findMany({
      where: {
        userId: ctx.auth.userId,
      },
    });

    return boards;
  }),

  // getById: publicProcedure
  //   .input(z.object({ id: z.string().uuid() }))
  //   .query(async ({ ctx, input }) => {}),
});
