import Link from "next/link";
import { type SidebarNav } from "@/config/docs";
import { cn } from "@/core/utils/cn";

export function DocsSidebarNav({
    items,
    pathname
}: {
    items: SidebarNav;
    pathname: string | null
}) {
    return items.length ? (
        <div className="w-full">
            {items.map((item, index) => (
                <div key={index} className="pb-8">
                    <h4 className="mb-1 rounded-md px-2 py-1 text-sm font-semibold">
                        {item.title}
                    </h4>
                    {item.items?.length && (
                        <DocsSidebarNavItems
                            items={item.items}
                            pathname={pathname}
                        />
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
        <div className="grid grid-flow-row auto-rows-max text-sm">
            {items.map((item, index) =>
                item.href ? (
                    <Link
                        key={index}
                        href={item.href}
                        className={cn(
                            "group flex w-full items-center rounded-md border border-transparent px-2 py-1 hover:underline text-neutral-500 hover:text-neutral-900",
                            pathname === item.href ? "font-medium text-neutral-900" : ""
                        )}
                        target={item.href.startsWith("http") ? "_blank" : undefined}
                        rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                    >
                        {item.title}
                    </Link>
                ) : (
                    <span
                        key={index}
                        className="flex w-full cursor-not-allowed items-center rounded-md px-2 py-1 text-neutral-500 hover:underline opacity-60"
                    >
                        {item.title}
                    </span>
                )
            )}
        </div>
    ) : null;
}
