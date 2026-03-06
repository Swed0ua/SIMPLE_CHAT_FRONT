import {
  format,
  isToday,
  isYesterday,
  differenceInDays,
  Locale,
  parseISO,
} from 'date-fns';
import { TFunction } from 'i18next';
import { enUS, uk } from 'date-fns/locale';
import i18n, { languageResources } from '../locales/i18n';
import { Message } from '../store/slices/messagesSlice';

type SupportedLanguage = keyof typeof languageResources;
const dateFnsLocales: Record<SupportedLanguage, Locale> = {
  en: enUS,
  uk,
};

export function getDateLocale(): Locale | undefined {
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

export function formatTimeShort(
  isoString: string | null | undefined,
  _t: TFunction | null = null,
): string {
  if (!isoString) return '';
  const date = new Date(isoString);
  const locale = getDateLocale();
  if (isNaN(date.getTime())) return '';
  return format(date, 'HH:mm', { locale });
}

export function getChatDaySeparatorLabel(
  dateKey: string,
  t: TFunction | null = null,
): string {
  const date = dateKey.length === 10 ? parseISO(dateKey) : new Date(dateKey);
  const locale = getDateLocale();
  if (isNaN(date.getTime())) return '';
  if (isToday(date)) return t ? t('time.today') : 'Today';
  if (isYesterday(date)) return t ? t('time.yesterday') : 'Yesterday';
  if (differenceInDays(new Date(), date) < 7) {
    const dayOfWeek = format(date, 'EEEE', { locale });
    return `${dayOfWeek} ${format(date, 'dd', { locale })}`;
  }
  return format(date, 'dd.MM.yyyy', { locale });
}

export function getDayKey(isoDate: string): string {
  const d = new Date(isoDate);
  return format(d, 'yyyy-MM-dd');
}

export function getDayDividerIndices(messages: Message[]): number[] {
  const indices: number[] = [];
  let displayIndex = 0;
  for (let i = 0; i < messages.length; i++) {
    if (
      i > 0 &&
      getDayKey(messages[i].createdAt) !== getDayKey(messages[i - 1].createdAt)
    ) {
      indices.push(displayIndex);
      displayIndex += 1;
    }
    displayIndex += 1;
  }
  return indices;
}
