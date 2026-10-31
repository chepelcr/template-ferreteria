import { ProductFallbackIcon } from './CmsIcon';

/** Identity placeholder: drafting paper with the store's fallback icon. */
export function Placeholder({ label, tone = 'light' }: { label?: string; tone?: 'light' | 'deep' }) {
  const deep = tone === 'deep';
  return (
    <div
      className={`flex h-full w-full items-center justify-center ${deep ? 'blueprint text-ink-on-deep-soft' : 'paper-grid bg-surface-quiet text-ink-soft'}`}
      role={label ? 'img' : undefined}
      aria-label={label}
    >
      <ProductFallbackIcon className="h-9 w-9" strokeWidth={1.5} />
    </div>
  );
}
