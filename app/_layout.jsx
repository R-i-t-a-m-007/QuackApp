import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';
import { StripeProvider } from '@stripe/stripe-react-native';
import usePushNotification from '@/hooks/usePushNotification'; // ✅ Fix import

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const { expoPushToken } = usePushNotification(); // ✅ Use hook

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <StripeProvider publishableKey="pk_test_51QMRNe02CrK5yqCqYqkToVNNtUNhxjGtg8vEQQgQGy8Ca8RRtVinaKSvoVXrtcEHI3grdIZqg2tr0EpmPG2UxqBc00l0TowYoM">
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      </StripeProvider>
    </ThemeProvider>
  );
}
