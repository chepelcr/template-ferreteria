import { LayoutGrid, List } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useI18n } from '@/i18n';

export type CatalogView = 'list' | 'grid';

const KEY = 'tsuru:ferreteria:view';

/** The catalog's list/grid choice: list by default on wide screens, grid on phones; remembered per browser. */
export function useCatalogViewMode(): [CatalogView, (view: CatalogView) => void] {
  const [view, setView] = useState<CatalogView>(() => {
    try {
      const saved = window.localStorage.getItem(KEY);
      if (saved === 'list' || saved === 'grid') return saved;
    } catch {
      // Storage blocked: fall back to the screen-size default.
    }
    return typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches ? 'list' : 'grid';
  });
  useEffect(() => {
    try {
      window.localStorage.setItem(KEY, view);
    } catch {
      // Not remembered this time; the view still changes.
    }
  }, [view]);
  return [view, setView];
}

export function ViewToggle({ view, onChange }: { view: CatalogView; onChange: (view: CatalogView) => void }) {
  const { t } = useI18n();
  const options: Array<{ value: CatalogView; label: string; Icon: typeof List }> = [
    { value: 'list', label: t('catalog.view.list'), Icon: List },
    { value: 'grid', label: t('catalog.view.grid'), Icon: LayoutGrid },
  ];
  return (
    <div role="group" aria-label={t('catalog.view')} className="inline-flex rounded-[var(--radius-control)] bg-surface-raised p-1 shadow-[inset_0_0_0_1.5px_var(--rule)]">
      {options.map(({ value, label, Icon }) => (
        <button
          key={value}
          type="button"
          aria-pressed={view === value}
          title={label}
          onClick={() => onChange(value)}
          className="icon-btn text-ink-soft transition-colors hover:text-heading aria-pressed:bg-heading aria-pressed:text-surface"
        >
          <Icon aria-hidden="true" className="h-4 w-4" />
          <span className="sr-only">{label}</span>
        </button>
      ))}
    </div>
  );
}
