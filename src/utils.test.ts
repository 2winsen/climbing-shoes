import { CORS_PROXY_URL } from './conf';
import { parseSearchQueryParam, priceWithCurrencyToNumber, startCaseLowerCase, withProxy } from './utils';

describe('priceWithCurrencyToNumber', () => {
  test('format', () => {
    expect(priceWithCurrencyToNumber('€134.96')).toBe(134.96);
  });

  test('format with comma', () => {
    expect(priceWithCurrencyToNumber('€ 134,96')).toBe(134.96);
  });

  test('format null', () => {
    expect(priceWithCurrencyToNumber(null)).toBe(undefined);
    expect(priceWithCurrencyToNumber(undefined)).toBe(undefined);
  });

  test('format empty', () => {
    expect(priceWithCurrencyToNumber('')).toBe(NaN);
  });

  test('format with word from', () => {
    expect(priceWithCurrencyToNumber('from € 109,95')).toBe(109.95);
  });
});

describe('startCaseLowerCase', () => {
  test('default', () => {
    expect(startCaseLowerCase('la sportiva')).toBe('La Sportiva');
  });

  test('with trim', () => {
    expect(startCaseLowerCase(' la sportiva  ')).toBe('La Sportiva');
  });

  test('with multiline trim', () => {
    expect(startCaseLowerCase('   \nla Sportiva   \n   ')).toBe('La Sportiva');
  });

  test('with uppercase', () => {
    expect(startCaseLowerCase('LA sporTIVA')).toBe('La Sportiva');
  });
});

describe('parseSearchQueryParam', () => {
  test('empty', () => {
    expect(parseSearchQueryParam('')).toEqual({});
  });

  test('size', () => {
    expect(parseSearchQueryParam('45')).toEqual({
      size: '45',
    });
  });

  test('size decimal', () => {
    expect(parseSearchQueryParam('45.1')).toEqual({
      size: '45.1',
    });
  });

  test('size decimal comma', () => {
    expect(parseSearchQueryParam('45,1')).toEqual({
      size: '45.1',
    });
  });

  test('model', () => {
    expect(parseSearchQueryParam('la sportiva')).toEqual({
      model: 'la sportiva',
    });
  });

  test('model and size', () => {
    expect(parseSearchQueryParam('miura 45')).toEqual({
      model: 'miura',
      size: '45',
    });
  });

  test('size and model', () => {
    expect(parseSearchQueryParam('44.5 miura')).toEqual({
      model: 'miura',
      size: '44.5',
    });
  });

  test('inconsistent spacing', () => {
    expect(parseSearchQueryParam(' miura   45  ')).toEqual({
      model: 'miura',
      size: '45',
    });
  });

  test('5-10 size', () => {
    expect(parseSearchQueryParam('5-10 45')).toEqual({
      model: '5-10',
      size: '45',
    });
  });

  test('size 5-10', () => {
    expect(parseSearchQueryParam('45 5-10')).toEqual({
      model: '5-10',
      size: '45',
    });
  });

  test('la sportiva', () => {
    expect(parseSearchQueryParam('la sportiva miura 45')).toEqual({
      model: 'la sportiva miura',
      size: '45',
    });
  });
});

describe('withProxy', () => {
  test('CORS_PROXY_URL', () => {
    expect(withProxy('https://foo.bar')).toBe(`${CORS_PROXY_URL}/https://foo.bar`);
  });
});
