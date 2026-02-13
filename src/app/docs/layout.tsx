import { DocsSidebarNav } from "@/components/layout/sidebar-nav";
import { docsConfig } from "@/config/docs";

export default function DocsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen flex-col">
            <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-14 items-center">
                    <div className="mr-4 hidden md:flex">
                        <a href="/" className="mr-6 flex items-center space-x-2">
                            <span className="hidden font-bold sm:inline-block">ScaleKit</span>
                        </a>
                        <nav className="flex items-center space-x-6 text-sm font-medium">
                            <a href="/docs/intro" className="transition-colors hover:text-foreground/80 text-foreground/60">Docs</a>
                            <a href="https://github.com/sorkhademanthan/ScaleKit" className="transition-colors hover:text-foreground/80 text-foreground/60">GitHub</a>
                        </nav>
                    </div>
                </div>
            </header>
            <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
                <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 overflow-y-auto border-r md:sticky md:block">
                    <div className="h-full py-6 pr-6 lg:py-8">
                        <DocsSidebarNav items={docsConfig} pathname={null} />
                    </div>
                </aside>
                {children}
            </div>
        </div>
    );
}
