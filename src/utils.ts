import startCase from 'lodash/startCase';
import { useEffect, useState } from 'react';
import { MAX_WAIT, USE_MOCKS } from './conf';
import responseBergfreunde from './mocks/mock-bergfreunde.html?raw';
import responseEpicTv from './mocks/mock-epictv.html?raw';
import responseOliunid from './mocks/mock-oliunid.html?raw';
import responseVirsotne from './mocks/mock-virsotne.json';

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

/**
 * https://corsproxy.io/
 */
export function withCorsProxy(url: string) {
  return 'https://corsproxy.io/?' + encodeURIComponent(url);
}

export function htmlToElement(html: string) {
  const template = document.createElement('template');
  html = html.trim();
  template.innerHTML = html;
  return template.content;
}

export const ANY_SIZE = 'any';

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
