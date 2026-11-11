import * as Dialog from '@radix-ui/react-dialog';
import { Menu, Search, ShoppingCart, X, UserRound } from 'lucide-react';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Link, useLocation } from 'wouter';
import { catalogHref, useCart, useCartTotals, useIsDemo, useStore, useStoreName, useAccountLinks } from '@/core';
import { useI18n } from '@/i18n';
import { BASKET_EVENT } from './AddToCart';
import { ThemeToggle } from './ThemeToggle';

export const NAV = [
  { href: '/', key: 'nav.home' },
  { href: '/products', key: 'nav.catalog' },
  { href: '/about', key: 'nav.about' },
  { href: '/contact', key: 'nav.contact' },
] as const;

export function useIsActive() {
  const [location] = useLocation();
  return (href: string) => (href === '/' ? location === '/' : location === href || location.startsWith(`${href}/`));
}

/** The default mark when the store has no logo: a hex nut on blueprint blue. */
export function NutMark({ className = 'h-10 w-10' }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 40 40" className={className}>
      <rect width="40" height="40" rx="7" style={{ fill: 'var(--fe-blueprint)' }} />
      <path d="M20 7.5 30.8 13.75v12.5L20 32.5 9.2 26.25v-12.5Z" style={{ fill: 'var(--accent)' }} />
      <circle cx="20" cy="20" r="5.2" style={{ fill: 'var(--fe-blueprint)' }} />
    </svg>
  );
}

function StoreMark() {
  const { organization, theme } = useStore();
  const name = useStoreName();
  const logo = theme?.logoUrl ?? organization?.logoUrl ?? null;
  if (!name) return <span aria-hidden="true" className="skeleton block h-8 w-24 max-w-full" />;
  return (
    <span className="flex w-full min-w-0 items-center gap-2 sm:gap-2.5">
      {logo ? <img src={logo} alt="" className="h-8 w-8 shrink-0 rounded-[var(--radius-control)] object-cover sm:h-9 sm:w-9" /> : <NutMark className="h-8 w-8 shrink-0 sm:h-9 sm:w-9" />}
      <span className="min-w-0 flex-1 break-words font-display text-[0.9375rem] leading-tight [font-stretch:100%] [overflow-wrap:anywhere] sm:text-xl sm:[font-stretch:125%]">{name}</span>
    </span>
  );
}

/** Search first: the catalog's search, reachable from every page on wide screens. */
export function SearchForm({ id, tone = 'light', className = '' }: { id: string; tone?: 'light' | 'deep'; className?: string }) {
  const { t } = useI18n();
  const [, navigate] = useLocation();
  const [query, setQuery] = useState('');
  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    navigate(catalogHref({ q: query.trim() }));
  };
  return (
    <form role="search" onSubmit={onSubmit} className={`flex ${className}`}>
      <label htmlFor={id} className="sr-only">
        {t('catalog.search')}
      </label>
      <div className="relative min-w-0 flex-1">
        <Search aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
        <input
          id={id}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('catalog.search.placeholder')}
          className={`field !rounded-r-none pl-10 ${tone === 'deep' ? '!shadow-none' : ''}`}
        />
      </div>
      <button type="submit" className="btn btn-accent shrink-0 !rounded-l-none !px-4">
        {t('search.submit')}
      </button>
    </form>
  );
}

