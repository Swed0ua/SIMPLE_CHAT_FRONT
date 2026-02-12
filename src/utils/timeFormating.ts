import {
  format,
  isToday,
  isYesterday,
  differenceInDays,
  Locale,
} from 'date-fns';
import { TFunction } from 'i18next';
import { enUS, uk } from 'date-fns/locale';
import i18n, { languageResources } from '../locales/i18n';

type SupportedLanguage = keyof typeof languageResources;
const dateFnsLocales: Record<SupportedLanguage, Locale> = {
  en: enUS,
  uk,
};

function getDateLocale(): Locale | undefined {
  const lang = (i18n.language ?? 'en').split('-')[0];
  return dateFnsLocales[lang as SupportedLanguage] ?? dateFnsLocales.en;
}

export function formatChatTime(
  isoString: string | null | undefined,
  t: TFunction | null = null,
): string {
  if (!isoString) return '';
  const date = new Date(isoString);
  const locale = getDateLocale();
  if (isNaN(date.getTime())) return '';

  if (isToday(date)) {
    return format(date, 'HH:mm', { locale });
  }
  if (isYesterday(date)) {
    return t ? t('time.yesterday') : 'Yesterday';
  }
  if (differenceInDays(new Date(), date) < 7) {
    return format(date, 'EEE', { locale });
  }
  return format(date, 'dd.MM.yy', { locale });
}
