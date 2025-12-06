// @ts-nocheck
'use client';

import React, { useId } from 'react';
import { Loader2 } from 'lucide-react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useTranslation } from 'react-i18next';

import { ConsentStatus } from './ConsentProvider';

export interface ConsentDialogProps {
  open: boolean;
  status: ConsentStatus;
  loading?: boolean;
  wasRevoked?: boolean;
  onAccept: () => void;
  onDecline: () => void;
}

export function ConsentDialog({ open, status, loading = false, wasRevoked = false, onAccept, onDecline }: ConsentDialogProps) {
  const { t } = useTranslation('consent');
  const descriptionId = useId();

  const showRevokedNotice = wasRevoked || status === 'revoked';

  return (
    <AlertDialog open={open}>
      <AlertDialogContent aria-describedby={descriptionId} className="max-w-lg focus-visible:ring-0">
        <AlertDialogHeader>
          <AlertDialogTitle>{t('title')}</AlertDialogTitle>
          <AlertDialogDescription id={descriptionId} className="space-y-2 text-left">
            <p>{t('body')}</p>
            <p>
              <a
                href="/legal/privacy"
                target="_blank"
                rel="noreferrer"
                className="text-primary underline underline-offset-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {t('more', { defaultValue: 'En savoir plus' })}
              </a>
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>

        {showRevokedNotice ? (
          <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive">
            {t('revoked')}
          </div>
        ) : null}

        <AlertDialogFooter className="sm:justify-between">
          <AlertDialogCancel
            onClick={(event) => {
              event.preventDefault();
              if (loading) {
                return;
              }
              onDecline();
            }}
            disabled={loading}
          >
            {t('decline')}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(event) => {
              event.preventDefault();
              if (loading) {
                return;
              }
              onAccept();
            }}
            disabled={loading}
            className="min-w-[8rem]"
          >
            {loading ? <Loader2 aria-hidden className="mr-2 h-4 w-4 animate-spin" /> : null}
            {t('accept')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default ConsentDialog;

