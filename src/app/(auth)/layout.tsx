import Link from "next/link";
import { Box } from "lucide-react";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen flex-row">
            {/* Left Side - Hero / Testimonials */}
            <div className="hidden w-1/2 bg-foreground text-background lg:flex flex-col justify-between p-12">
                <Link href="/" className="flex items-center space-x-2">
                    <Box className="w-8 h-8" />
                    <span className="text-xl font-bold tracking-tight">ScaleKit</span>
                </Link>

                <div className="space-y-6">
                    <blockquote className="space-y-4">
                        <p className="text-2xl font-serif italic font-medium leading-relaxed">
                            "This library changed the way we build. The authentication and design system saved us months of work. Highly recommended for any serious startup."
                        </p>
                        <footer className="text-sm font-medium">
                            <div className="font-semibold text-lg not-italic">Sofia Davis</div>
                            <div className="text-muted-foreground not-italic opacity-80">CTO at Acme Corp</div>
                        </footer>
                    </blockquote>
                </div>

                <div className="flex gap-4 opacity-50 text-sm">
                    <span>© 2024 ScaleKit Inc</span>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex w-full flex-col justify-center px-8 lg:w-1/2 lg:px-12 bg-background">
                <div className="mx-auto w-full max-w-sm space-y-8 animate-fade-in">
                    {children}
                </div>
            </div>
        </div>
    )
}
