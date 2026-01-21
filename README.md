# Gemini CLI Server

A simple Deno-based HTTP server utilizing Hono to wrap the `gemini` CLI tool.
This project allows you to leverage the **generous usage limits** of the `gemini` CLI by exposing it via a standardized HTTP interface.

## Prerequisites

- [Deno](https://deno.land/)
- [`gemini` CLI tool](https://github.com/google/generative-ai-python)
  - Must be installed and in your PATH as `gemini`.
  - **IMPORTANT**: You must be logged in to the CLI (`gemini auth login` or equivalent setup) for this server to work.

## Setup

1. **Environment Variables**: Create a `.env` file in the root directory (or
   ensure these are set in your environment):
   ```env
   AUTH_KEY=your-secret-uuid-or-key
   ```

## Running the Server

Run the development server:

```bash
deno task dev
```

The server listens on `http://localhost:8000`.

## API Usage

**POST /**

Headers:

- `Authorization`: matches `AUTH_KEY`
- `Content-Type`: `application/json`

Body:

```json
{
  "prompt": "Your prompt here",
  "systemPrompt": "Optional system prompt",
  "model": "gemini-2.5-flash"
}
```

Response:

```json
{
  "message": "Model response...",
  "tokens": 123,
  "model": "gemini-2.5-flash"
}
```
