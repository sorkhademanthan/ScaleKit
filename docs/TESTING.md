# Testing Documentation

This project uses **Vitest** and **React Testing Library** for unit and component testing.

## Running Tests

To run the test suite, use the following command:

```bash
npm test
```

This will run all tests in the project (`.test.ts` or `.test.tsx` files).

## Type Checking

To verify TypeScript types across the project, run:

```bash
npm run type-check
```

## Adding New Tests

1.  **Component Tests**: Create a file named `Component.test.tsx` next to your component.
    ```tsx
    import { render, screen } from '@testing-library/react';
    import { Component } from './Component';

    describe('Component', () => {
        it('renders correctly', () => {
            render(<Component />);
            expect(screen.getByText('Expected Text')).toBeInTheDocument();
        });
    });
    ```

2.  **Unit Tests**: Create a file named `utility.test.ts` next to your utility file.
    ```ts
    import { utility } from './utility';

    describe('utility', () => {
        it('returns expected value', () => {
            expect(utility()).toBe(true);
        });
    });
    ```

## Environment Setup

The testing environment is configured in `vitest.config.ts` and `vitest.setup.ts`.
It uses `jsdom` to simulate a browser environment for React components.
