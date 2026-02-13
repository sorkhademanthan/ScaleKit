import { describe, it, expect, vi } from 'vitest';
import { getDocSlugs, getDocBySlug } from './mdx';
import fs from 'fs';
import path from 'path';

vi.mock('fs', () => ({
    readdirSync: vi.fn(),
    statSync: vi.fn(),
    existsSync: vi.fn(),
    readFileSync: vi.fn(),
    default: {
        readdirSync: vi.fn(),
        statSync: vi.fn(),
        existsSync: vi.fn(),
        readFileSync: vi.fn(),
    },
}));

vi.mock('path', async (importOriginal) => {
    const actual = await importOriginal<typeof import('path')>();
    return {
        ...actual,
        default: {
            ...actual,
            join: (...args: string[]) => args.join('/'),
        },
    };
});

describe('MDX Lib', () => {
    describe('getDocSlugs', () => {
        it('should return slugs for .mdx files inside content/docs', () => {
            // Mock fs.readdirSync and fs.statSync
            (vi.mocked(fs.readdirSync) as any).mockImplementation((dirPath: any) => {
                if (String(dirPath).endsWith('content/docs')) {
                    return ['intro.mdx' as unknown as fs.Dirent, 'auth' as unknown as fs.Dirent];
                }
                if (String(dirPath).endsWith('auth')) {
                    return [];
                }
                return [];
            });

            vi.mocked(fs.statSync).mockImplementation((filePath) => {
                if (String(filePath).endsWith('auth')) {
                    return { isDirectory: () => true } as fs.Stats;
                }
                return { isDirectory: () => false } as fs.Stats;
            });

            // Mock process.cwd
            vi.spyOn(process, 'cwd').mockReturnValue('/mock/cwd');

            const slugs = getDocSlugs();
            expect(slugs).toContain('intro');
        });
    });
});
