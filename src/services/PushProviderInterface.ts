export abstract class PushProviderInterface {
  abstract readonly name: string;

  abstract isAvailable(): Promise<boolean>

  abstract initialize(): Promise<void> 

  abstract getToken(): Promise<string | null>

  abstract registerToken(): Promise<void>

  abstract subscribeToTokenRefresh(): Promise<any>

  abstract subscribeToForegroundMessages(): Promise<any>

  abstract displayNotification(message: any): Promise<void>
}
