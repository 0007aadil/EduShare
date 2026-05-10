import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function summarizeResource(
  title: string,
  url?: string,
  description?: string
): Promise<string> {
  const prompt = `You are an educational content curator. Summarize the following learning resource in 2-3 concise sentences that help a student decide if this resource is valuable for them.

Title: ${title}
${url ? `URL: ${url}` : ""}
${description ? `Description: ${description}` : ""}

Return ONLY the summary text, nothing else.`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 200,
    temperature: 0.5,
  });

  return response.choices[0]?.message?.content?.trim() || "Summary unavailable.";
}

export async function suggestTags(
  title: string,
  summary: string
): Promise<string[]> {
  const prompt = `Given this learning resource, suggest 3-5 relevant category tags. Return ONLY a JSON array of lowercase tag strings.

Title: ${title}
Summary: ${summary}

Example output: ["javascript", "web development", "frontend", "react"]`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 100,
    temperature: 0.3,
  });

  try {
    const content = response.choices[0]?.message?.content?.trim() || "[]";
    return JSON.parse(content);
  } catch {
    return ["general"];
  }
}

export async function scoreQuality(
  title: string,
  summary: string,
  url?: string
): Promise<number> {
  const prompt = `Rate the quality of this learning resource on a scale of 1-100 based on:
- Title clarity and specificity (20 pts)
- Content relevance for learners (30 pts)
- Summary depth and usefulness (30 pts)
- Source credibility based on URL domain (20 pts)

Title: ${title}
Summary: ${summary}
${url ? `URL: ${url}` : ""}

Return ONLY a single integer number between 1 and 100.`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 10,
    temperature: 0.2,
  });

  const score = parseInt(response.choices[0]?.message?.content?.trim() || "50");
  return Math.min(100, Math.max(1, isNaN(score) ? 50 : score));
}

export async function naturalLanguageSearch(
  query: string
): Promise<{ keywords: string[]; tags: string[]; type?: string }> {
  const prompt = `Convert this natural language search query into structured search parameters for a learning resource platform.

Query: "${query}"

Return ONLY a JSON object with:
- "keywords": array of important search terms
- "tags": array of relevant category tags
- "type": one of "LINK", "PDF", "ARTICLE", "VIDEO", or null if not specified

Example: {"keywords": ["react", "hooks"], "tags": ["react", "frontend"], "type": null}`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 150,
    temperature: 0.3,
  });

  try {
    const content = response.choices[0]?.message?.content?.trim() || "{}";
    return JSON.parse(content);
  } catch {
    return { keywords: query.split(" "), tags: [] };
  }
}

export async function generateWeeklyDigest(
  interests: string[],
  resources: { title: string; summary: string; url: string }[]
): Promise<string> {
  const prompt = `You are a personalized learning assistant. Based on the user's interests, pick the top 5 most relevant resources from the list and create a brief weekly digest email.

User Interests: ${interests.join(", ")}

Available Resources:
${resources.map((r, i) => `${i + 1}. "${r.title}" - ${r.summary}`).join("\n")}

Format as a friendly, concise digest with numbered recommendations. Each recommendation should have the title and a one-line reason why it matches the user's interests.`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 500,
    temperature: 0.7,
  });

  return response.choices[0]?.message?.content?.trim() || "No digest available.";
}
