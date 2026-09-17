import './src/i18n';

import { TasksScreen } from './src/screens/TasksScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import {
  ActivityIndicator,
  Platform,
  StatusBar,
  useColorScheme,
  View,
} from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { createNativeBottomTabNavigator } from '@react-navigation/bottom-tabs/unstable';
import { useEffect, useState } from 'react';
import { initializeApp } from './src/initialize';
import { TokensScreen } from './src/screens/TokensScreen';
import { useLanguage } from './src/i18n/useLanguage';
import { NavigationContainer } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TaskDetailScreen } from './src/screens/TaskDetailScreen';
import { pushService } from './src/services/PushService';
import { QRCodeScreen } from './src/screens/QRCodeScreen';
import { QRScannerScreen } from './src/screens/QRScannerScreen';
import { NavigationDrawer } from './src/components/NavigationDrawer';
import { GradientShowScreen } from './src/screens/GradientShowScreen';
import { SvgGradientView } from './src/components/SvgGradientView';
import { gradients } from './src/theme/gradients';
import { NativeGradientScreen } from './src/screens/NativeGradientScreen';
import { AnimationView } from './src/components/AnimationView';
import { AnimationScreen } from './src/screens/AnimationScreen';

pushService.initialize();

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

      <RootStack.Screen name="QR Generator" component={QRCodeScreen} />

      <RootStack.Screen name="QR Scanner" component={QRScannerScreen} />

      <RootStack.Screen name="Animations" component={AnimationScreen} />

      <RootStack.Screen
        name="Gradient Showcase"
        component={GradientShowScreen}
        options={{
          headerBackground: () => {
            return (
              <SvgGradientView
                colors={gradients.primary.colors}
                style={{ flex: 1 }}
                direction="bottomToTop"
              />
            );
          },
          headerTintColor: 'white',
        }}
      />
      <RootStack.Screen
        name="Native Gradient"
        component={NativeGradientScreen}
        options={{
          headerBackground: () => {
            return (
              <View
                style={{
                  flex: 1,
                  backgroundImage:
                    'radial-gradient(ellipse farthest-corner at 30% 40%, red, blue)',
                }}
              />
            );
          },
          headerTintColor: 'white',
        }}
      />
    </RootStack.Navigator>
  );
}

function TabNavigator() {
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
  const [drawerVisible, setDrawerVisible] = useState(false);

  const safeAreaInsets = useSafeAreaInsets();

  const contentPlatformStyle = Platform.select({
    android: {
      paddingTop: safeAreaInsets.top,
      paddingLeft: safeAreaInsets.left,
      paddingRight: safeAreaInsets.right,
      paddingBottom: 0,
    },
    web: {
      paddingTop: 24,
      paddingBottom: 16,
    },
  });

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
        <AnimationView />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <NavigationDrawer>
        <RootStackNavigator />
      </NavigationDrawer>

      <Toast />
    </NavigationContainer>
  );
}

export default App;
