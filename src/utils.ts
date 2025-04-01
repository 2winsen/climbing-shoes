import startCase from 'lodash/startCase';
import { useEffect, useState } from 'react';
import { CORS_PROXY_URL, MAX_WAIT } from './conf';
import { SearchParams } from './types';

export function startCaseLowerCase(value: string) {
  return startCase(value.toLowerCase());
}

export function removeWww(value: string) {
  return value.match(/^www\.(.*)/)?.[1] ?? value;
}

export function knownManufacturers() {
  return [
    'Andrea Boldrini',
    'Black Diamond',
    'Boreal',
    'Butora',
    'EB',
    'Evolv',
    'Five Ten',
    'La Sportiva',
    'Ocun',
    'Red Chili',
    'Scarpa',
    'Tenaya',
    'Unparallel',
    'Wild Climb',
  ];
}

export function useTimeout(condition: boolean, timeout: number) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (condition) {
      setTimeout(() => setReady(true), timeout);
    }
  }, [condition, timeout]);
  return ready;
}

export function fetchWrapper(url: string) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), (MAX_WAIT + 3) * 1000);
  return fetch(url, { signal: controller.signal }).then((r) => {
    clearTimeout(timeoutId);
    return r;
  });
}

export function withProxy(url: string) {
  return `${CORS_PROXY_URL}/${url}`;
}

export function htmlToElement(html: string) {
  const template = document.createElement('template');
  html = html.trim();
  template.innerHTML = html;
  return template.content;
}

export const ANYTHING = 'any';

export function priceWithCurrencyToNumber(price: string | undefined | null) {
  if (price == null) {
    return undefined;
  }
  const withoutCurrency = String(price)
    .replaceAll(/[a-zA-Z ]/g, '')
    .replaceAll(',', '.')
    .trim()
    .slice(1);
  return parseFloat(withoutCurrency);
}

export function parseSearchQueryParam(searchQueryParam: string | null): SearchParams {
  const searchQuery = searchQueryParam === ANYTHING || searchQueryParam == null ? undefined : searchQueryParam.trim();
  const searchParams: SearchParams = {};
  if (searchQuery) {
    const searchQueryGeneric = searchQuery.replaceAll(',', '.');
    const numberPattern = '(\\d+(?:\\.\\d+)?)';
    const sizePattern = new RegExp(`^${numberPattern}\\s|\\s${numberPattern}$|^${numberPattern}$`, 'i');

    const sizeMatch = searchQueryGeneric.replaceAll(',', '.').match(sizePattern);
    const size = sizeMatch ? sizeMatch[0].trim() : undefined;
    const model = size ? searchQueryGeneric.replace(size, '').trim() : searchQueryGeneric;

    return {
      size,
      model: model || undefined,
    };
  }
  return searchParams;
}
