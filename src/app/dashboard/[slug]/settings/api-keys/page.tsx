"use client";

import { useEffect, useState } from "react";
import { Loader2, Plus, Copy, Trash, Key, X, Check, ShieldCheck } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

interface ApiKey {
    id: string;
    name: string;
    keyPrefix: string;
    lastUsedAt: string | null;
    createdAt: string;
}

export default function ApiKeysPage({ params }: { params: { slug: string } }) {
    const [keys, setKeys] = useState<ApiKey[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [slug, setSlug] = useState("");

    // New Key Dialog
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [newKeyName, setNewKeyName] = useState("");
    const [createdKey, setCreatedKey] = useState<string | null>(null);
    const [hasCopied, setHasCopied] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            const resolved = await params;
            setSlug(resolved.slug);
            fetchKeys(resolved.slug);
        };
        loadData();
    }, [params]);

    async function fetchKeys(wsSlug: string) {
        try {
            const res = await fetch(`/api/workspaces/${wsSlug}/api-keys`);
            if (res.ok) {
                const data = await res.json();
                setKeys(data.keys);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    async function handleCreate(e: React.FormEvent) {
        e.preventDefault();
        try {
            const res = await fetch(`/api/workspaces/${slug}/api-keys`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: newKeyName })
            });
            if (res.ok) {
                const data = await res.json();
                setCreatedKey(data.apiKey);
                setNewKeyName("");
                fetchKeys(slug);
            }
        } catch (error) {
            console.error(error);
        }
    }

    async function handleRevoke(id: string) {
        if (!confirm("Are you sure you want to revoke this key? Any application using it will lose access immediately.")) return;
        try {
            const res = await fetch(`/api/workspaces/${slug}/api-keys?id=${id}`, {
                method: "DELETE",
            });
            if (res.ok) {
                fetchKeys(slug);
            }
        } catch (error) {
            console.error(error);
        }
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setHasCopied(true);
        setTimeout(() => setHasCopied(false), 2000);
    }

    if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-muted-foreground" /></div>;

    return (
        <div className="space-y-8 max-w-4xl">
            <div className="flex items-center justify-between border-b pb-6">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">API Keys</h2>
                    <p className="text-muted-foreground mt-1">Manage programmable access to your workspace securely.</p>
                </div>
                <button
                    onClick={() => setIsCreateOpen(true)}
                    className="inline-flex h-10 items-center justify-center rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-black/80 transition-all shadow-sm active:scale-95"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Create New Key
                </button>
            </div>

            {/* List */}
            <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
                <div className="p-4 border-b bg-muted/20 font-medium text-sm flex justify-between items-center text-muted-foreground">
                    <span>Active Keys ({keys.length})</span>
                    <ShieldCheck className="h-4 w-4" />
                </div>
                <div className="divide-y">
                    {keys.length === 0 ? (
                        <div className="p-12 text-center flex flex-col items-center justify-center text-muted-foreground space-y-3">
                            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                                <Key className="h-6 w-6 opacity-50" />
                            </div>
                            <p>No API keys found. Create one to authenticate programmatic requests.</p>
                        </div>
                    ) : (
                        keys.map((key) => (
                            <div key={key.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 hover:bg-muted/5 transition-colors gap-4">
                                <div>
                                    <div className="font-semibold text-base flex items-center gap-2 text-foreground">
                                        {key.name}
                                    </div>
                                    <div className="flex items-center gap-2 mt-2">
                                        <code className="text-xs font-mono bg-muted/50 px-2 py-0.5 rounded border text-muted-foreground">
                                            {key.keyPrefix}••••••••
                                        </code>
                                    </div>
                                    <div className="text-xs text-muted-foreground mt-2 flex items-center gap-2">
                                        <span>Created {formatDistanceToNow(new Date(key.createdAt), { addSuffix: true })}</span>
                                        <span className="text-muted-foreground/30">•</span>
                                        <span className={key.lastUsedAt ? "text-green-600" : ""}>
                                            {key.lastUsedAt ? `Last used ${formatDistanceToNow(new Date(key.lastUsedAt), { addSuffix: true })}` : 'Never used'}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleRevoke(key.id)}
                                    className="self-start sm:self-center text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors border border-red-100 hover:border-red-200"
                                >
                                    Revoke Access
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Create Dialog (Modal replacement) */}
            <AnimatePresence>
                {isCreateOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-background border rounded-xl shadow-2xl w-full max-w-lg p-0 overflow-hidden"
                        >
                            <div className="p-6 border-b flex items-center justify-between bg-muted/10">
                                <h3 className="text-xl font-bold">Create API Key</h3>
                                <button onClick={() => { setIsCreateOpen(false); setCreatedKey(null); }} className="text-muted-foreground hover:text-foreground p-1 hover:bg-muted rounded-full transition-colors">
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="p-6">
                                {!createdKey ? (
                                    <form onSubmit={handleCreate} className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Descriptive Name</label>
                                            <input
                                                autoFocus
                                                className="flex h-11 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                                placeholder="e.g. Production Server, CI/CD Pipeline"
                                                value={newKeyName}
                                                onChange={(e) => setNewKeyName(e.target.value)}
                                                required
                                            />
                                            <p className="text-[13px] text-muted-foreground">Give your key a name to easily identify its usage later.</p>
                                        </div>
                                        <div className="flex justify-end gap-3 pt-2">
                                            <button
                                                type="button"
                                                onClick={() => setIsCreateOpen(false)}
                                                className="h-10 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className="h-10 px-6 py-2 bg-black text-white rounded-lg text-sm font-bold hover:bg-black/80 transition-all shadow-md active:scale-95"
                                            >
                                                Create Key
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="space-y-6">
                                        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-lg text-sm flex gap-3 items-start">
                                            <Check className="h-5 w-5 text-emerald-600 mt-0.5" />
                                            <div>
                                                <p className="font-semibold text-emerald-900">API Key Created Successfully</p>
                                                <p className="opacity-90 mt-1">Please copy this key immediately. For security, it will not be shown again.</p>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Your API Key</label>
                                            <div className="relative group">
                                                <div className="font-mono text-sm w-full bg-slate-900 text-slate-50 p-4 pr-12 rounded-lg border shadow-inner break-all">
                                                    {createdKey}
                                                </div>
                                                <button
                                                    onClick={() => copyToClipboard(createdKey)}
                                                    className="absolute right-2 top-2 p-2 hover:bg-slate-700 text-slate-400 hover:text-white rounded-md transition-colors"
                                                    title="Copy to clipboard"
                                                >
                                                    {hasCopied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                                                </button>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => { setIsCreateOpen(false); setCreatedKey(null); }}
                                            className="w-full h-11 bg-black text-white rounded-lg text-sm font-bold hover:bg-black/90 transition-all shadow-lg"
                                        >
                                            I have copied the key
                                        </button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
