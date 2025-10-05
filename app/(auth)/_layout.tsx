import { UserAuthenticatedContext } from "@/contexts/UserAuthenticatedContext";
import { initAuthenticatedLogs } from "@/utils";
import { getAuth } from "@react-native-firebase/auth";
import { getCrashlytics } from "@react-native-firebase/crashlytics";
import { doc, getDoc, getFirestore } from '@react-native-firebase/firestore';
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { Alert } from "react-native";

const Layout = () => {
  const { t } = useTranslation();
  const auth = getAuth()


  const [userSettings, setUserSettings] = useState<any | null>(null);

  const getUserSettings = async () => {
    const user = auth.currentUser;

    if(!user){
      Alert.alert(t("error"), "User not authenticated");
      return
    }

    const db = getFirestore();
    const docRef = doc(db, "user_settings", user.uid);
    const docSnap = await getDoc(docRef); 

    if(docSnap.exists()){
      const userSettings = docSnap.data();
      console.log(userSettings)
      return userSettings;
    }else{
      Alert.alert(t("error"), "User settings not foundd");
      return
    }
  }

  useEffect(() => {
    let userSettings = getUserSettings()
    setUserSettings(userSettings)

    // Initialize Crashlytics with user info
    initAuthenticatedLogs(auth.currentUser, getCrashlytics());
  }, []);


  if (! userSettings) {
    return null; // or a loading spinner, etc.
  }

  return (
    <UserAuthenticatedContext.Provider value={userSettings}>
      <Stack>
        <Stack.Screen name='(tabs)' options={({ route }) => {
          const skip = (route.params as { skipAnimation?: string })?.skipAnimation;
          return {
            headerShown: false,
            title: 'Home',
            animation: skip === '1' ? 'none' : 'slide_from_right',
          }
        }} />
        {/*<Stack.Screen name='home' options={{headerShown: true, title: 'Home'}} />
        <Stack.Screen name='RealHome' options={{headerShown: false}} />*/}
        <Stack.Screen name='EmailVerification'/>
        <Stack.Screen name='SelectTransactionType' options={{animation: 'fade_from_bottom', headerShown: false}}/>
        <Stack.Screen name='TransactionsPreview'/>
        <Stack.Screen name='UploadFiles'/>
      </Stack>
    </UserAuthenticatedContext.Provider>
  )
}
export default Layout;
