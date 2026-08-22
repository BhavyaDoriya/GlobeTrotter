import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GlobeTrotter — Plan Your Next Adventure",
  description: "Build, view and share travel itineraries with smart budget tracking.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}