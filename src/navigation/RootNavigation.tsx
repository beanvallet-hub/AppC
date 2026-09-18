import { SvgGradientView } from "@/components/SvgGradientView";
import { useLanguage } from "@/i18n/useLanguage";
import { AnimationScreen } from "@/screens/AnimationScreen";
import { GradientShowScreen } from "@/screens/GradientShowScreen";
import { HomeScreen } from "@/screens/HomeScreen";
import { NativeGradientScreen } from "@/screens/NativeGradientScreen";
import { QRCodeScreen } from "@/screens/QRCodeScreen";
import { QRScannerScreen } from "@/screens/QRScannerScreen";
import { TaskDetailScreen } from "@/screens/TaskDetailScreen";
import { TasksScreen } from "@/screens/TasksScreen";
import { TokensScreen } from "@/screens/TokensScreen";
import { useAppTheme } from "@/theme";
import { createNativeBottomTabNavigator } from "@react-navigation/bottom-tabs/unstable";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View } from "react-native";

const RootStack = createNativeStackNavigator();

export function RootNavigation() {
  const theme = useAppTheme();

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
                colors={theme.gradients.primary.colors}
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


const Tab = createNativeBottomTabNavigator();


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
            source: require('@assets/tabIcons/home.png'),
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
            source: require('@assets/tabIcons/explore.png'),
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
            source: require('@assets/tabIcons/token.png'),
          },
        }}
      />
    </Tab.Navigator>
  );
}
