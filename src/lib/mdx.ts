import fs from "fs";
import path from "path";
import matter from "gray-matter";

const CONTENT_PATH = path.join(process.cwd(), "content/docs");

export interface DocMetadata {
    title: string;
    description: string;
    category?: string;
    slug: string;
}

export function getDocSlugs() {
    const getAllFiles = (dirPath: string, arrayOfFiles: string[] = []) => {
        const files = fs.readdirSync(dirPath);

        files.forEach((file) => {
            if (fs.statSync(dirPath + "/" + file).isDirectory()) {
                arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
            } else {
                if (file.endsWith(".mdx")) {
                    // Remove the base CONTENT_PATH and the file extension to get the slug
                    const relativePath = path.join(dirPath, file).replace(CONTENT_PATH, "");
                    // Remove leading slash if present and extension
                    const slug = relativePath.replace(/^\//, "").replace(/\.mdx$/, "");
                    arrayOfFiles.push(slug);
                }
            }
        });

        return arrayOfFiles;
    };

    return getAllFiles(CONTENT_PATH);
}

export function getDocBySlug(slug: string) {
    const realSlug = slug.replace(/\.mdx$/, "");
    const filePath = path.join(CONTENT_PATH, `${realSlug}.mdx`);

    if (!fs.existsSync(filePath)) {
        throw new Error(`Doc not found: ${filePath}`);
    }

    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(fileContents);

    return {
        slug: realSlug,
        metadata: data as DocMetadata,
        content,
    };
}

export function getTableOfContents(content: string) {
    const headings: { id: string; title: string; level: number }[] = [];
    const regex = /^(#{2,3})\s+(.*)$/gm;
    let match;

    while ((match = regex.exec(content)) !== null) {
        const level = match[1].length;
        const title = match[2];
        const id = title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-") // simple slugify
            .replace(/(^-|-$)+/g, "");

        headings.push({ id, title, level });
    }

    return headings;
}

export function getAllDocs() {
    const slugs = getDocSlugs();
    const docs = slugs.map((slug) => getDocBySlug(slug));
    return docs;
}
