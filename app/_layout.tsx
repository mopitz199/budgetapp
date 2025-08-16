import { FirebaseAuthTypes, getAuth } from '@react-native-firebase/auth';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, View, useColorScheme } from "react-native";
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from "react-native-paper";
import "./global.css";

const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: "#0057FF",
    error: "#FF7A80",
    success: "#00C48C",
    divider: "#E5E7EB",
    linkTextOverLight: "#0066FF",
    background: "#F3F4F6",
    // Text colors
    onPrimary: "#FFFFFF", // color del texto en vista azul
    onSurface: "#1D2430", // color del texto en vistas claras
    onSurfaceVariant: "#5C677D", // Color del placeholder del input

    // View background colors
    surface: "#FFFFFF",
    surfaceVariant: "#FFFFFF", // Color de fondo del input
  },
};

const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: "#0057FF",
    error: "#FF7A80",
    success: "#00C48C",
    divider: "#E5E7EB",
    linkTextOverLight: "#0066FF",
    background: "#1D2430",
    // Text colors
    onPrimary: "#eeeeee", // color del texto en vista azul
    onSurface: "#eeeeee", // color del texto en vistas oscuras
    onSurfaceVariant: "#AAB3C2", // Color del placeholder del input

    // View background colors
    surface: "#2A3447",
    surfaceVariant: "#2A3447",
  },
};

export default function RootLayout() {

  const [fontsLoaded] = useFonts({
    Roboto: require('@/assets/fonts/Roboto-Regular.ttf'),
    Roboto_Bold: require('@/assets/fonts/Roboto-Bold.ttf'),
    Roboto_Light: require('@/assets/fonts/Roboto-Light.ttf'),
  });

  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>();

  const router = useRouter();
  const segments = useSegments();

  const onAuthStateChanged = (user: FirebaseAuthTypes.User | null) => {
    console.log('onAuthStateChanged', user);
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const auth = getAuth()
    const subscriber = auth.onAuthStateChanged(onAuthStateChanged);
    return subscriber
  }, [])

  useEffect(() => {
    if(initializing) return;

    const inAuthGroup = segments[0] === '(auth)'; 

    if (user && !inAuthGroup) {
      if(user.emailVerified){
        router.replace('/(auth)/(tabs)/Home');
      }else {
        router.replace('/(auth)/EmailVerification');
      }
    } else if (!user && inAuthGroup) {
      router.replace('/')
    }

  }, [user, initializing])

  if (initializing) {
    return (
      <View className="flex-1 justify-center items-center border-2 border-gray-500 rounded-sm">
        <ActivityIndicator size={'small'} className="text-3xl border-2 border-gray-500 rounded-sm mt-6"/>
      </View>
    )
  } else {
    return (
      <PaperProvider theme={isDark ? darkTheme : lightTheme}>
        <Stack>
          <Stack.Screen name='index' options={{headerShown: false, title: 'Login'}} />
          <Stack.Screen name='SignUp'/>
          <Stack.Screen name='PasswordRecovery' options={{title: t("passwordRecovery")}}/>
          <Stack.Screen name='(auth)' options={{headerShown: false}}/>
        </Stack>
      </PaperProvider>
    )
  }
}
