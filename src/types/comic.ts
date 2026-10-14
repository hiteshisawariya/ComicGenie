export interface ComicPanel {
  id: number;
  panelNumber: number;
  dialogueText: string;
  narrationText: string;
  imagePrompt: string;
  imageUrl: string | null;
  character: string;
}

export interface ComicPage {
  pageNumber: number;
  panels: ComicPanel[];
}

export interface ComicOptions {
  topic: string;
  subject: string;
  panelsPerPage: 2 | 3 | 4;
  totalPanels: number;
  artStyle: "comic" | "manga" | "watercolor" | "sketch";
  downloadFormat: "png" | "pdf";
}

export interface GenerateStoryResponse {
  panels: ComicPanel[];
  title: string;
  summary: string;
}

export type GenerationStatus =
  | "idle"
  | "generating-story"
  | "generating-images"
  | "done"
  | "error";
