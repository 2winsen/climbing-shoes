import { priceWithCurrencyToNumber, startCaseLowerCase } from './utils';

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
