import { getDocBySlug, getAllDocs, getTableOfContents } from "@/lib/mdx";
import { MDXRemote } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";
import { MDXComponents } from "@/components/mdx/components";
import { TableOfContents } from "@/components/layout/toc";
import rehypeSlug from "rehype-slug";

interface PageProps {
    params: Promise<{
        slug: string[];
    }>;
}

export async function generateStaticParams() {
    const docs = getAllDocs();

    return docs.map((doc) => ({
        slug: doc.slug.split("/"),
    }));
}

export default async function DocPage({ params }: PageProps) {
    const { slug } = await params;
    const slugPath = slug.join("/");

    try {
        const doc = getDocBySlug(slugPath);
        const toc = getTableOfContents(doc.content);

        return (
            <main className="relative py-6 lg:gap-10 lg:py-8 xl:grid xl:grid-cols-[1fr_300px]">
                <div className="mx-auto w-full min-w-0">
                    <div className="mb-4 flex items-center space-x-1 text-sm text-neutral-500">
                        <div className="truncate">Docs</div>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-4 w-4"
                        >
                            <path d="m9 18 6-6-6-6" />
                        </svg>
                        <div className="font-medium text-neutral-900">
                            {doc.metadata.title}
                        </div>
                    </div>

                    <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
                        {doc.metadata.title}
                    </h1>

                    <p className="text-xl text-neutral-500 mb-10">
                        {doc.metadata.description}
                    </p>

                    <div className="pb-12 pt-8 border-t border-neutral-200">
                        <MDXRemote
                            source={doc.content}
                            components={MDXComponents}
                            options={{
                                mdxOptions: {
                                    rehypePlugins: [rehypeSlug],
                                },
                            }}
                        />
                    </div>
                </div>

                <div className="hidden text-sm xl:block">
                    <div className="sticky top-16 -mt-10 h-[calc(100vh-3.5rem)] overflow-hidden pt-6">
                        <TableOfContents toc={toc} />
                    </div>
                </div>
            </main>
        );
    } catch (error) {
        notFound();
    }
}
