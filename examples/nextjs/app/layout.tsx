import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "octaCEL Next.js example",
  description:
    "A small application used to verify the octaCEL project template.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
