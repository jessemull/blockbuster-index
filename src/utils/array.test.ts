import { chunkColumns } from './array';

describe('chunkColumns', () => {
  it('splits evenly across columns', () => {
    const arr = [1, 2, 3, 4];
    expect(chunkColumns(arr, 2)).toEqual([
      [1, 2],
      [3, 4],
    ]);
  });

  it('distributes remainder to last column', () => {
    const arr = [1, 2, 3, 4, 5];
    expect(chunkColumns(arr, 2)).toEqual([
      [1, 2, 3],
      [4, 5],
    ]);
  });

  it('handles columns greater than length by emitting empties', () => {
    const arr = [1];
    expect(chunkColumns(arr, 3)).toEqual([[1], [], []]);
  });

  it('handles zero items', () => {
    expect(chunkColumns([], 3)).toEqual([[], [], []]);
  });
});
