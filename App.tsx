import '@/i18n';

import {
  ActivityIndicator,
  StatusBar,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import { initializeApp } from '@/initialize';
import { NavigationContainer } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { pushService } from '@/services/PushService';
import { NavigationDrawer } from '@/navigation/NavigationDrawer';
import { useAppTheme, ThemeProvider } from '@/theme';
import { RootNavigation } from '@/navigation/RootNavigation';

pushService.initialize();


export default function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

        <AppContent />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

function AppContent() {
  const [ready, setReady] = useState(false);
  const theme = useAppTheme();

  const navigationTheme: ReactNavigation.Theme = {
    dark: theme.mode === 'dark',

    colors: {
      primary: theme.colors.primary,
      background: theme.colors.background,
      card: theme.colors.surface,
      text: theme.colors.text.primary,
      border: theme.colors.border.default,
      notification: theme.colors.error,
    },

    fonts: {
      regular: {
        fontFamily: theme.typography.fontFamily.regular,
        fontWeight: theme.typography.fontWeight.regular,
      },
      medium: {
        fontFamily: theme.typography.fontFamily.medium,
        fontWeight: theme.typography.fontWeight.medium,
      },
      bold: {
        fontFamily: theme.typography.fontFamily.semiBold,
        fontWeight: theme.typography.fontWeight.semiBold,
      },
      heavy: {
        fontFamily: theme.typography.fontFamily.bold,
        fontWeight: theme.typography.fontWeight.bold,
      },
    },
  };

  useEffect(() => {
    initializeApp()
      .then(() => setReady(true))
      .catch(error => {
        console.error('Failed to initialize app:', error);
      });

    const unsubscribeOnMessage = pushService.subscribeToForegroundMessages();
    const unsubscribeOnTokenRefresh = pushService.subscribeToTokenRefresh();

    return () => {
      if (unsubscribeOnMessage && typeof unsubscribeOnMessage === 'function')
        unsubscribeOnMessage();
      if (
        unsubscribeOnTokenRefresh &&
        typeof unsubscribeOnTokenRefresh === 'function'
      )
        unsubscribeOnTokenRefresh();
    };
  }, []);

  if (!ready) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <NavigationContainer theme={navigationTheme}>
      <NavigationDrawer>
        <RootNavigation />
      </NavigationDrawer>

      <Toast />
    </NavigationContainer>
  );
}
