import type { Metadata, Viewport } from "next";
import "./globals.css";
import { cookies } from "next/headers";
import { PwaRegister } from "@/components/pwa-register";

export const metadata: Metadata = {
  title: {
    default: "Family Hub",
    template: "%s · Family Hub",
  },
  description:
    "Shared family dashboard for calendar, shopping, todos, notes, and wall display.",
  applicationName: "Family Hub",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Family Hub",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#0f172a",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const theme = cookieStore.get("theme")?.value === "light" ? "light" : "dark";

  return (
    <html lang="en" className={theme}>
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-100">
        <PwaRegister />
        {children}
      </body>
    </html>
  );
}