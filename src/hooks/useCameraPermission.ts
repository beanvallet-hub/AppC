import {useCallback, useEffect, useState} from 'react';
import {Platform} from 'react-native';
import {
  check,
  openSettings,
  PERMISSIONS,
  request,
  RESULTS,
  type PermissionStatus,
} from 'react-native-permissions';

const CAMERA_PERMISSION =
  Platform.OS === 'ios'
    ? PERMISSIONS.IOS.CAMERA
    : PERMISSIONS.ANDROID.CAMERA;

export const useCameraPermission = () => {
  const [status, setStatus] = useState<PermissionStatus>(RESULTS.DENIED);
  const [loading, setLoading] = useState(true);

  const checkPermission = useCallback(async () => {
    try {
      setLoading(true);

      const result = await check(CAMERA_PERMISSION);

      setStatus(result);

      return result;
    } finally {
      setLoading(false);
    }
  }, []);

  const requestPermission = useCallback(async () => {
    try {
      setLoading(true);

      const result = await request(CAMERA_PERMISSION);

      setStatus(result);

      return result;
    } finally {
      setLoading(false);
    }
  }, []);

  const openPermissionSettings = useCallback(async () => {
    await openSettings();
  }, []);

  useEffect(() => {
    checkPermission();
  }, [checkPermission]);

  return {
    status,

    loading,

    granted: status === RESULTS.GRANTED,

    denied: status === RESULTS.DENIED,

    blocked: status === RESULTS.BLOCKED,

    unavailable: status === RESULTS.UNAVAILABLE,

    checkPermission,

    requestPermission,

    openPermissionSettings,
  };
};
