import { Geist, Geist_Mono } from "next/font/google";
import { AppShell } from "./_components/app-shell";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "DM Operations Command",
  description:
    "Architecture firm project, manpower, management, and contracting dashboard.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#edf7e4] text-olive-950">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
