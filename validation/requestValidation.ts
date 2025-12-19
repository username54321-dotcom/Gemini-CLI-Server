import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

// Body Valiation

const bodySchema = z.object({
  prompt: z.string({ error: "No Provided Prompt" }),
  systemPrompt: z.string().optional(),
  model: z
    .enum(["gemini-2.5-flash", "gemini-2.5-pro"])
    .optional()
    .default("gemini-2.5-flash"),
});

export const bodyValidation = zValidator("json", bodySchema, (res, ctx) => {
  if (!res.success) {
    return ctx.json(res.error.message);
  }
});

// Header Validation
const headerSchema = z.object({
  Authorization: z.uuid({ error: "No Provided API Key." }),
});

export const headerValidation = zValidator(
  "header",
  headerSchema,
  (res, ctx) => {
    if (!res.success) {
      return ctx.json(res.error.message);
    }
  }
);
