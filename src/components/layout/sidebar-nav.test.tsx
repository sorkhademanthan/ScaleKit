import { render, screen } from '@testing-library/react';
import { DocsSidebarNav } from './sidebar-nav';
import { describe, it, expect } from 'vitest';

describe('DocsSidebarNav', () => {
    const mockItems = [
        {
            title: 'Getting Started',
            items: [
                {
                    title: 'Introduction',
                    href: '/docs/intro',
                },
            ],
        },
        {
            title: 'Auth Module',
            items: [
                {
                    title: 'Overview',
                    // No href
                },
            ],
        },
    ];

    it('renders sidebar navigation items correctly', () => {
        render(<DocsSidebarNav items={mockItems} pathname="/docs/intro" />);

        // Check for category titles
        expect(screen.getByText('Getting Started')).toBeInTheDocument();
        expect(screen.getByText('Auth Module')).toBeInTheDocument();

        // Check for link item
        const linkItem = screen.getByText('Introduction');
        expect(linkItem).toBeInTheDocument();
        expect(linkItem.closest('a')).toHaveAttribute('href', '/docs/intro');

        // Check for non-link item
        const nonLinkItem = screen.getByText('Overview');
        expect(nonLinkItem).toBeInTheDocument();
        expect(nonLinkItem.tagName).toBe('SPAN');
        expect(nonLinkItem.closest('a')).toBeNull();
    });

    it('renders empty when no items provided', () => {
        const { container } = render(<DocsSidebarNav items={[]} pathname="/docs/intro" />);
        expect(container).toBeEmptyDOMElement();
    });
});
