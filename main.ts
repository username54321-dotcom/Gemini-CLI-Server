import { generateResponse } from "./generateResponse.ts";
import { Hono } from "@hono/hono";
import {
  bodyValidation,
  headerValidation,
} from "./validation/requestValidation.ts";
const app = new Hono();
app.onError((e, ctx) => {
  return ctx.json({ error: e });
});
const authKey = Deno.env.get("AUTH_KEY");

app.post(
  "/",
  // Validations
  bodyValidation,
  headerValidation,
  // Logic
  async (ctx) => {
    const headerAuth = ctx.req.valid("header").Authorization;
    if (headerAuth !== authKey) {
      return ctx.text("Not Authorized", 401);
    }
    const body = ctx.req.valid("json");
    const prompt = body.prompt;
    const systemPrompt = body.systemPrompt;
    const model = body.model;
    const output = await generateResponse({
      prompt: prompt,
      systemPrompt: systemPrompt,
      model: model,
    }).then((x) => x);
    return ctx.json(output);
  }
);

Deno.serve({ port: 8000 }, app.fetch);
