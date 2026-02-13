import { getAllDocs } from "@/lib/mdx";

console.log("Testing MDX Reader...");
try {
    const docs = getAllDocs();
    console.log("Found docs:", docs.length);
    docs.forEach((doc) => {
        console.log(`- [${doc.slug}]: ${doc.metadata.title}`);
    });
    console.log("MDX Reader Test Passed ✅");
} catch (error) {
    console.error("MDX Reader Test Failed ❌", error);
    process.exit(1);
}
