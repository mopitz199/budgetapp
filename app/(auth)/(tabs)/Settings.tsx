import { SecondaryButton } from "@/components/buttons";
import { CurrencyPickerModal } from "@/components/currencyPickerModal";
import { CustomSafeAreaView } from "@/components/customMainView";
import { useUserAuthenticatedContext } from "@/contexts/UserAuthenticatedContext";
import { getAuth } from "@react-native-firebase/auth";
import { collection, doc, getFirestore, setDoc } from "@react-native-firebase/firestore";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Text, View } from "react-native";
import { Icon, useTheme } from "react-native-paper";

export default function Settings() {

  const auth = getAuth()
  const { t, i18n } = useTranslation();
  const { colors } = useTheme() as any;
  const { userSettings, setUserSettings } = useUserAuthenticatedContext();

  const [showCurrencyModal, setShowCurrencyModal] = useState(false);

  return (
    <CustomSafeAreaView className="flex-1 p-4">
      <CurrencyPickerModal
        showCurrencyModal={showCurrencyModal}
        setShowCurrencyModal={setShowCurrencyModal}
        colors={colors}
        currencyValue={userSettings.defaultCurrency}
        onCurrencyChange={async (oldCurrencyValue: string, newCurrencyValue: string) => {

          const newSettings = {...userSettings, defaultCurrency: newCurrencyValue}

          const db = getFirestore();
          const user = auth.currentUser;
          if(!user) {
            Alert.alert(t("error"), "User not authenticated");
            return
          }

          const settingsCollection = collection(db, 'user_settings')
          const settingsRef = doc(settingsCollection, user.uid);
          await setDoc(settingsRef, newSettings);

          console.log("New currency selected:", newCurrencyValue);
          setUserSettings(newSettings);
        }}
      />


      <Text className="text-2xl font-bold">Settings</Text>
      <View className="mt-8">
        <Text className=" dark:text-darkMode-onSurface text-darkMode-onSurface">Base Currency</Text>
        <SecondaryButton
          className="mt-4"
          text={userSettings.defaultCurrency}
          // disabled={loading}
          onPress={() => setShowCurrencyModal(true)}
          rightIcon={
            <View className='absolute right-0'>
              <Icon
                source="arrow-down-drop-circle"
                color={colors.primary}
                size={25}
              />
            </View>
          }
        />
      </View>
    </CustomSafeAreaView>
  );
}