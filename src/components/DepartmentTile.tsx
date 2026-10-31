import { Link } from 'wouter';
import { catalogHref, parseHex, type CatalogCategory } from '@/core';
import { useI18n } from '@/i18n';
import { StoreImage } from './StoreImage';

// Tab colours, only for categories the store left without a valid colour.
const ROTATION = ['#E8641E', '#1F4E8C', '#59626B', '#2E7D4F'];

/** A department as a drawer label: a coloured tab, its photo on drafting paper, its name and count. */
export function DepartmentTile({ category, count, index }: { category: CatalogCategory; count: number; index: number }) {
  const { plural } = useI18n();
  const color = (parseHex(category.backgroundColor) ? category.backgroundColor : null) ?? ROTATION[index % ROTATION.length];
  return (
    <Link
      href={catalogHref({ category: category.key })}
      className="group flex h-full flex-col overflow-hidden rounded-frame bg-surface-raised shadow-soft ring-1 ring-[color:var(--rule)] transition-[box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:shadow-lift"
    >
      <span aria-hidden="true" className="block h-1.5 shrink-0" style={{ background: color }} />
      <span className="paper-grid relative block aspect-[4/3] overflow-hidden bg-surface-quiet">
        <StoreImage
          src={category.imageUrl}
          alt=""
          sizes="(min-width: 1024px) 14rem, 45vw"
          maxWidth={560}
          fallback={<span className="grid h-full w-full place-items-center font-display text-4xl text-heading">{category.name.slice(0, 1)}</span>}
        />
      </span>
      <span className="flex flex-1 items-start justify-between gap-3 px-4 py-3.5">
        <span className="min-w-0">
          <span className="block break-words font-display text-base leading-tight text-heading [font-stretch:108%] hyphens-auto group-hover:underline sm:text-lg">{category.name}</span>
          <span className="mt-0.5 block text-sm text-ink-soft">{plural('category.count', count)}</span>
        </span>
      </span>
    </Link>
  );
}
