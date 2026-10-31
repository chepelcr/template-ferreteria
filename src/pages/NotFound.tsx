import { Link } from 'wouter';
import { usePageMeta } from '@/core';
import { useI18n } from '@/i18n';
import { BoltDrawing } from '@/components/BoltDrawing';

export default function NotFound() {
  const { t } = useI18n();
  usePageMeta(t('notFound.title'));
  return (
    <div className="page grid items-center gap-12 pt-16 md:grid-cols-12">
      <div className="md:col-span-7">
        <h1 className="text-[clamp(2.4rem,6vw,4rem)] text-heading">{t('notFound.title')}</h1>
        <p className="mt-5 max-w-md text-lg text-ink-soft">{t('notFound.body')}</p>
        <Link href="/" className="btn btn-accent mt-8">
          {t('notFound.cta')}
        </Link>
      </div>
      <div className="paper-grid mx-auto w-[min(18rem,70vw)] rounded-frame text-[color:var(--drafting)] opacity-60 md:col-span-5">
        <BoltDrawing className="h-full w-full" />
      </div>
    </div>
  );
}
