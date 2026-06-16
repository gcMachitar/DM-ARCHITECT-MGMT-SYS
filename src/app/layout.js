import { Geist, Geist_Mono } from "next/font/google";
import { AppShell } from "./_components/app-shell";
import { SyncStatus } from "./_components/sync-status";
import { Toast } from "./_components/toast";
import { ConfirmModal } from "./_components/confirm-modal";
import "./globals.css";
import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME } from "@/lib/auth-config";

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

export default async function RootLayout({ children }) {
  const cookieStore = await cookies();
  const role = cookieStore.get(AUTH_COOKIE_NAME)?.value || "architect";

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#edf7e4] text-olive-950">
        <AppShell role={role}>{children}</AppShell>
        <SyncStatus />
        <Toast />
        <ConfirmModal />
      </body>
    </html>
  );
}
