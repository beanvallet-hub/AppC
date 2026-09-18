import * as Keychain from 'react-native-keychain';

export async function setSecureItem(
  key: string,
  value: string,
): Promise<void> {
  await Keychain.setGenericPassword(
    key,
    value,
    {
      service: `appc.${key}`,
    },
  );
}

export async function getSecureItem(
  key: string,
): Promise<string | null> {
  const credentials = await Keychain.getGenericPassword({
    service: `appc.${key}`,
  });

  return credentials ? credentials.password : null;
}

export async function removeSecureItem(key: string): Promise<void> {
  await Keychain.resetGenericPassword({
    service: `appc.${key}`,
  });
}
