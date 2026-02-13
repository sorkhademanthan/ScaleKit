import Link from "next/link";
import { ArrowRight, Box, CreditCard, Globe, Lock, Shield, Terminal, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col font-sans selection:bg-foreground selection:text-background">
      {/* Background Glow */}
      <div className="hero-glow" />

      {/* Modern Glass Header */}
      <header className="fixed top-0 z-50 w-full glass">
        <div className="container mx-auto flex h-16 items-center justify-between px-6 lg:px-8">
          <Link href="/" className="flex items-center space-x-2 group">
            <Box className="w-6 h-6 text-foreground group-hover:scale-110 transition-transform duration-300" />
            <span className="font-bold text-lg tracking-tight">ScaleKit</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <Link href="#features" className="hover:text-foreground transition-colors">Platform</Link>
            <Link href="/docs/intro" className="hover:text-foreground transition-colors">Documentation</Link>
            <Link href="https://github.com/sorkhademanthan/ScaleKit" className="hover:text-foreground transition-colors">GitHub</Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
              Sign in
            </Link>
            <Link
              href="/register"
              className="inline-flex h-9 items-center justify-center rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-foreground/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 pt-32 pb-16">
        <section className="container mx-auto px-6 lg:px-8 flex flex-col items-center text-center space-y-8 animate-fade-in">

          <div className="inline-flex items-center rounded-full border border-border px-3 py-1 text-sm text-muted-foreground bg-muted/50 backdrop-blur-sm animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
            v1.0 is now live
          </div>

          <h1 className="max-w-4xl text-5xl md:text-7xl font-bold tracking-tight text-gradient animate-slide-up" style={{ animationDelay: '0.2s' }}>
            Architect Your Ambition. <br className="hidden md:block" />
            <span className="text-foreground">Scale Without Limits.</span>
          </h1>

          <p className="max-w-2xl text-lg text-muted-foreground leading-relaxed animate-slide-up" style={{ animationDelay: '0.3s' }}>
            A comprehensive, enterprise-ready toolkit designed for modern web applications.
            Production-grade authentication, type-safe database schemas, and a
            glass-morphic design system—all out of the box.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <Link
              href="/register"
              className="inline-flex h-12 items-center justify-center rounded-full bg-foreground px-8 text-base font-semibold text-background shadow-lg shadow-foreground/20 transition-all hover:scale-105 hover:shadow-xl focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              Start Building Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="/docs/intro"
              className="inline-flex h-12 items-center justify-center rounded-full border border-border bg-background px-8 text-base font-medium transition-all hover:bg-muted/50 hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              Read Documentation
            </Link>
          </div>

          {/* Social Proof Placeholder */}
          <div className="pt-16 animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <p className="text-sm font-medium text-muted-foreground mb-6 uppercase tracking-wider">Trusted by industry leaders in design</p>
            <div className="flex flex-wrap justify-center gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
              {/* Replace with SVGs later */}
              <div className="h-8 w-24 bg-muted rounded animate-pulse-slow"></div>
              <div className="h-8 w-24 bg-muted rounded animate-pulse-slow" style={{ animationDelay: '0.2s' }}></div>
              <div className="h-8 w-24 bg-muted rounded animate-pulse-slow" style={{ animationDelay: '0.4s' }}></div>
              <div className="h-8 w-24 bg-muted rounded animate-pulse-slow" style={{ animationDelay: '0.6s' }}></div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="container mx-auto px-6 lg:px-8 py-24 sm:py-32">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-base font-semibold leading-7 text-indigo-500">Deploy faster</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
              Everything you need to ship to production
            </p>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Designed with obsessive attention to detail. Every component, every animation, every line of code is crafted for performance and scale.
            </p>
          </div>

          <div className="mx-auto mt-16 max-w-7xl sm:mt-20 lg:mt-24">
            <dl className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-3">
              {[
                {
                  name: 'Authentication Suite',
                  description:
                    'Enterprise-ready JWT authentication with Role-Based Access Control (RBAC) and session management baked in.',
                  icon: Shield,
                },
                {
                  name: 'Type-Safe Database',
                  description:
                    'Built on Drizzle ORM for full TypeScript inference. Catch database errors at compile time, not runtime.',
                  icon: Terminal,
                },
                {
                  name: 'Global Edge Network',
                  description:
                    'Deployed to the edge by default. Ensure your application is blazing fast for users anywhere in the world.',
                  icon: Globe,
                },
                {
                  name: 'Detailed Analytics',
                  description:
                    'Privacy-first analytics integration to understand your user behavior without compromising their data.',
                  icon: CreditCard, // Using broad icon for now
                },
                {
                  name: 'Secure by Default',
                  description:
                    'CSRF protection, secure headers, and encrypted sessions. Security is not an afterthought.',
                  icon: Lock,
                },
                {
                  name: 'Lightning Fast',
                  description:
                    'Optimized for Core Web Vitals. Zero-layout shift, fast hydration, and minimal bundle sizes.',
                  icon: Zap,
                },
              ].map((feature) => (
                <div key={feature.name} className="relative pl-16 p-6 rounded-2xl border border-border/40 hover:border-foreground/20 hover:bg-muted/30 transition-all duration-300 md:hover:-translate-y-1">
                  <dt className="text-base font-semibold leading-7 text-foreground">
                    <div className="absolute left-6 top-6 flex h-10 w-10 items-center justify-center rounded-lg bg-foreground">
                      <feature.icon className="h-6 w-6 text-background" aria-hidden="true" />
                    </div>
                    {feature.name}
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-muted-foreground">{feature.description}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative isolate mt-32 px-6 py-32 sm:mt-56 sm:py-40 lg:px-8">
          {/* Gradient Background */}
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.indigo.100),white)] opacity-20 dark:bg-[radial-gradient(45rem_50rem_at_top,theme(colors.indigo.900),theme(colors.slate.900))]" />
          <div className="absolute inset-y-0 right-1/2 -z-10 mr-16 w-[200%] origin-bottom-left skew-x-[-30deg] bg-background shadow-xl shadow-indigo-600/10 ring-1 ring-indigo-50 sm:mr-28 lg:mr-0 xl:mr-16 xl:origin-center dark:bg-background dark:ring-indigo-900/20" />

          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-gradient">
              Ready to transform your development workflow?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
              Join thousands of developers building the next generation of web applications with ScaleKit.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/register"
                className="rounded-full bg-foreground px-8 py-3.5 text-sm font-semibold text-background shadow-sm hover:bg-foreground/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all hover:scale-105"
              >
                Get started today
              </Link>
              <Link href="/docs/intro" className="text-sm font-semibold leading-6 text-foreground hover:underline underline-offset-4">
                Read the docs <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/40 py-12 md:py-16 bg-muted/20">
        <div className="container mx-auto px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center space-x-2">
            <Box className="w-6 h-6 text-foreground" />
            <span className="font-bold text-lg">ScaleKit</span>
          </div>
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © 2024 ScaleKit Inc. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-muted-foreground hover:text-foreground">Twitter</Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground">GitHub</Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground">Discord</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
