import Link from "next/link";
import { ArrowRight, Book, Shield, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between mx-auto px-4 md:px-8">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block text-xl">ScaleKit</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link href="/docs/intro" className="transition-colors hover:text-foreground/80 text-foreground/60">Docs</Link>
            <Link href="/login" className="transition-colors hover:text-foreground/80 text-foreground/60">Login</Link>
            <Link href="/register" className="transition-colors bg-foreground text-background px-4 py-2 rounded-md font-semibold hover:bg-foreground/90">Sign Up</Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
          <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center mx-auto px-4">
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter">
              Build Faster with ScaleKit
            </h1>
            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
              A comprehensive toolkit for building scalable web applications. Includes authentication, database integration, and UI components out of the box.
            </p>
            <div className="flex space-x-4">
              <Link
                href="/docs/intro"
                className="inline-flex h-11 items-center justify-center rounded-md bg-foreground px-8 text-sm font-medium text-background shadow transition-colors hover:bg-foreground/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              >
                Get Started
              </Link>
              <Link
                href="https://github.com/sorkhademanthan/ScaleKit"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              >
                GitHub
              </Link>
            </div>
          </div>
        </section>

        <section id="features" className="container space-y-6 py-8 md:py-12 lg:py-24 bg-zinc-50 dark:bg-zinc-900 mx-auto px-4 rounded-xl">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
            <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-5xl font-bold">
              Features
            </h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              Everything you need to ship your next project faster.
            </p>
          </div>
          <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
            <div className="relative overflow-hidden rounded-lg border bg-background p-2">
              <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                <Shield className="h-12 w-12 text-primary" />
                <div className="space-y-2">
                  <h3 className="font-bold">Authentication</h3>
                  <p className="text-sm text-muted-foreground">
                    Secure login logic with JWT, RBAC, and session management.
                  </p>
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-lg border bg-background p-2">
              <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                <Zap className="h-12 w-12 text-primary" />
                <div className="space-y-2">
                  <h3 className="font-bold">Design System</h3>
                  <p className="text-sm text-muted-foreground">
                    Beautiful, accessible components built with Tailwind CSS.
                  </p>
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-lg border bg-background p-2">
              <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                <Book className="h-12 w-12 text-primary" />
                <div className="space-y-2">
                  <h3 className="font-bold">Documentation</h3>
                  <p className="text-sm text-muted-foreground">
                    Comprehensive guides and API references for developers.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="mx-auto text-center md:max-w-[58rem]">
            <p className="leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              ScaleKit is open source and powered by open web standards.
            </p>
          </div>
        </section>
      </main>

      <footer className="py-6 md:px-8 md:py-0 border-t">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row mx-auto px-4">
          <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built by{" "}
            <a
              href="https://twitter.com/manthansorkhade"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              Manthan Sorkhade
            </a>
            .
          </p>
        </div>
      </footer>
    </div>
  );
}
