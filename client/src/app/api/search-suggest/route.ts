import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';

export async function POST(req: Request) {
  const { query } = await req.json();

  const result = await generateObject({
    model: google('gemini-flash-latest'),
    schema: z.object({
      suggestions: z.array(z.string()),
    }),
    prompt: `Generate 5 relevant movie or TV series search suggestions based on the user's partial input: "${query}". Return only the titles. If the query is short, guess popular movies or shows starting with that text.`,
  });

  return Response.json(result.object);
}
