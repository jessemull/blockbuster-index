/**
 * Splits an array into a specified number of columns/chunks
 * @param arr - The array to split
 * @param columns - The number of columns to split into
 * @returns Array of arrays, each representing a column
 */
export function chunkColumns<T>(arr: T[], columns: number): T[][] {
  const len = arr.length;
  const base = Math.ceil(len / columns);
  const result: T[][] = [];
  let start = 0;
  for (let i = 0; i < columns; i++) {
    const end = i === columns - 1 ? len : start + base;
    result.push(arr.slice(start, end));
    start = end;
  }
  return result;
}
