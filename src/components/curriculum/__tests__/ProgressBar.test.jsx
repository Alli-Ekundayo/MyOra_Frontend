import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ProgressBar from '../ProgressBar';

describe('ProgressBar', () => {
    it('renders with 0% progress', () => {
        render(<ProgressBar progress={0} />);
        const bar = screen.getByRole('progressbar').firstChild;
        expect(bar).toHaveStyle({ width: '0%' });
    });

    it('renders with 50% progress', () => {
        render(<ProgressBar progress={50} />);
        const bar = screen.getByRole('progressbar').firstChild;
        expect(bar).toHaveStyle({ width: '50%' });
    });

    it('renders with 100% progress', () => {
        render(<ProgressBar progress={100} />);
        const bar = screen.getByRole('progressbar').firstChild;
        expect(bar).toHaveStyle({ width: '100%' });
    });

    it('caps progress at 100%', () => {
        render(<ProgressBar progress={120} />);
        const bar = screen.getByRole('progressbar').firstChild;
        expect(bar).toHaveStyle({ width: '100%' });
    });
});
