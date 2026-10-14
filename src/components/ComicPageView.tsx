import { ComicPage } from "@/types/comic";
import ComicPanelView from "./ComicPanelView";

interface Props {
  page: ComicPage;
  panelsPerPage: number;
  isLoading?: boolean;
}

export default function ComicPageView({ page, panelsPerPage, isLoading }: Props) {
  const gridClass = panelsPerPage === 3 ? "grid-cols-3" : "grid-cols-2";

  return (
    <div className="mb-10 page-break">
      <div className="flex items-center gap-3 mb-3">
        <span className="font-bangers text-lg bg-[var(--ink)] text-white px-3 py-1 rounded-md">
          Page {page.pageNumber}
        </span>
        <div className="flex-1 border-t-2 border-dashed border-[var(--ink)] opacity-30" />
      </div>
      <div
        className={`grid ${gridClass}`}
        style={{
          border: "3px solid var(--ink)",
          boxShadow: "8px 8px 0 var(--ink)",
          background: "var(--ink)",
          gap: "3px",
          borderRadius: "12px",
          overflow: "hidden"
        }}
      >
        {page.panels.map((panel) => (
          <ComicPanelView key={panel.id} panel={panel} isLoading={isLoading} />
        ))}
      </div>
    </div>
  );
}
