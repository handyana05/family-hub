"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  CheckSquare,
  Home,
  Settings,
  ShoppingCart,
} from "lucide-react";

const items = [
  {
    href: "/dashboard",
    label: "Home",
    icon: Home,
  },
  {
    href: "/calendar",
    label: "Calendar",
    icon: CalendarDays,
  },
  {
    href: "/shopping",
    label: "Shopping",
    icon: ShoppingCart,
  },
  {
    href: "/todos",
    label: "Todos",
    icon: CheckSquare,
  },
  {
    href: "/settings",
    label: "Settings",
    icon: Settings,
  },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95 md:hidden">
      <div className="grid grid-cols-5">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 px-2 py-3 text-xs ${
                active
                  ? "text-slate-950 dark:text-white"
                  : "text-slate-500 dark:text-slate-400"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}