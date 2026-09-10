
export type QRPayload = {
  type: string;
  id: number;
  version: number;
};

export const createQRPayload = (
  payload: string,
): string => {
//   return JSON.stringify(payload);
    return payload;
};

export const parseQRPayload = (
  value: string,
): string | null => {
  try {
    // return JSON.parse(value);
    return value;
  } catch {
    return null;
  }
};
