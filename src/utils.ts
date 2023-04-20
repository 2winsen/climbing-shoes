import responseVirsotne from './mocks/mock-virsotne.json';
import responseOliunid from './mocks/mock-oliunid.html?raw';
import responseEpicTv from './mocks/mock-epictv.html?raw';
import startCase from 'lodash-es/startCase';
import { useEffect, useState } from 'react';
import { USE_MOCKS } from './conf';

export function fetchMock(url: string): Promise<Response> {
  let response: any;
  let timeout = 500;
  if (url.includes('virsotne')) {
    response = responseVirsotne;
    timeout = 500;
  } else if (url.includes('oliunid')) {
    response = responseOliunid;
    // timeout = 1000;
  } else {
    response = responseEpicTv;
    // timeout = 1500;
  }
  return new Promise((res, _) => {
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
  }, [condition]);
  return ready;
}

export function fetchWrapper(url: string) {
  if (USE_MOCKS) {
    return fetchMock(url);
  }
  return fetch(url);
}

/**
 * https://corsproxy.io/
 */
export function withCorsProxy(url: string) {
  return 'https://corsproxy.io/?' + encodeURIComponent(url);
}

export function htmlToElement(html: string) {
  var template = document.createElement('template');
  html = html.trim();
  template.innerHTML = html;
  return template.content;
}

export const ANY_SIZE = 'any';
