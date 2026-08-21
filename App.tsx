import './src/i18n';

import { TasksScreen } from './src/screens/TasksScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { ActivityIndicator, StatusBar, useColorScheme, View } from 'react-native';
import {
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import { createNativeBottomTabNavigator } from '@react-navigation/bottom-tabs/unstable';
import { useEffect, useState } from 'react';
import { initializeApp } from './src/initialize';
import TokensScreen from './src/screens/TokensScreen';
import { useLanguage } from './src/i18n/useLanguage';
import { NavigationContainer } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

const Tab = createNativeBottomTabNavigator();

export function TabNavigator() {
  const { translation } = useLanguage();

  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Homee"
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
          }
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
          }
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
      .catch((error) => {
        console.error('Failed to initialize app:', error);
      });
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
      <TabNavigator />

      <Toast />
    </NavigationContainer>
  );
}

export default App;
