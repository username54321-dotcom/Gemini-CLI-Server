type GenerateResponseArgs = {
  prompt: string;
  systemPrompt?: string;
  model?: string;
};

export async function generateResponse({
  prompt,
  systemPrompt,
  model = "gemini-2.5-flash",
}: GenerateResponseArgs): Promise<Record<string, unknown>> {
  // New Terminal Instance
  const cmd = new Deno.Command("gemini", {
    args: ["-m", model, "--output-format", "json", "-s"],
    stdout: "piped",
    stderr: "piped",
    stdin: "piped",
  });

  const child = cmd.spawn();

  const writer = child.stdin.getWriter();
  const textEncoder = new TextEncoder();

  const fullPrompt =
    (systemPrompt ? `"System Prompt" : \n\n ${systemPrompt}` : "") +
    `User Prompt :\n\n ${prompt}`;
  const encodedPrompt = textEncoder.encode(fullPrompt);

  await writer.write(encodedPrompt);
  await writer.close();

  const { success, stdout, stderr } = await child.output();

  if (!success) {
    const errorText = new TextDecoder().decode(stderr);
    throw new Error(`Error: ${errorText}`);
  }

  const outputText = new TextDecoder().decode(stdout);

  try {
    const parsedText = JSON.parse(outputText);
    console.log(parsedText);
    const outputObj = {
      message: parsedText.response,
      tokens: parsedText.stats?.models?.[model]?.tokens ?? 0,
      model: model,
    };
    return outputObj;
  } catch (e) {
    throw new Error(`OutputText: ${outputText}. Error: ${e}`);
  }
}
