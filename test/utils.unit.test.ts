import { zip } from '../src/scraper/utils';

describe('zip tests', () => {
  it('should zip same-size key and value arrays together', () => {
    const numbers = [1, 2, 3];
    const strings = ['a', 'b', 'c'];
    const mixed = [1, 'b', 3];
    const mixed2 = ['a', 2, 'c'];

    expect(zip(numbers, strings)).toStrictEqual({ 1: 'a', 2: 'b', 3: 'c' });
    expect(zip(strings, numbers)).toStrictEqual({ a: 1, b: 2, c: 3 });
    expect(zip(mixed, mixed)).toStrictEqual({ 1: 1, b: 'b', 3: 3 });
    expect(zip(mixed, mixed2)).toStrictEqual({ 1: 'a', b: 2, 3: 'c' });
  });

  it('should handle empty and null inputs', () => {
    expect(zip([], [1, 2, 3])).toStrictEqual({});
    expect(zip([1, 2, 3], [])).toStrictEqual({});
    expect(zip([1, 2, 3], null)).toStrictEqual({});
    expect(zip(null, [1, 2, 3])).toStrictEqual({});
  });

  it('should handle different sized inputs', () => {
    const short = [1, 2];
    const long = [3, 4, 5, 6];
    expect(zip(short, long)).toStrictEqual({ 1: 3, 2: 4 });
    expect(zip(long, short)).toStrictEqual({ 3: 1, 4: 2 });
  });
});
