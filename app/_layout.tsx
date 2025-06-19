import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, View } from "react-native";

import "./global.css";

export default function RootLayout() {

  const { t } = useTranslation();
  
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
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber
  }, [])

  useEffect(() => {
    if(initializing) return;

    const inAuthGroup = segments[0] === '(auth)'; 

    if (user && !inAuthGroup) {
      if(user.emailVerified){
        router.replace('/(auth)/home');
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
        <Stack>
          <Stack.Screen name='index' options={{headerShown: false, title: 'Login'}} />
          <Stack.Screen name='SignUp' options={{title: t("signUp")}}/>
          <Stack.Screen name='(auth)' options={{headerShown: false}}/>
        </Stack>
    )
  }
}
