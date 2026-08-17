export function snakeToCamel(str: string): string {
  return str.replace(/([-_][a-z])/gi, (group) =>
    group.toUpperCase().replace("-", "").replace("_", "")
  );
}

export function objectKeysToCamel<T extends Record<string, any>>(
  obj: T
): Record<string, any> {
  return Object.entries(obj).reduce(
    (acc, [key, value]) => {
      acc[snakeToCamel(key)] = value;
      return acc;
    },
    {} as Record<string, any>
  );
}

export function rowsToCamelCase<T>(
  rows: Record<string, any>[]
): T[] {
  return rows.map(objectKeysToCamel) as T[];
}


export function dbRecToJsObj(
  obj: Record<string, unknown>, booleanColumns: Set<string>
): Record<string, unknown> {
  return Object.entries(obj).reduce(
    (result, [key, value]) => {
      const camelKey = snakeToCamel(key);

      if (booleanColumns.has(key)) {
        result[camelKey] = value === 1;
      } else {
        result[camelKey] = value;
      }

      return result;
    },
    {} as Record<string, unknown>
  );
}

export function rowsToJsRecords<T>(
  rows: Record<string, any>[], booleanColumns: Set<string>
): T[] {
  return rows.map((row) => dbRecToJsObj(row, booleanColumns)) as T[];
}