export function Header() {
  const { t, plural } = useI18n();
  const name = useStoreName();
  const isDemo = useIsDemo();
  const { count } = useCartTotals();
  const openCart = useCart((s) => s.open);
  const isActive = useIsActive();
  // Barter and the account live in the store's own menus, not in a bar of their own.
  const { barter, account } = useAccountLinks(t);
  const navLinks = [...NAV, barter];
  const menuLinks = [...navLinks, account];
  const [location] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const [adds, setAdds] = useState(0);

  useEffect(() => {
    const onAdded = () => setAdds((n) => n + 1);
    window.addEventListener(BASKET_EVENT, onAdded);
    return () => window.removeEventListener(BASKET_EVENT, onAdded);
  }, []);

  useEffect(() => setMenuOpen(false), [location]);

  return (
    <header ref={headerRef} className="relative z-30 border-b border-rule bg-surface-raised">
      {isDemo && <p className="blueprint px-4 py-1.5 text-center text-xs font-semibold text-ink-on-deep sm:text-sm">{t('demo.notice')}</p>}
      <div className="page flex min-h-14 items-center gap-1.5 py-1.5 sm:min-h-[4.5rem] sm:gap-2">
        <Link href="/" title={name || undefined} aria-label={name || undefined} className="flex min-h-tap min-w-0 flex-1 items-center rounded-[var(--radius-control)] pr-1 text-heading md:max-w-[15rem] md:flex-initial">
          <StoreMark />
        </Link>

        <SearchForm id="header-search" className="mx-2 hidden max-w-xl flex-1 md:flex" />

        <Link href="/products" aria-label={t('catalog.search')} title={t('catalog.search')} className="icon-btn shrink-0 text-heading hover:bg-surface-quiet md:hidden">
          <Search aria-hidden="true" className="h-5 w-5" />
        </Link>

        <Link href={account.href} aria-label={account.label} title={account.label} aria-current={isActive(account.href) ? 'page' : undefined} className="icon-btn hidden shrink-0 text-heading hover:bg-surface-quiet lg:inline-grid">
          <UserRound aria-hidden="true" className="h-5 w-5" />
        </Link>

        <ThemeToggle />

        <button id="store-cart-trigger" type="button" onClick={openCart} className="btn btn-strong shrink-0 !gap-1.5 !px-2 sm:!px-3">
          <ShoppingCart key={adds} aria-hidden="true" className={`h-5 w-5 ${adds ? 'basket-settle' : ''}`} />
          <span className="hidden sm:inline">{t('nav.cart')}</span>
          <span aria-hidden="true" className="grid h-6 min-w-6 place-items-center rounded-[var(--radius-control)] bg-[color:var(--fe-orange)] px-1.5 text-sm font-bold tabular-nums text-[color:var(--fe-ink)]">
            {count}
          </span>
          <span className="sr-only">{plural('nav.cart.count', count)}</span>
        </button>

        <Dialog.Root open={menuOpen} onOpenChange={setMenuOpen}>
          <Dialog.Trigger className="icon-btn shrink-0 text-heading hover:bg-surface-quiet lg:hidden" aria-label={t('nav.menu')}>
            <Menu aria-hidden="true" className="h-6 w-6" />
          </Dialog.Trigger>
          <Dialog.Portal container={headerRef.current}>
            <Dialog.Overlay className="overlay fixed inset-0 z-40 bg-[color:var(--scrim)]" />
            <Dialog.Content className="nav-menu fixed inset-x-0 top-0 z-50 max-h-dvh overflow-y-auto overscroll-contain rounded-b-[var(--radius-frame)] bg-surface-raised pb-[max(.75rem,env(safe-area-inset-bottom))] text-ink shadow-lift">
              <div aria-hidden="true" className="blueprint h-3 w-full" />
              <div className="px-4 pt-[env(safe-area-inset-top)]">
                <div className="flex items-center justify-between">
                  <Dialog.Title className="font-display text-xl text-heading">{t('nav.menu')}</Dialog.Title>
                  <Dialog.Description className="sr-only">{t('nav.primary')}</Dialog.Description>
                  <Dialog.Close className="icon-btn -mr-2 text-heading hover:bg-surface-quiet" aria-label={t('nav.close')}>
                    <X aria-hidden="true" className="h-6 w-6" />
                  </Dialog.Close>
                </div>
                <nav aria-label={t('nav.primary')} className="mt-1">
                  <ul className="flex flex-col divide-y divide-[color:var(--rule)]">
                    {menuLinks.map(({ href, key }) => (
                      <li key={href}>
                        <Link
                          href={href}
                          onClick={() => setMenuOpen(false)}
                          aria-current={isActive(href) ? 'page' : undefined}
                          className="flex min-h-tap items-center justify-between px-3 text-lg font-bold text-heading aria-[current=page]:text-accent-text"
                        >
                          {t(key)}
                          {isActive(href) && <span aria-hidden="true" className="h-3 w-3 bg-[color:var(--accent)] [clip-path:polygon(50%_0,100%_25%,100%_75%,50%_100%,0_75%,0_25%)]" />}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
      <nav aria-label={t('nav.primary')} className="hidden border-t border-rule lg:block">
        <ul className="page flex items-center gap-1">
          {navLinks.map(({ href, key }) => (
            <li key={href}>
              <Link
                href={href}
                aria-current={isActive(href) ? 'page' : undefined}
                className="nav-link flex min-h-tap items-center px-3 text-sm font-bold text-ink-soft transition-colors hover:text-heading aria-[current=page]:text-heading"
              >
                {t(key)}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
