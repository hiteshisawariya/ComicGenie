"use client";
import { useState, useRef } from "react";
import { Sparkles, BookOpen, Download, Loader2, Palette, ChevronRight, AlertCircle } from "lucide-react";
import { ComicOptions, ComicPanel, GenerationStatus } from "@/types/comic";
import { buildPages } from "@/lib/comic-utils";
import ComicPageView from "@/components/ComicPageView";
import DownloadButton from "@/components/DownloadButton";
import AuthGuard from "@/components/AuthGuard";

const SUBJECTS = ["Science", "History", "Mathematics", "Geography", "Biology", "Physics", "Chemistry", "Literature", "Economics"];
const ART_STYLES = [
  { value: "comic", label: "Comic Book", emoji: "🎨" },
  { value: "manga", label: "Manga", emoji: "⭐" },
  { value: "watercolor", label: "Watercolor", emoji: "🎭" },
  { value: "sketch", label: "Sketch", emoji: "✏️" }
];

const defaultOptions: ComicOptions = {
  topic: "",
  subject: "Science",
  panelsPerPage: 4,
  totalPanels: 8,
  artStyle: "comic",
  downloadFormat: "pdf"
};

export default function Home() {
  const [options, setOptions] = useState<ComicOptions>(defaultOptions);
  const [status, setStatus] = useState<GenerationStatus>("idle");
  const [panels, setPanels] = useState<ComicPanel[]>([]);
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const comicRef = useRef<HTMLDivElement>(null);

  const pages = buildPages(panels, options.panelsPerPage);
  const isLoading = status === "generating-story" || status === "generating-images";

  async function handleGenerate() {
    if (!options.topic.trim()) { setError("Please enter a topic first!"); return; }
    setError(""); setStatus("generating-story"); setProgress(10); setPanels([]);

    try {
      const storyRes = await fetch("/api/generate-story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: options.topic, subject: options.subject, artStyle: options.artStyle })
      });
      if (!storyRes.ok) { const e = await storyRes.json(); throw new Error(e.error ?? "Story generation failed"); }

      const storyData = await storyRes.json();
      setTitle(storyData.title);
      setSummary(storyData.summary);
      setPanels(storyData.panels);
      setProgress(50);
      setStatus("generating-images");

      const imgRes = await fetch("/api/generate-images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ panels: storyData.panels, artStyle: options.artStyle })
      });
      if (!imgRes.ok) { const e = await imgRes.json(); throw new Error(e.error ?? "Image generation failed"); }

      const imgData = await imgRes.json();
      const updatedPanels: ComicPanel[] = storyData.panels.map((panel: ComicPanel) => {
        const img = imgData.results.find((r: { id: number; imageUrl: string | null }) => r.id === panel.id);
        return { ...panel, imageUrl: img?.imageUrl ?? null };
      });

      setPanels(updatedPanels);
      setProgress(100);
      setStatus("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
      setProgress(0);
    }
  }

  return (
    <AuthGuard>
      <main className="min-h-screen halftone-bg">
        {/* HEADER — no download button here, only at bottom */}
        <header className="bg-[var(--ink)] text-white py-4 px-6 flex items-center border-b-4 border-[var(--accent)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[var(--accent)] rounded-lg flex items-center justify-center border-2 border-white" style={{ boxShadow: "3px 3px 0 white" }}>
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bangers text-3xl tracking-wide text-white leading-none">ComicGenie</h1>
              <p className="text-xs text-gray-400 font-comic">Learn anything through comics</p>
            </div>
          </div>
        </header>

        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* CONTROL PANEL */}
          <div className="bg-white rounded-xl p-6 mb-8" style={{ border: "3px solid var(--ink)", boxShadow: "6px 6px 0 var(--ink)" }}>
            <h2 className="font-bangers text-2xl text-[var(--ink)] mb-6 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-[var(--accent)]" /> Create Your Comic
            </h2>

            {/* Topic input */}
            <div className="mb-5">
              <label className="block text-sm font-bold font-comic mb-2">📚 What topic do you want to learn about?</label>
              <input
                type="text"
                value={options.topic}
                onChange={(e) => setOptions({ ...options, topic: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && !isLoading && handleGenerate()}
                placeholder="e.g. How does photosynthesis work? The French Revolution, Newton's Laws..."
                className="w-full px-4 py-3 border-2 border-[var(--ink)] rounded-lg font-comic text-base focus:outline-none focus:ring-2 focus:ring-[var(--accent)] bg-[var(--panel-bg)]"
                disabled={isLoading}
              />
              <p className="text-xs text-gray-400 font-comic mt-1">✨ AI will decide how many panels are needed to fully explain the topic</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              {/* Subject */}
              <div>
                <label className="block text-xs font-bold font-comic mb-1.5">📖 Subject</label>
                <select value={options.subject} onChange={(e) => setOptions({ ...options, subject: e.target.value })} disabled={isLoading}
                  className="w-full px-3 py-2 border-2 border-[var(--ink)] rounded-lg font-comic text-sm focus:outline-none bg-[var(--panel-bg)]">
                  {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>

              {/* Panels per page */}
              <div>
                <label className="block text-xs font-bold font-comic mb-1.5">📄 Panels per page</label>
                <div className="flex gap-2">
                  {([2, 3, 4] as const).map((n) => (
                    <button key={n} onClick={() => setOptions({ ...options, panelsPerPage: n })} disabled={isLoading}
                      className={`flex-1 py-2 border-2 border-[var(--ink)] rounded-lg font-bangers text-lg transition-all
                        ${options.panelsPerPage === n ? "bg-[var(--accent)] text-white" : "bg-[var(--panel-bg)] hover:bg-gray-100"}`}>
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              {/* Download format */}
              <div>
                <label className="block text-xs font-bold font-comic mb-1.5">
                  <Download className="inline w-3 h-3 mr-1" />Download as
                </label>
                <div className="flex gap-2">
                  {(["png", "pdf"] as const).map((fmt) => (
                    <button key={fmt} onClick={() => setOptions({ ...options, downloadFormat: fmt })} disabled={isLoading}
                      className={`flex-1 py-2 border-2 border-[var(--ink)] rounded-lg font-bangers text-base uppercase transition-all
                        ${options.downloadFormat === fmt ? "bg-[var(--sky)] text-white" : "bg-[var(--panel-bg)] hover:bg-gray-100"}`}>
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Art style */}
            <div className="mb-6">
              <label className="block text-xs font-bold font-comic mb-2">
                <Palette className="inline w-3 h-3 mr-1" />Art Style
              </label>
              <div className="flex gap-2 flex-wrap">
                {ART_STYLES.map((style) => (
                  <button key={style.value}
                    onClick={() => setOptions({ ...options, artStyle: style.value as ComicOptions["artStyle"] })}
                    disabled={isLoading}
                    className={`px-4 py-2 border-2 border-[var(--ink)] rounded-lg font-comic font-bold text-sm transition-all flex items-center gap-1.5
                      ${options.artStyle === style.value ? "bg-[var(--gold)]" : "bg-[var(--panel-bg)] hover:bg-gray-100"}`}>
                    <span>{style.emoji}</span> {style.label}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="mb-4 flex items-center gap-2 text-[var(--accent)] bg-red-50 border-2 border-[var(--accent)] rounded-lg px-4 py-3 font-comic font-bold text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />{error}
              </div>
            )}

            {/* Generate button */}
            <button
              onClick={handleGenerate}
              disabled={isLoading || !options.topic.trim()}
              className="w-full py-4 bg-[var(--accent)] text-white font-bangers text-2xl tracking-widest rounded-xl flex items-center justify-center gap-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ border: "3px solid var(--ink)", boxShadow: "5px 5px 0 var(--ink)" }}>
              {isLoading ? (
                <><Loader2 className="w-6 h-6 animate-spin" />
                  {status === "generating-story" ? "Writing the story..." : "Drawing the panels..."}
                </>
              ) : (
                <><Sparkles className="w-6 h-6" /> Generate Comic <ChevronRight className="w-6 h-6" /></>
              )}
            </button>

            {/* Progress bar */}
            {isLoading && (
              <div className="mt-4">
                <div className="flex justify-between text-xs font-comic text-gray-500 mb-1">
                  <span>{status === "generating-story" ? "Step 1/2: AI is writing a full explanation..." : "Step 2/2: Drawing all panel images..."}</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 border border-[var(--ink)] overflow-hidden">
                  <div className="h-3 bg-[var(--accent)] rounded-full transition-all duration-700" style={{ width: `${progress}%` }} />
                </div>
              </div>
            )}
          </div>

          {/* COMIC OUTPUT */}
          {panels.length > 0 && (
            <div>
              {title && (
                <div className="text-center mb-6">
                  <h2 className="font-bangers text-4xl text-[var(--ink)] tracking-wide" style={{ textShadow: "3px 3px 0 var(--accent)" }}>
                    {title}
                  </h2>
                  {summary && <p className="font-comic text-gray-600 mt-1 text-sm max-w-2xl mx-auto">{summary}</p>}
                  <p className="font-comic text-gray-400 text-xs mt-1">{panels.length} panels across {pages.length} pages</p>
                </div>
              )}
              <div ref={comicRef} id="comic-output">
                {pages.map((page) => (
                  <ComicPageView key={page.pageNumber} page={page} panelsPerPage={options.panelsPerPage} isLoading={status === "generating-images"} />
                ))}
              </div>
              {/* Download button ONLY at the bottom */}
              {status === "done" && (
                <div className="mt-8 flex justify-center">
                  <DownloadButton comicRef={comicRef} title={title} format={options.downloadFormat} large />
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </AuthGuard>
  );
}
