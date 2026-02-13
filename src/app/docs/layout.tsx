import { DocsSidebarNav } from "@/components/layout/sidebar-nav";
import { docsConfig } from "@/config/docs";
import Link from "next/link";
import { Box } from "lucide-react";

export default function DocsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen flex-col bg-background">
            {/* Premium Header */}
            <header className="sticky top-0 z-50 w-full glass border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto flex h-16 items-center px-4 md:px-8">
                    <Link href="/" className="mr-8 flex items-center space-x-2 transition-transform hover:scale-105">
                        <Box className="h-6 w-6" />
                        <span className="font-bold text-lg tracking-tight">ScaleKit</span>
                    </Link>
                    <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
                        <Link href="/docs/intro" className="text-foreground transition-colors hover:text-foreground/80">Documentation</Link>
                        <Link href="/components" className="text-muted-foreground transition-colors hover:text-foreground">Components</Link>
                        <Link href="/blog" className="text-muted-foreground transition-colors hover:text-foreground">Blog</Link>
                    </nav>
                    <div className="ml-auto flex items-center space-x-4">
                        <Link href="https://github.com/sorkhademanthan/ScaleKit" className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">
                            GitHub
                        </Link>
                        <Link href="/login" className="hidden sm:inline-flex h-9 items-center justify-center rounded-full border border-border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                            Sign In
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            {/* Removed the double-grid definition from here. Layout only defines Sidebar + Content Container */}
            <div className="container mx-auto flex-1 items-start md:grid md:grid-cols-[240px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-10 px-4 md:px-8">
                {/* Sidebar */}
                <aside className="fixed top-16 z-30 -ml-2 hidden h-[calc(100vh-4rem)] w-full shrink-0 overflow-y-auto border-r border-border/40 md:sticky md:block pr-6 custom-scrollbar">
                    <div className="h-full py-6 lg:py-8">
                        <DocsSidebarNav items={docsConfig} />
                    </div>
                </aside>

                {/* Content Shell - Let children (page.tsx) handle the internal grid/typography */}
                <main className="relative py-6 lg:gap-10 lg:py-8 animate-fade-in">
                    {children}
                </main>
            </div>
        </div>
    );
}
