import { generateResponse } from "./generateResponse.ts";
import { Hono } from "@hono/hono";
const app = new Hono();

app.post(async (ctx) => {
  const body = await ctx.req.json().then((x) => x);
  const prompt = body.prompt;
  const systemPrompt = body.systemPrompt;
  const output = await generateResponse({
    prompt: prompt,
    systemPrompt: systemPrompt,
  }).then((x) => x);
  return ctx.json({ message: output });
});

// const output = await generateResponse({
//   prompt: "whats your name",
//   systemPrompt: "your name is harry kane",
// });
// console.log(output);

Deno.serve({ port: 80 }, app.fetch);
