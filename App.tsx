import {TasksScreen} from './src/screens/TasksScreen';
import {HomeScreen} from './src/screens/HomeScreen';
import { createStaticNavigation } from '@react-navigation/native';
import { ActivityIndicator, StatusBar, useColorScheme, View } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { createNativeBottomTabNavigator, createNativeBottomTabScreen } from '@react-navigation/bottom-tabs/unstable';
import { useEffect, useState } from 'react';
import { initializeApp } from './src/initialize';
import TokensScreen from './src/screens/TokensScreen';


const TabStack = createNativeBottomTabNavigator({
  screens: {
    Home: createNativeBottomTabScreen({
      screen: HomeScreen,
      options: {
        tabBarIcon: {
          type: 'image',
          source: require('./assets/tabIcons/home.png'),
        }
      }
    }),
    Tasks: createNativeBottomTabScreen({
      screen: TasksScreen,
      options: {
        tabBarIcon: {
          type: 'image',
          source: require('./assets/tabIcons/explore.png'),
        }
      }
    }),
    Tokens: createNativeBottomTabScreen({
      screen: TokensScreen,
      options: {
        tabBarIcon: {
          type: 'image',
          source: require('./assets/tabIcons/token.png'),
        }
      }
    }),
  },
});

const Navigation = createStaticNavigation(TabStack);


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
  const safeAreaInsets = useSafeAreaInsets();
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
    <Navigation />
  );
}

export default App;
