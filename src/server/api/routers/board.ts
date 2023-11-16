import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { createBoardInputSchema } from "@/common/schema/board";

export const boardRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createBoardInputSchema)
    .mutation(async ({ ctx, input }) => {
      const board = await ctx.db.board.create({
        data: {
          name: input.name,
          userId: ctx.auth.userId,
          data: {},
        },
      });

      return board;
    }),

  getAll: protectedProcedure.query(async ({ ctx, input }) => {
    const boards = await ctx.db.board.findMany({
      where: {
        userId: ctx.auth.userId,
      },
    });

    return boards;
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const board = await ctx.db.board.findFirst({
        where: {
          id: input.id,
          userId: ctx.auth.userId,
        },
      });

      if (!board) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Board not found.",
        });
      }

      return board;
    }),
});
