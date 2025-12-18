type GenerateResponseArgs = {
  prompt: string;
  systemPrompt?: string;
};

export async function generateResponse({
  prompt,
  systemPrompt,
}: GenerateResponseArgs): Promise<string> {
  const cmd = new Deno.Command("gemini", {
    args: ["-m", "gemini-2.5-flash", "--output-format", "json"],
    stdout: "piped",
    stderr: "piped",
    stdin: "piped",
  });
  if (!systemPrompt) {
    try {
      Deno.removeSync("./GEMINI.MD");
    } catch (_) {
      null;
    }
  }
  if (systemPrompt) await Deno.writeTextFile("./GEMINI.md", systemPrompt);

  const child = cmd.spawn();

  const writer = child.stdin.getWriter();
  const textEncoder = new TextEncoder();

  const fullPrompt =
    (systemPrompt && `"System Prompt" : /n/n + ${systemPrompt}`) +
    `User Prompt :/n/n ${prompt}`;
  const encodedPrompt = textEncoder.encode(fullPrompt);

  await writer.write(encodedPrompt);
  await writer.close();
  // Wait for the CLI to finish and get output
  const { stdout, stderr, code } = await child.output();

  // --- PROCESS OUTPUT ---

  if (code !== 0) {
    const errorOutput = new TextDecoder().decode(stderr);
    throw new Error(`Gemini CLI Error: ${errorOutput}`);
  }

  // Decode the success output
  const outputText = new TextDecoder().decode(stdout);
  const parsedText = JSON.parse(outputText).response;

  return parsedText;
}
