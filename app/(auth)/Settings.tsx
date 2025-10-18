import { PrimaryButton, SecondaryButton } from "@/components/buttons";
import { CurrencyPickerModal } from "@/components/currencyPickerModal";
import { CustomMainView } from "@/components/customMainView";
import { useCurrencyRatioContext } from "@/contexts/CurrencyRatioContext";
import { useUserAuthenticatedContext } from "@/contexts/UserAuthenticatedContext";
import { currencyConvertor } from "@/currencyUtils";
import { headerSettings } from "@/utils";
import Ionicons from "@expo/vector-icons/build/Ionicons";
import { getAuth } from "@react-native-firebase/auth";
import { collection, doc, getDocs, getFirestore, setDoc } from "@react-native-firebase/firestore";
import { router, useNavigation } from "expo-router";
import { useLayoutEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Text, useColorScheme, View } from "react-native";
import { useTheme } from "react-native-paper";

export default function Settings() {

  const auth = getAuth()
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const { t } = useTranslation();
  const { colors } = useTheme() as any;
  const { userSettings, setUserSettings } = useUserAuthenticatedContext();
  const { currencyRatio } = useCurrencyRatioContext();

  const [loading, setLoading] = useState(false);
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  const [defaultCurrency, setDefaultCurrency] = useState(userSettings.defaultCurrency);

  useLayoutEffect(() => headerSettings(
      navigation,
      colorScheme,
      t("settings"),
      false,
    ), [navigation, colorScheme]
  );

  const setAllTransactions = async () => {

    const db = getFirestore();
    const user = auth.currentUser;
    if(!user) {
      Alert.alert(t("error"), "User not authenticated");
      return
    }
    const transactionsRef = collection(db, 'user_transactions', user.uid, 'transactions');
    const transactionsSnap = await getDocs(transactionsRef);

    transactionsSnap.forEach((transactionDoc: any) => {
      let transactionData = transactionDoc.data();
      transactionData.amount = currencyConvertor(
        transactionData.amount,
        transactionData.currency,
        defaultCurrency,
        currencyRatio
      );
      transactionData.currency = defaultCurrency;

      transactionDoc.ref.set(transactionData);
    });
  }

  const setDefaultSettingCurrency = async () => {    
    const newSettings = {...userSettings, defaultCurrency: defaultCurrency}
    const db = getFirestore();
    const user = auth.currentUser;
    if(!user) {
      Alert.alert(t("error"), "User not authenticated");
      return
    }

    const settingsCollection = collection(db, 'user_settings')
    const settingsRef = doc(settingsCollection, user.uid);
    await setDoc(settingsRef, newSettings);
    setUserSettings(newSettings);
  }

  return (
    <CustomMainView className="p-8 pb-14" loading={loading}>
      <CurrencyPickerModal
        showCurrencyModal={showCurrencyModal}
        setShowCurrencyModal={setShowCurrencyModal}
        colors={colors}
        currencyValue={defaultCurrency}
        onCurrencyChange={async (oldCurrencyValue: string, newCurrencyValue: string) => {
          setDefaultCurrency(newCurrencyValue);
        }}
      />

      <View className="flex-1 mt-8">
        <Text className=" dark:text-darkMode-onSurface text-darkMode-onSurface">{t("defaultCurrency")}</Text>
        <SecondaryButton
          className="mt-4"
          text={defaultCurrency}
          onPress={() => setShowCurrencyModal(true)}
          rightIcon={
            <View className='absolute right-0'>
              <Ionicons
                name="caret-down-outline"
                color={colors.onSurface}
                size={25}
              />
            </View>
          }
        />
        <View className="flex-1 justify-end">
          <PrimaryButton className='mt-4' text={t("save")} onPress={() => {
            Alert.alert(t('important'), t('changingDefaultCurrencyWarning'), [
              {text: t('cancel'), style: 'cancel'},
              {text: t('save'), onPress: () => {
                setLoading(true);
                setAllTransactions()
                setDefaultSettingCurrency()
                setLoading(false);
                router.push('/(auth)/(tabs)/Home');
              }},
            ]);
          }} />
        </View>
      </View>
    </CustomMainView>
  );
}