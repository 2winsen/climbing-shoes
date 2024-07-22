import startCase from 'lodash/startCase';
import { useEffect, useState } from 'react';
import { CORS_PROXY_URL, MAX_WAIT, USE_MOCKS } from './conf';
import responseBergfreunde from './mocks/mock-bergfreunde.html?raw';
import responseEpicTv from './mocks/mock-epictv.html?raw';
import responseOliunid from './mocks/mock-oliunid.html?raw';
import responseVirsotne from './mocks/mock-virsotne.json';
import { SearchParams } from './types';

export function fetchMock(url: string): Promise<Response> {
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  let response: any;
  let timeout = 500;
  if (url.includes('virsotne')) {
    response = responseVirsotne;
    timeout = 500;
  } else if (url.includes('oliunid')) {
    response = responseOliunid;
    timeout = 1000;
  } else if (url.includes('epictv')) {
    response = responseEpicTv;
  } else if (url.includes('bergfreunde')) {
    response = responseBergfreunde;
  }
  return new Promise((res) => {
    setTimeout(() => {
      res({
        json: () => response,
        text: () => response,
      } as unknown as Response);
    }, timeout);
  });
}

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
  if (USE_MOCKS) {
    return fetchMock(url);
  }
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), (MAX_WAIT + 3) * 1000);
  return fetch(url, { signal: controller.signal }).then((r) => {
    clearTimeout(timeoutId);
    return r;
  });
}

export function withProxy(url: string) {
  // Local testing
  // return 'https://corsproxy.io/?' + encodeURIComponent(url);
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
