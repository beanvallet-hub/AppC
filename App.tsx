import './src/i18n';

import { TasksScreen } from './src/screens/TasksScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import {
  ActivityIndicator,
  StatusBar,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createNativeBottomTabNavigator } from '@react-navigation/bottom-tabs/unstable';
import { useEffect, useState } from 'react';
import { initializeApp } from './src/initialize';
import TokensScreen from './src/screens/TokensScreen';
import { useLanguage } from './src/i18n/useLanguage';
import { NavigationContainer } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TaskDetailScreen } from './src/screens/TaskDetailScreen';
import { fcmService } from './src/services/fcmService';
import { getMessaging } from '@react-native-firebase/messaging';

getMessaging().setBackgroundMessageHandler(async remoteMessage => {
  fcmService.handleNotificationDisplay(remoteMessage);
});

const Tab = createNativeBottomTabNavigator();

const RootStack = createNativeStackNavigator();

function RootStackNavigator() {
  return (
    <RootStack.Navigator>
      <RootStack.Screen
        name="MainTabs"
        component={TabNavigator}
        options={{ headerShown: false }}
      />

      <RootStack.Screen name="Task" component={TaskDetailScreen} />
    </RootStack.Navigator>
  );
}

export function TabNavigator() {
  const { translation } = useLanguage();

  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: translation('navigation.home'),
          tabBarIcon: {
            type: 'image',
            source: require('./assets/tabIcons/home.png'),
          },
        }}
      />

      <Tab.Screen
        name="Tasks"
        component={TasksScreen}
        options={{
          title: translation('navigation.tasks'),
          tabBarIcon: {
            type: 'image',
            source: require('./assets/tabIcons/explore.png'),
          },
        }}
      />

      <Tab.Screen
        name="Tokens"
        component={TokensScreen}
        options={{
          title: translation('navigation.settings'),
          tabBarIcon: {
            type: 'image',
            source: require('./assets/tabIcons/token.png'),
          },
        }}
      />
    </Tab.Navigator>
  );
}

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    initializeApp()
      .then(() => setReady(true))
      .catch(error => {
        console.error('Failed to initialize app:', error);
      });

    const unsubscribeOnMessage = fcmService.subscribeToForegroundMessages();
    const unsubscribeOnTokenRefresh = fcmService.subscribeToTokenRefresh();

    return () => {
      unsubscribeOnMessage();
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
    <NavigationContainer>
      <RootStackNavigator />

      <Toast />
    </NavigationContainer>
  );
}

export default App;
