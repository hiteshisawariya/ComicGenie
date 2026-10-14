import { ComicPanel, ComicPage } from "@/types/comic";

export function buildPages(panels: ComicPanel[], panelsPerPage: number): ComicPage[] {
  const pages: ComicPage[] = [];
  for (let i = 0; i < panels.length; i += panelsPerPage) {
    pages.push({
      pageNumber: Math.floor(i / panelsPerPage) + 1,
      panels: panels.slice(i, i + panelsPerPage)
    });
  }
  return pages;
}

export function styleModifier(artStyle: string): string {
  const map: Record<string, string> = {
    comic: "bright colorful comic book illustration, bold clean lines, flat vivid colors, Marvel DC comic style, expressive faces",
    manga: "clean detailed manga illustration, expressive faces, screen tones, shounen manga style, dynamic poses",
    watercolor: "soft detailed watercolor illustration, rich pastel colors, children's book quality, gentle brush strokes",
    sketch: "clean pencil and ink illustration, educational textbook style, detailed light hatching, professional sketch"
  };
  return map[artStyle] ?? map["comic"];
}

export function buildImagePrompt(basePrompt: string, artStyle: string): string {
  const noText = "absolutely no text, no letters, no words, no signs, no labels, no captions, no writing of any kind anywhere in the image, no speech bubbles in image, no chalkboard text";
  const quality = "high quality detailed artwork, clean composition, single focused scene, professional illustration";
  return `${basePrompt}, ${styleModifier(artStyle)}, ${noText}, ${quality}`;
}
