export interface NavItem {
    title: string;
    href?: string;
    items?: NavItem[];
}

export type SidebarNav = NavItem[];

export const docsConfig: SidebarNav = [
    {
        title: "Getting Started",
        items: [
            {
                title: "Introduction",
                href: "/docs/intro",
            },
            {
                title: "Installation",
                href: "/docs/installation",
            },
        ],
    },
    {
        title: "Auth Module",
        items: [
            {
                title: "Overview",
                href: "/docs/auth/overview",
            },
            {
                title: "JWT Strategy",
                href: "/docs/auth/jwt",
            },
            {
                title: "RBAC Setup",
                href: "/docs/auth/rbac",
            },
        ],
    },
    {
        title: "Database",
        items: [
            {
                title: "Schema Design",
                href: "/docs/database/schema",
            },
            {
                title: "Curent Config",
                href: "/docs/database/config",
            },
        ],
    },
];
