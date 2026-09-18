import { snakeToCamel } from "@/utils/utils";


export function dbRecToJsObj(
  obj: Record<string, unknown>,
  booleanColumns: Set<string>,
): Record<string, unknown> {
  return Object.entries(obj).reduce((result, [key, value]) => {
    const camelKey = snakeToCamel(key);

    if (booleanColumns.has(key)) {
      result[camelKey] = value === 1;
    } else {
      result[camelKey] = value;
    }

    return result;
  }, {} as Record<string, unknown>);
}






export function dbRecordsToJsObjects<T>(
  rows: Record<string, any>[],
  booleanColumns: Set<string>,
): T[] {
  return rows.map(row => dbRecToJsObj(row, booleanColumns)) as T[];
}
