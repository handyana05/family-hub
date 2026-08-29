import { AppShell } from "@/components/app-shell";
import { requireUser } from "@/lib/auth";
import { getFamilyHeaderData } from "@/lib/services/family-service";
import { getTheme } from "@/lib/theme";

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await requireUser();

  const [family, currentTheme] = await Promise.all([
    getFamilyHeaderData(session.householdId),
    getTheme(),
  ]);

  return (
    <AppShell
      familyName={family.name}
      currentTheme={currentTheme}
    >
      {children}
    </AppShell>
  );
}