import { GoogleGenAI } from '@google/genai';
import type { AiEvaluationResult, AiGenerationResult } from '../../shared/types.js';

const getAI = () => new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || process.env.API_KEY || '' });

// Stage 1: Evaluate if article is worth publishing
export async function evaluateArticle(
  title: string,
  content: string
): Promise<AiEvaluationResult | null> {
  try {
    const ai = getAI();

    const prompt = `Analyze this news article and determine if it's suitable for publishing on a professional news website.

Consider:
- Is this newsworthy and relevant?
- Is the content substantial enough for rewriting?
- Does it have lasting value (evergreen) or is it time-sensitive?
- What category does it best fit?
- What's the estimated advertising value (RPM)?

Return ONLY valid JSON (no markdown, no explanation):
{
  "should_publish": true or false,
  "category": "technology" or "finance" or "health" or "sports" or "science" or "entertainment",
  "evergreen_score": 1-10 (10 = timeless content),
  "estimated_rpm": 1-10 (10 = highest ad value),
  "reason": "brief explanation"
}

ARTICLE TITLE: ${title}

ARTICLE CONTENT:
${content.slice(0, 3000)}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
      config: {
        temperature: 0.3,
        topP: 0.8,
      },
    });

    const text = response.text?.trim();
    if (!text) return null;

    // Clean up the response
    const jsonStr = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(jsonStr) as AiEvaluationResult;
  } catch (error) {
    console.error('AI Evaluation Error:', error);
    return null;
  }
}

// Stage 2: Generate rewritten article
export async function generateArticle(
  title: string,
  content: string,
  sourceName: string,
  category: string
): Promise<AiGenerationResult | null> {
  try {
    const ai = getAI();

    const prompt = `You are a professional news journalist. Rewrite this article for a global English-language news website.

REQUIREMENTS:
- Write 700-900 words in engaging, journalistic style
- Create an SEO-optimized headline (not clickbait)
- Include 4 key points that summarize the main takeaways
- Write a compelling 2-3 sentence excerpt
- Use factual information only
- Maintain professional tone
- Include relevant tags for SEO
- Create a URL-friendly slug (lowercase, hyphens, no special chars)
- Credit the original source appropriately in the content

IMPORTANT: Return ONLY valid JSON (no markdown code blocks, no explanation):
{
  "title": "SEO-optimized headline",
  "slug": "url-friendly-slug-here",
  "excerpt": "2-3 sentence compelling summary",
  "key_points": ["Key point 1", "Key point 2", "Key point 3", "Key point 4"],
  "content": "Full article content in markdown format...",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "read_time": estimated reading time in minutes (number)
}

CATEGORY: ${category}
SOURCE: ${sourceName}
ORIGINAL TITLE: ${title}

ORIGINAL CONTENT:
${content.slice(0, 5000)}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
      config: {
        temperature: 0.7,
        topP: 0.9,
        maxOutputTokens: 4096,
      },
    });

    const text = response.text?.trim();
    if (!text) return null;

    // Clean up the response - remove markdown code blocks if present
    let jsonStr = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    // Try to find JSON object if there's extra text
    const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonStr = jsonMatch[0];
    }

    const result = JSON.parse(jsonStr) as AiGenerationResult;

    // Validate required fields
    if (!result.title || !result.slug || !result.content) {
      console.error('AI Generation returned incomplete data');
      return null;
    }

    // Clean up slug
    result.slug = result.slug
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    // Add timestamp to make slug unique
    result.slug = `${result.slug}-${Date.now().toString(36)}`;

    return result;
  } catch (error) {
    console.error('AI Generation Error:', error);
    return null;
  }
}

// Combined function: evaluate and generate if worthy
export async function processArticleWithAI(
  title: string,
  content: string,
  sourceName: string
): Promise<{ evaluation: AiEvaluationResult; article: AiGenerationResult } | null> {
  // Stage 1: Evaluate
  const evaluation = await evaluateArticle(title, content);

  if (!evaluation) {
    console.log(`  Evaluation failed for: ${title.slice(0, 50)}...`);
    return null;
  }

  if (!evaluation.should_publish) {
    console.log(`  Skipped (${evaluation.reason}): ${title.slice(0, 50)}...`);
    return null;
  }

  // Stage 2: Generate
  const article = await generateArticle(title, content, sourceName, evaluation.category);

  if (!article) {
    console.log(`  Generation failed for: ${title.slice(0, 50)}...`);
    return null;
  }

  console.log(`  Generated: ${article.title.slice(0, 50)}...`);
  return { evaluation, article };
}

// Calculate word count from content
export function calculateWordCount(content: string): number {
  return content.split(/\s+/).filter((word) => word.length > 0).length;
}

// Generate image search query from article
export function generateImageQuery(title: string, category: string): string {
  // Extract main keywords from title
  const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'is', 'are', 'was', 'were'];
  const keywords = title
    .toLowerCase()
    .split(/\s+/)
    .filter((word) => !stopWords.includes(word) && word.length > 2)
    .slice(0, 3)
    .join(' ');

  return `${keywords} ${category}`;
}
