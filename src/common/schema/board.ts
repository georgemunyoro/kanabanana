import { z } from "zod";

export const createBoardInputSchema = z.object({
  name: z.string().min(1, "Board name is required."),
});

export type CreateBoardInputSchemaType = z.infer<typeof createBoardInputSchema>;
