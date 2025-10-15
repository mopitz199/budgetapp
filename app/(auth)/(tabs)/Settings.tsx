import { SecondaryButton } from "@/components/buttons";
import { CustomSafeAreaView } from "@/components/customMainView";
import { useUserSettingContext } from "@/contexts/UserAuthenticatedContext";
import { useState } from "react";
import { Text, View } from "react-native";
import { Icon, useTheme } from "react-native-paper";

export default function Settings() {

  const { colors } = useTheme() as any;
  const userSettings = useUserSettingContext();
  
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);

  return (
    <CustomSafeAreaView className="flex-1 p-4">
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