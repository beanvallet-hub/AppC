export function snakeToCamel(str: string): string {
  return str.replace(/([-_][a-z])/gi, group =>
    group.toUpperCase().replace('-', '').replace('_', ''),
  );
}









export function objectKeysToCamelCase<T extends Record<string, any>>(
  obj: T,
): Record<string, any> {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    acc[snakeToCamel(key)] = value;
    return acc;
  }, {} as Record<string, any>);
}







export function objectArrayToCamelCase<T>(rows: Record<string, any>[]): T[] {
  return rows.map(objectKeysToCamelCase) as T[];
}








export const debounce = <T extends (...args: any[]) => void>(
  callback: T,
  delay: number
) => {
  let timer: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    clearTimeout(timer);

    timer = setTimeout(() => {
      callback(...args);
    }, delay);
  };
};
