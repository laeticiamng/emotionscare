import { useTranslation } from 'react-i18next';
import ErrorView from '@/components/error/ErrorView';
import { Button } from '@/components/ui/button';
import { useRouter } from '@/hooks/router';

export default function Error401Page() {
  const { t } = useTranslation(['errors', 'common', 'auth']);
  const { navigate, back } = useRouter();

  return (
    <div data-testid="page-root">
      <ErrorView
        type="401"
        actions={(
          <div className="flex w-full flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button variant="outline" onClick={back}>
              {t('common:back')}
            </Button>
            <Button onClick={() => navigate('/login')}>
              {t('auth:loginButton')}
            </Button>
          </div>
        )}
      />
    </div>
  );
}
