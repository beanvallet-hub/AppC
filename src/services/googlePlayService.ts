import { getUtils } from '@react-native-firebase/app';


export async function checkPlayServicesAvailability() {
  const { status, isAvailable, hasResolution, isUserResolvableError } =
    await getUtils().getPlayServicesStatus();

  if (isAvailable) {
    // console.log('Play service available ****');

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

  // console.log('Google Play Services unavailable; an alternate push provider may be used.');
  return false;
}
