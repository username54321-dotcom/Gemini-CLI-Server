import { generateResponse } from "./generateResponse.ts";
import { Hono } from "@hono/hono";
const app = new Hono();
const authKey = Deno.env.get("AUTH_KEY");
app.post(async (ctx) => {
  const headerAuth = ctx.req.header("Authorization");
  if (headerAuth !== authKey) {
    return ctx.text("Not Authorized", 401);
  }
  const body = await ctx.req.json().then((x) => x);
  const prompt = body.prompt;
  const systemPrompt = body.systemPrompt;
  const model = body.model;
  const output = await generateResponse({
    prompt: prompt,
    systemPrompt: systemPrompt,
    model: model,
  }).then((x) => x);
  return ctx.json(output);
});

Deno.serve({ port: 8000 }, app.fetch);
