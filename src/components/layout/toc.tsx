"use client";

import { useEffect, useState } from "react";
import { cn } from "@/core/utils/cn";

interface TocItem {
    id: string;
    title: string;
    level: number;
}

interface TableOfContentsProps {
    toc: TocItem[];
}

export function TableOfContents({ toc }: TableOfContentsProps) {
    const [activeId, setActiveId] = useState<string>("");

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            { rootMargin: "0px 0px -80% 0px" }
        );

        const headings = document.querySelectorAll("h2, h3");
        headings.forEach((heading) => observer.observe(heading));

        return () => {
            headings.forEach((heading) => observer.unobserve(heading));
        };
    }, []);

    if (!toc?.length) return null;

    return (
        <div className="space-y-4">
            <p className="font-semibold text-sm tracking-tight text-foreground">On This Page</p>
            <ul className="m-0 list-none text-sm space-y-2 border-l border-border/40 pl-4">
                {toc.map((item) => (
                    <li key={item.id} className="mt-0 pt-0">
                        <a
                            href={`#${item.id}`}
                            className={cn(
                                "inline-block no-underline transition-all hover:text-foreground relative -ml-[17px] pl-4 border-l-2 border-transparent py-1",
                                item.level === 3 ? "pl-8" : "",
                                item.id === activeId
                                    ? "font-medium text-foreground border-l-foreground"
                                    : "text-muted-foreground hover:border-l-foreground/50"
                            )}
                        >
                            {item.title}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}
