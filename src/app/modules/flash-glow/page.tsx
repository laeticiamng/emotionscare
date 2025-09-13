import { PageHeader, Button, ThemeToggle, FadeIn, SlideIn, SeoHead, t, useI18n } from "@/COMPONENTS.reg";

export default function FlashGlowPage() {
  const { lang, setLang } = useI18n();
  return (
    <main className="p-4 space-y-4">
      <SeoHead title="Flash Glow" description="Experience the glow" />
      <div className="flex gap-2">
        <ThemeToggle />
        <Button onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')}>
          {lang === 'fr' ? 'EN' : 'FR'}
        </Button>
      </div>
      <FadeIn>
        <PageHeader title="Flash Glow" subtitle="Experience the glow" />
      </FadeIn>
      <SlideIn>
        <p>Bienvenue dans le module Flash Glow.</p>
      </SlideIn>
      <SlideIn delay={100}>
        <Button>{t('start')}</Button>
      </SlideIn>
    </main>
  );
}
