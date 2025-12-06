// @ts-nocheck

import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

export const formatDate = (dateString: string | Date): string => {
  let dateToFormat: Date;
  
  if (typeof dateString === 'string') {
    dateToFormat = parseISO(dateString);
  } else {
    dateToFormat = dateString;
  }
  
  return format(dateToFormat, 'dd MMM yyyy', { locale: fr });
};

export const formatTime = (dateString: string | Date): string => {
  let dateToFormat: Date;
  
  if (typeof dateString === 'string') {
    dateToFormat = parseISO(dateString);
  } else {
    dateToFormat = dateString;
  }
  
  return format(dateToFormat, 'HH:mm', { locale: fr });
};

export const formatDateTime = (dateString: string | Date): string => {
  let dateToFormat: Date;
  
  if (typeof dateString === 'string') {
    dateToFormat = parseISO(dateString);
  } else {
    dateToFormat = dateString;
  }
  
  return format(dateToFormat, 'dd MMM yyyy à HH:mm', { locale: fr });
};
