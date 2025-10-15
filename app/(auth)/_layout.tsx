import { CurrencyRatioContext } from "@/contexts/CurrencyRatioContext";
import { TransactionCategoriesContext } from "@/contexts/TransactionCategoryContext";
import { UserAuthenticatedContext } from "@/contexts/UserAuthenticatedContext";
import { Categories } from "@/types";
import { errorLogger, initAuthenticatedLogs } from "@/utils";
import { getAuth } from "@react-native-firebase/auth";
import { collection, doc, getDoc, getDocs, getFirestore } from '@react-native-firebase/firestore';
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { Alert } from "react-native";

const Layout = () => {
  const { t } = useTranslation();
  const auth = getAuth()


  const [userSettings, setUserSettings] = useState<any | null>(null);
  const [currencyRatio, setCurrencyRatio] = useState<Record<string, number> | null>(null);
  const [transactionCategories, setTransactionCategories] = useState<Categories | null>(null);

  const fetchUserSettings = async () => {
    const user = auth.currentUser;
    if(!user){
      errorLogger("User not authenticated", "User is not logged in");
      Alert.alert(t("error"), t('userNotAuthenticated'));
    }else {
      const db = getFirestore();
      const docRef = doc(db, "user_settings", user.uid);
      const docSnap = await getDoc(docRef); 

      if(docSnap.exists()){
        const userSettings = docSnap.data();
        return userSettings;        
      }else{
        errorLogger("User settings not found", "User settings document does not exist");
        Alert.alert(t("error"), t('userSettingsNotFound'));
      }
    }
  }

  const fetchCurrencyRatio = async () => {
    const db = getFirestore();
    const collectionRef = collection(db, "currency_conversion");
    const docSnap = await getDocs(collectionRef);

    let conversionMap: Record<string, number> = {};

    docSnap.forEach((doc: any) => {
      conversionMap[`${doc.id}`] = doc.data().value;
    });
    return conversionMap;
  }

  const setCategories = async () => {
    const db = getFirestore();
    let categories: Categories = {};
    const categoriesRef = doc(db, "categories", "cP2dsMNnTfqK8EeG9Ai6");
    const categoriesSnap = await getDoc(categoriesRef);
    if(categoriesSnap.exists()){
      const categoriesData = categoriesSnap.data();
      categories = categoriesData as Categories;
    }
    return categories;
  }

  const setAuthenticatedContext = async () => {
    const userSettings = await fetchUserSettings();
    setUserSettings(userSettings);

    const currencyRatio = await fetchCurrencyRatio();
    setCurrencyRatio(currencyRatio);

    const transactionCategories = await setCategories();
    setTransactionCategories(transactionCategories);
  }

  useEffect(() => {
    setAuthenticatedContext();
    initAuthenticatedLogs(auth.currentUser);
  }, []);


  if (! userSettings || ! currencyRatio || ! transactionCategories) {
    return null; // or a loading spinner, etc.
  }

  return (
    <UserAuthenticatedContext.Provider value={{ userSettings, setUserSettings }}>
      <TransactionCategoriesContext.Provider value={{ transactionCategories, setTransactionCategories }}>
        <CurrencyRatioContext.Provider value={{ currencyRatio, setCurrencyRatio }}>
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
        </CurrencyRatioContext.Provider>
      </TransactionCategoriesContext.Provider>
    </UserAuthenticatedContext.Provider>
  )
}
export default Layout;
