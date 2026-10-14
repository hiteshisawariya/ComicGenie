import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ComicGenie — Learn Through Comics",
  description: "Turn any educational topic into an engaging comic strip powered by AI"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
