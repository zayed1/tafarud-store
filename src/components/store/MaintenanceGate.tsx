"use client";

import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import MaintenancePage from "./MaintenancePage";

export default function MaintenanceGate({
  isEnabled,
  children,
}: {
  isEnabled: boolean;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const locale = useLocale();

  // Allow admin routes to bypass maintenance
  if (isEnabled && !pathname.includes("/admin")) {
    return <MaintenancePage locale={locale} />;
  }

  return <>{children}</>;
}
