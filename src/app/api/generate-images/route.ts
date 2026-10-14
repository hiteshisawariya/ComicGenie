import { NextRequest, NextResponse } from "next/server";

async function generateImage(prompt: string, artStyle: string): Promise<string | null> {
  const styleMap: Record<string, string> = {
    comic: "animated comic book art, bold vivid colors, NOT photorealistic, NOT realistic photograph",
    manga: "anime manga illustration style, animated, NOT photorealistic, NOT realistic photograph",
    watercolor: "watercolor illustration style, animated, soft colors, NOT photorealistic",
    sketch: "pencil sketch comic illustration, animated style, NOT photorealistic"
  };

  const style = styleMap[artStyle] ?? styleMap.comic;

  // Don't add much — the prompt from generate-story is already very detailed
  const fullPrompt = `${prompt}, ${style}`;

  try {
    const res = await fetch(
      "https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-schnell",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          inputs: fullPrompt,
          parameters: {
            num_inference_steps: 4,
            width: 512,
            height: 512,
            guidance_scale: 3.5
          }
        }),
        signal: AbortSignal.timeout(60000)
      }
    );

    console.log(`FLUX response: ${res.status} ${res.headers.get("content-type")}`);

    if (!res.ok) {
      const txt = await res.text();
      console.warn(`FLUX failed: ${res.status}`, txt.slice(0, 200));
      return null;
    }

    const contentType = res.headers.get("content-type") ?? "";
    if (contentType.includes("application/json")) {
      const json = await res.json();
      console.warn("FLUX JSON error:", json);
      return null;
    }

    const ab = await res.arrayBuffer();
    if (ab.byteLength < 5000) {
      console.warn(`Too small: ${ab.byteLength} bytes`);
      return null;
    }

    console.log(`✅ Success: ${ab.byteLength} bytes`);
    const mime = contentType.includes("png") ? "image/png" : "image/jpeg";
    return `data:${mime};base64,${Buffer.from(ab).toString("base64")}`;

  } catch (e) {
    console.warn("FLUX error:", e instanceof Error ? e.message : e);
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { panels, artStyle } = await req.json();
    if (!panels || !Array.isArray(panels)) {
      return NextResponse.json({ error: "Missing panels array" }, { status: 400 });
    }

    console.log(`Generating ${panels.length} images...`);
    const results: Array<{ id: number; imageUrl: string | null }> = [];

    for (const panel of panels as Array<{ id: number; imagePrompt: string }>) {
      console.log(`Panel ${panel.id}: ${panel.imagePrompt.slice(0, 60)}...`);
      const imageUrl = await generateImage(panel.imagePrompt, artStyle);
      results.push({ id: panel.id, imageUrl });
      await new Promise(r => setTimeout(r, 500));
    }

    console.log(`Done: ${results.filter(r => r.imageUrl).length}/${panels.length} images`);
    return NextResponse.json({ results });

  } catch (error) {
    const message = error instanceof Error ? error.message : "Image generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}