import type { ReactNode } from 'react';

// En-tête coloré avec ellipses décoratives — motif récurrent du design

interface Props {
  color: string;
  children: ReactNode;
  padding?: string;
}

export function Hero({ color, children, padding = '22px 22px 24px 22px' }: Props) {
  return (
    <div data-tone="sec" style={{ position: 'relative', overflow: 'hidden', background: color, color: '#fff', padding }}>
      <svg
        data-blob
        viewBox="0 0 400 160"
        preserveAspectRatio="none"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.08 }}
        aria-hidden="true"
      >
        <ellipse cx="360" cy="10" rx="150" ry="100" fill="#FFFFFF" />
      </svg>
      <div style={{ position: 'relative' }}>{children}</div>
    </div>
  );
}
