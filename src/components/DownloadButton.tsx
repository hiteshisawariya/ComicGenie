"use client";
import { useState, RefObject } from "react";
import { Download, Loader2 } from "lucide-react";

interface Props {
  comicRef: RefObject<HTMLDivElement>;
  title: string;
  format: "png" | "pdf";
  large?: boolean;
}

export default function DownloadButton({ comicRef, title, format, large }: Props) {
  const [downloading, setDownloading] = useState(false);

  async function handleDownload() {
    if (!comicRef.current) return;
    setDownloading(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(comicRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#f0ede4",
        logging: false
      });
      const safeName = title.replace(/\s+/g, "-").toLowerCase();
      if (format === "png") {
        const link = document.createElement("a");
        link.download = `${safeName}-comic.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
      } else {
        const { jsPDF } = await import("jspdf");
        const imgData = canvas.toDataURL("image/jpeg", 0.92);
        const pdf = new jsPDF({
          orientation: canvas.width > canvas.height ? "landscape" : "portrait",
          unit: "px",
          format: [canvas.width / 2, canvas.height / 2]
        });
        pdf.addImage(imgData, "JPEG", 0, 0, canvas.width / 2, canvas.height / 2);
        pdf.save(`${safeName}-comic.pdf`);
      }
    } catch (err) {
      console.error("Download failed:", err);
      alert("Download failed. Please try again.");
    } finally {
      setDownloading(false);
    }
  }

  return (
    <button
      onClick={handleDownload}
      disabled={downloading}
      className={`flex items-center gap-2 bg-[var(--sky)] text-white font-bangers tracking-wider border-2 border-white rounded-xl transition-all disabled:opacity-60
        ${large
          ? "px-8 py-4 text-xl shadow-[5px_5px_0_var(--ink)] hover:shadow-[3px_3px_0_var(--ink)] hover:translate-x-[2px] hover:translate-y-[2px]"
          : "px-4 py-2 text-base shadow-[3px_3px_0_rgba(0,0,0,0.3)]"
        }`}
    >
      {downloading
        ? <><Loader2 className="w-4 h-4 animate-spin" /> Preparing {format.toUpperCase()}...</>
        : <><Download className="w-4 h-4" /> Download {format.toUpperCase()}</>
      }
    </button>
  );
}
