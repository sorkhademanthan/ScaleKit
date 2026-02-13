"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type SidebarNav } from "@/config/docs";
import { cn } from "@/core/utils/cn";

export function DocsSidebarNav({ items }: { items: SidebarNav }) {
    const pathname = usePathname();

    return items.length ? (
        <div className="w-full">
            {items.map((item, index) => (
                <div key={index} className="pb-8">
                    <h4 className="mb-2 rounded-md px-2 py-1 text-sm font-semibold text-foreground tracking-tight">
                        {item.title}
                    </h4>
                    {item.items?.length && (
                        <DocsSidebarNavItems items={item.items} pathname={pathname} />
                    )}
                </div>
            ))}
        </div>
    ) : null;
}

function DocsSidebarNavItems({
    items,
    pathname,
}: {
    items: SidebarNav;
    pathname: string | null;
}) {
    return items.length ? (
        <div className="grid grid-flow-row auto-rows-max text-sm relative border-l border-border/40 ml-2">
            {items.map((item, index) =>
                item.href ? (
                    <Link
                        key={index}
                        href={item.href}
                        className={cn(
                            "group flex w-full items-center border-l border-transparent px-4 py-2 text-muted-foreground transition-all duration-200 hover:text-foreground",
                            pathname === item.href
                                ? "font-medium text-foreground -ml-px border-l-foreground"
                                : "hover:border-l-foreground/50"
                        )}
                        target={item.href.startsWith("http") ? "_blank" : undefined}
                        rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                    >
                        {item.title}
                    </Link>
                ) : (
                    <span
                        key={index}
                        className="flex w-full cursor-not-allowed items-center px-4 py-2 text-muted-foreground/50 opacity-60"
                    >
                        {item.title}
                    </span>
                )
            )}
        </div>
    ) : null;
}
