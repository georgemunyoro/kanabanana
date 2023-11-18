import { z } from "zod";

export const createBoardInputSchema = z.object({
  name: z.string().min(1, "Board name is required."),
});

export type CreateBoardInputSchemaType = z.infer<typeof createBoardInputSchema>;

export const updateBoardSchema = z.object({
  id: z.string().min(1, "Board ID is required."),
  name: z.union([z.string().min(1, "Board name is required."), z.undefined()]),
  data: z.union([z.record(z.unknown()), z.undefined()]),
});

export type UpdateBoardSchemaType = z.infer<typeof updateBoardSchema>;
