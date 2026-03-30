import "./globals.css";
import { getTheme, resolveServerTheme } from "@/lib/theme";

export const metadata = {
  title: "Family Hub",
  description: "Shared family dashboard",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = await getTheme();
  const resolvedTheme = resolveServerTheme(theme);

  return (
    <html lang="en" className={resolvedTheme}>
      <body>{children}</body>
    </html>
  );
}