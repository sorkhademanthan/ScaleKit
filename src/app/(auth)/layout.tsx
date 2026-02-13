export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/50 p-4">
            <div className="w-full max-w-md space-y-8 bg-background p-8 rounded-xl shadow-lg border">
                {children}
            </div>
        </div>
    )
}
