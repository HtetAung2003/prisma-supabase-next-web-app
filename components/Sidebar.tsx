"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  AiSearchIcon,
  AnalyticsUpIcon,
  ArrowRight01Icon,
  Cancel01Icon,
  ChatFeedback01FreeIcons,
  CustomerSupportIcon,
  DashboardSquare02Icon,
  Exercise,
  LibraryIcon,
  PackageIcon,
  Settings02Icon,
  ShoppingCart02Icon,
  TimeScheduleFreeIcons,
} from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";

import { ContentLayout } from "@/components/ContentLayout";
import { Icon } from "@/components/Icon";
import { cn } from "@/lib/utils";

interface SidebarItem {
  label: string;
  href: string;
  icon: IconSvgElement;
  badge?: string;
  children?: { label: string; href: string }[];
}

const defaultItems: SidebarItem[] = [
  {
    label: "Dashboard",
    href: "/",
    icon: DashboardSquare02Icon,
  },
  {
    label: "Library",
    href: "/library",
    icon: LibraryIcon,
    badge: "24",
    children: [
      { label: "Catalog", href: "/products" },
      { label: "Categories", href: "/products/categories" },
      { label: "Inventory", href: "/products/inventory" },
    ],
  },
  {
    label: "Schedule",
    href: "/schedule",
    icon: TimeScheduleFreeIcons,
    badge: "8",
    // children: [
    //   { label: "All orders", href: "/orders" },
    //   { label: "Pending", href: "/orders/pending" },
    //   { label: "Completed", href: "/orders/completed" },
    // ],
  },
  {
    label: "Exercise Zone",
    href: "/exercise",
    icon: Exercise,
  },
  {
    label: "Feedback",
    href: "/feedback",
    icon: ChatFeedback01FreeIcons,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings02Icon,
  },
];

interface SidebarProps {
  children: React.ReactNode;
  items?: SidebarItem[];
}

export function Sidebar({
  children,
  items = defaultItems,
}: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const navigationItems = useMemo(() => items, [items]);
  const activeParentLabels = useMemo(
    () =>
      new Set(
        items
          .filter((item) =>
            item.children?.some((child) => pathname.startsWith(child.href)),
          )
          .map((item) => item.label),
      ),
    [items, pathname],
  );

  const toggleExpanded = (label: string) => {
    setExpandedItems((current) => {
      const next = new Set(current);
      if (next.has(label)) {
        next.delete(label);
      } else {
        next.add(label);
      }
      return next;
    });
  };

  const handleRoute = (href: string) => {
    router.push(href);
    setMobileOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <div
        className={cn(
          "fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm transition-opacity lg:hidden",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />

      <aside
        className={cn(
          "fixed inset-y-16 left-0 z-50 flex w-[18rem] flex-col border-r border-sidebar-border/70 bg-sidebar/95 text-sidebar-foreground shadow-2xl backdrop-blur-xl transition-transform duration-200 lg:sticky lg:top-16 lg:z-0 lg:mt-16 lg:h-[calc(100vh-4rem)] lg:translate-x-0 lg:self-start lg:shadow-none",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          collapsed ? "lg:w-[5.5rem]" : "lg:w-[17rem]",
        )}
      >
        <div className="flex h-full flex-col px-3 pb-3 pt-4">
          <div className="mb-4 flex items-center gap-3 rounded-2xl border border-sidebar-border/70 bg-card/60 px-3 py-3">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-primary/12 text-primary">
              <Icon icon={AiSearchIcon} size={18} />
            </div>
            <div className="min-w-0 flex-1">
              <p
                className={cn(
                  "truncate text-sm font-semibold text-sidebar-foreground",
                  collapsed && "lg:hidden",
                )}
              >
                Insight Flow
              </p>
              <p
                className={cn(
                  "truncate text-xs text-muted-foreground",
                  collapsed && "lg:hidden",
                )}
              >
                Revenue and fulfillment
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                mobileOpen ? setMobileOpen(false) : setCollapsed((value) => !value)
              }
              className="inline-flex size-9 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              aria-label={mobileOpen ? "Close sidebar" : "Collapse sidebar"}
            >
              <Icon
                icon={mobileOpen ? Cancel01Icon : ArrowRight01Icon}
                size={18}
                className={cn(!mobileOpen && !collapsed && "rotate-180")}
              />
            </button>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto">
            {navigationItems.map((item) => {
              const hasChildren = Boolean(item.children?.length);
              const childActive = item.children?.some((child) =>
                pathname.startsWith(child.href),
              );
              const isActive = pathname === item.href || childActive;
              const isExpanded =
                expandedItems.has(item.label) || activeParentLabels.has(item.label);

              return (
                <div key={item.label} className="space-y-1">
                  {hasChildren ? (
                    <button
                      type="button"
                      onClick={() => toggleExpanded(item.label)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-all",
                        isActive
                          ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                        collapsed && "lg:justify-center lg:px-2.5",
                      )}
                    >
                      <Icon icon={item.icon} size={18} />
                      <span
                        className={cn(
                          "flex-1 truncate text-left",
                          collapsed && "lg:hidden",
                        )}
                      >
                        {item.label}
                      </span>
                      {!collapsed && (
                        <>
                          {item.badge ? (
                            <span className="rounded-full bg-background/70 px-2 py-0.5 text-[11px] font-semibold">
                              {item.badge}
                            </span>
                          ) : null}
                          <Icon
                            icon={ArrowRight01Icon}
                            size={16}
                            className={cn(
                              "transition-transform",
                              isExpanded && "rotate-90",
                            )}
                          />
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleRoute(item.href)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-all",
                        isActive
                          ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                        collapsed && "lg:justify-center lg:px-2.5",
                      )}
                    >
                      <Icon icon={item.icon} size={18} />
                      <span className={cn("truncate", collapsed && "lg:hidden")}>
                        {item.label}
                      </span>
                      {!collapsed && item.badge ? (
                        <span className="ml-auto rounded-full bg-background/70 px-2 py-0.5 text-[11px] font-semibold">
                          {item.badge}
                        </span>
                      ) : null}
                    </button>
                  )}

                  {hasChildren && isExpanded && !collapsed ? (
                    <div className="space-y-1 pl-4">
                      {item.children?.map((child) => {
                        const childIsActive = pathname.startsWith(child.href);

                        return (
                          <button
                            key={child.href}
                            type="button"
                            onClick={() => handleRoute(child.href)}
                            className={cn(
                              "block w-full rounded-xl px-3 py-2 text-left text-sm transition-colors",
                              childIsActive
                                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                                : "text-muted-foreground hover:bg-sidebar-accent/80 hover:text-sidebar-accent-foreground",
                            )}
                          >
                            {child.label}
                          </button>
                        );
                      })}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </nav>

          <div className="mt-4 rounded-2xl border border-sidebar-border/70 bg-card/70 p-3">
            <div className={cn("space-y-1", collapsed && "lg:hidden")}>
              <p className="text-sm font-semibold text-sidebar-foreground">
                Team target
              </p>
              <p className="text-xs text-muted-foreground">
                84% of the weekly shipment goal is already locked in.
              </p>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
              <div className="h-full w-[84%] rounded-full bg-primary" />
            </div>
          </div>
        </div>
      </aside>

      <ContentLayout onMenuClick={() => setMobileOpen((open) => !open)}>
        {children}
      </ContentLayout>
    </div>
  );
}
