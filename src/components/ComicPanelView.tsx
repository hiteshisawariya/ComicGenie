"use client";
import { useState } from "react";
import { ComicPanel } from "@/types/comic";

interface Props {
  panel: ComicPanel;
  isLoading?: boolean;
}

export default function ComicPanelView({ panel, isLoading }: Props) {
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <div className="comic-panel flex flex-col" style={{ minHeight: "300px" }}>
      {panel.narrationText && (
        <div className="narration-box">{panel.narrationText}</div>
      )}
      <div className="flex-1 relative bg-gradient-to-br from-blue-50 to-purple-50" style={{ minHeight: "180px" }}>
        {isLoading && !panel.imageUrl ? (
          <div className="absolute inset-0 shimmer flex items-center justify-center">
            <span className="font-bangers text-gray-400 text-lg">Drawing...</span>
          </div>
        ) : panel.imageUrl && !imgError ? (
          <>
            {!imgLoaded && (
              <div className="absolute inset-0 shimmer flex items-center justify-center z-10">
                <span className="font-bangers text-gray-400 text-sm">Loading image...</span>
              </div>
            )}
            <img
              src={panel.imageUrl}
              alt={panel.narrationText}
              className="w-full h-full object-cover"
              style={{ display: imgLoaded ? "block" : "none" }}
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgError(true)}
            />
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-gradient-to-br from-yellow-50 to-orange-50">
            <div className="text-4xl mb-2">🎨</div>
            <p className="font-comic text-xs text-gray-500 text-center italic leading-tight">
              {panel.imagePrompt?.slice(0, 80)}...
            </p>
          </div>
        )}
        <div className="absolute top-2 right-2 w-7 h-7 bg-[var(--ink)] text-white rounded-full flex items-center justify-center font-bangers text-sm z-20">
          {panel.panelNumber}
        </div>
      </div>
      <div className="p-3 bg-[var(--panel-bg)] border-t-2 border-[var(--ink)]" style={{ minHeight: "80px" }}>
        {panel.character && (
          <p className="font-bangers text-xs text-[var(--accent)] uppercase mb-1 tracking-wide">
            {panel.character}:
          </p>
        )}
        {panel.dialogueText && (
          <div className="speech-bubble">{panel.dialogueText}</div>
        )}
      </div>
    </div>
  );
}
