import { app } from "./main.ts";

try {
  Deno.serve({ port: 9428 }, app.fetch);
} catch (e) {
  console.error(e);
}
