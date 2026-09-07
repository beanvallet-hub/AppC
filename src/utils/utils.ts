import { getUtils } from '@react-native-firebase/app';

export function snakeToCamel(str: string): string {
  return str.replace(/([-_][a-z])/gi, group =>
    group.toUpperCase().replace('-', '').replace('_', ''),
  );
}

export function objectKeysToCamel<T extends Record<string, any>>(
  obj: T,
): Record<string, any> {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    acc[snakeToCamel(key)] = value;
    return acc;
  }, {} as Record<string, any>);
}

export function rowsToCamelCase<T>(rows: Record<string, any>[]): T[] {
  return rows.map(objectKeysToCamel) as T[];
}

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

export function rowsToJsRecords<T>(
  rows: Record<string, any>[],
  booleanColumns: Set<string>,
): T[] {
  return rows.map(row => dbRecToJsObj(row, booleanColumns)) as T[];
}

export async function checkPlayServicesAvailability() {
  const { status, isAvailable, hasResolution, isUserResolvableError } =
    await getUtils().getPlayServicesStatus();

  if (isAvailable) {
    console.log('Play service available ****');

    return true;
  }

  if (isUserResolvableError || hasResolution) {
    switch (status) {
      case 1: // SERVICE_MISSING
        try {
          await getUtils().makePlayServicesAvailable();
        } catch (error) {
          // v26 breaking change: this now REJECTS on cancel/failure
          // (previously it always resolved)
          console.log('Play Services update canceled or failed', error);
        }
        return false;
      case 2: // SERVICE_VERSION_UPDATE_REQUIRED
        await getUtils().resolutionForPlayServices();
        return false;
      default:
        if (isUserResolvableError) {
          await getUtils().promptForPlayServices();
        } else if (hasResolution) {
          await getUtils().resolutionForPlayServices();
        }
        return false;
    }
  }

  console.log('Google Play Services unavailable; an alternate push provider may be used.');
  return false;
}
