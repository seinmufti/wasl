"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Plus, User } from "lucide-react";
import { useSettings } from "@/components/settings-provider";
import { cn } from "@/lib/utils";

export function isTabRoute(pathname: string) {
  return pathname === "/" || pathname === "/profile";
}

export function BottomNav() {
  const pathname = usePathname();
  const { t } = useSettings();

  if (!isTabRoute(pathname)) return null;

  return (
    <nav className="shrink-0 border-t bg-background/95 px-4 pt-3 pb-4 backdrop-blur-sm">
      <div className="grid grid-cols-3 items-end">
        <NavItem
          href="/"
          active={pathname === "/"}
          icon={<Home className="size-6" />}
          label={t("home")}
        />
        <Link
          href="/new"
          className="flex flex-col items-center gap-1.5 pb-0.5"
          aria-label={t("createNewInvoice")}
        >
          <span className="flex size-16 -translate-y-2 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform active:scale-95">
            <Plus className="size-8" />
          </span>
          <span className="max-w-full truncate text-xs font-medium text-muted-foreground">
            {t("createInvoice")}
          </span>
        </Link>
        <NavItem
          href="/profile"
          active={pathname === "/profile"}
          icon={<User className="size-6" />}
          label={t("profile")}
        />
      </div>
    </nav>
  );
}

function NavItem({
  href,
  active,
  icon,
  label,
}: {
  href: string;
  active: boolean;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex flex-col items-center gap-1.5 py-2.5 text-muted-foreground transition-colors",
        active && "text-primary",
      )}
    >
      {icon}
      <span className="max-w-full truncate text-xs font-medium">
        {label}
      </span>
    </Link>
  );
}
