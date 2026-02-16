"use client"

import { useTheme } from "next-themes"
import { Moon, Sun, Monitor } from "lucide-react"
import { useEffect, useState } from "react"

export function ModeToggle() {
    const { setTheme, theme } = useTheme()
    const [mounted, setMounted] = useState(false)

    // Avoid hydration mismatch
    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    return (
        <div className="flex items-center space-x-1 border rounded-md p-1 bg-muted/50 w-fit">
            <button
                type="button"
                onClick={() => setTheme("light")}
                className={`p-2 rounded-sm transition-all focus:outline-none focus:ring-2 focus:ring-ring ${theme === 'light' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                aria-label="Light Mode"
                title="Light"
            >
                <Sun className="h-4 w-4" />
            </button>
            <button
                type="button"
                onClick={() => setTheme("dark")}
                className={`p-2 rounded-sm transition-all focus:outline-none focus:ring-2 focus:ring-ring ${theme === 'dark' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                aria-label="Dark Mode"
                title="Dark"
            >
                <Moon className="h-4 w-4" />
            </button>
            <button
                type="button"
                onClick={() => setTheme("system")}
                className={`p-2 rounded-sm transition-all focus:outline-none focus:ring-2 focus:ring-ring ${theme === 'system' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                aria-label="System Mode"
                title="System"
            >
                <Monitor className="h-4 w-4" />
            </button>
        </div>
    )
}
