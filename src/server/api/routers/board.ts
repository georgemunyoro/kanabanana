import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import {
  createBoardInputSchema,
  updateBoardSchema,
} from "@/common/schema/board";
import { type BoardData } from "../../../components/Board/types";

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

  getAll: protectedProcedure.query(async ({ ctx }) => {
    const boards = await ctx.db.board.findMany({
      where: {
        userId: ctx.auth.userId,
      },
    });

    return boards;
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.string().min(1, "Board id is requried") }))
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

      return {
        id: board.id,
        name: board.name,
        data: JSON.parse(
          typeof board.data === "string" ? board.data : "{}",
        ) as BoardData,
      };
    }),

  update: protectedProcedure
    .input(updateBoardSchema)
    .mutation(async ({ ctx, input }) => {
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

      const updatedBoard = await ctx.db.board.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          data: JSON.stringify(input.data),
        },
      });

      return updatedBoard;
    }),
});
