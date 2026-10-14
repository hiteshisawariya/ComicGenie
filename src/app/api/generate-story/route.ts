import { NextRequest, NextResponse } from "next/server";
import { ComicPanel, GenerateStoryResponse } from "@/types/comic";

export async function POST(req: NextRequest) {
  try {
    const { topic, subject, artStyle } = await req.json();
    if (!topic) return NextResponse.json({ error: "Missing topic" }, { status: 400 });

    const systemPrompt = `You are an expert educational comic writer for students aged 10-16.
You write cinematic, visually rich comic scripts with consistent characters and detailed scene descriptions.
Always respond with valid JSON only. No markdown, no explanation.`;

    const userPrompt = `Create an educational comic about: "${topic}" (Subject: ${subject}).

Use exactly 12 panels. Cover: hook → definition → step by step process → real world use → summary.

Your 2 fixed characters are:
- Student: "Priya, 14-year-old Indian girl, long black hair in ponytail, blue and white school uniform, brown eyes, friendly curious expression, animated comic art style"
- Scientist: "Dr. Jay, middle-aged man, short neat grey hair, round black glasses, white lab coat over blue shirt, warm smile, square jaw, animated comic art style"

Return this exact JSON:
{
  "title": "Short catchy title (max 5 words)",
  "summary": "One sentence summary",
  "panels": [
    {
      "id": 1,
      "panelNumber": 1,
      "character": "Priya (student)",
      "narrationText": "Max 6 words scene caption",
      "dialogueText": "Max 2 short sentences. Include science formula if relevant e.g. 6CO2+6H2O→C6H12O6+6O2 with one line explanation.",
      "imagePrompt": ""
    }
  ]
}

RULES for imagePrompt — write each one following this EXACT template:

For panels with Priya only:
"Animated comic art illustration. Priya, 14-year-old Indian girl, long black hair in ponytail, blue and white school uniform, brown eyes, [EMOTION: excited/curious/surprised/amazed] expression. [SPECIFIC BACKGROUND: describe detailed environment]. [WHAT SHE IS DOING]. Vivid colors, dramatic lighting, highly detailed background, comic book style. NOT photorealistic, NOT realistic photo."

For panels with Dr. Jay only:
"Animated comic art illustration. Dr. Jay, middle-aged man, short neat grey hair, round black glasses, white lab coat over blue shirt, warm smile, square jaw, [EMOTION] expression. [SPECIFIC BACKGROUND: describe detailed environment]. [WHAT HE IS DOING]. Vivid colors, dramatic lighting, highly detailed background, comic book style. NOT photorealistic, NOT realistic photo."

For panels with both characters:
"Animated comic art illustration. Left: Priya, 14-year-old Indian girl, long black hair in ponytail, blue and white school uniform. Right: Dr. Jay, middle-aged man, short grey hair, round black glasses, white lab coat. Both in [SPECIFIC BACKGROUND]. [WHAT THEY ARE DOING TOGETHER]. Vivid colors, dramatic lighting, highly detailed background, comic book style. NOT photorealistic, NOT realistic photo."

BACKGROUND RULES — make every background specific and cinematic:
- Science panels: "sunlit science lab with glowing equipment, colorful chemical bottles on shelves, bright white lighting"
- Nature panels: "lush green forest with sunlight streaming through tall trees, morning mist, rich warm colors"
- Ocean/water panels: "dramatic ocean shore at golden sunset, orange and pink sky reflected in deep blue waves"
- Sky/atmosphere panels: "dramatic cloudy sky with golden sunlight breaking through, deep blue and orange tones"
- Classroom panels: "bright modern classroom, tall windows with natural light, green plants on windowsill, colorful posters"
- City panels: "vibrant busy city street, warm afternoon light, colorful shop fronts, clear blue sky"
- Always end with: "Vivid colors, dramatic lighting, highly detailed background, comic book style. NOT photorealistic."

RULES for dialogueText:
- Max 2 sentences only
- Include real science formula in at least 3 panels
- Simple English a 12-year-old understands

Art style: ${artStyle}`;

    let response: Response | null = null;
    let attempts = 0;

    while (attempts < 3) {
      response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
          ],
          temperature: 0.6,
          max_tokens: 3000
        })
      });

      if (response.status === 429) {
        attempts++;
        console.log(`Rate limited. Attempt ${attempts}/3. Waiting 15 seconds...`);
        await new Promise(r => setTimeout(r, 15000));
        continue;
      }
      break;
    }

    if (!response || !response.ok) {
      const errText = response ? await response.text() : "No response";
      throw new Error(`Groq API error ${response?.status}: ${errText}`);
    }

    const data = await response.json();
    const raw = data.choices?.[0]?.message?.content ?? "";
    if (!raw) throw new Error("Empty response from Groq");

    const cleaned = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const parsed = JSON.parse(cleaned) as GenerateStoryResponse;

    if (!parsed.panels || !Array.isArray(parsed.panels)) {
      throw new Error("Invalid response structure from Groq");
    }

    const panels: ComicPanel[] = parsed.panels.map((p, idx) => ({
      ...p,
      id: idx + 1,
      panelNumber: idx + 1,
      imageUrl: null
    }));

    return NextResponse.json({ panels, title: parsed.title, summary: parsed.summary });

  } catch (error) {
    const message = error instanceof Error ? error.message : "Story generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}