import { PrimaryButton } from '@/components/buttons';
import { Input } from '@/components/inputs';
import { getAuth } from '@react-native-firebase/auth';
import React, { useState } from "react";
import { useTranslation } from 'react-i18next';
import { Alert, Image, KeyboardAvoidingView, Text, View } from "react-native";

export default function Index() {

  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = getAuth()

  const recoverPassword = async () => {
    setLoading(true)
    try {
      await auth.sendPasswordResetEmail(email);
      Alert.alert(t("checkYourEmail"), t("emailSentForPasswordRecovery"));
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
    setLoading(false)
  }

  return (
    <View className="flex-1 p-10">
      <View className="flex-1 grow-[1] justify-end pb-4">
        <Image
          source={require('@/assets/images/recover-password.png')} 
          resizeMode='contain'
          className="h-36 w-full"
        />
      </View>
      <KeyboardAvoidingView className="items-center w-full">
        <Text className='text-4xl mb-4 font-semibold text-primaryTextOverLight text-center'>{t("passwordRecovery")}</Text>
        <Input className='mb-4 w-full' value={email} onChangeText={setEmail} keyboardType="email-address" placeholder={t("email")} />
      </KeyboardAvoidingView>
      <View className="flex-1 grow-[1]">
        <PrimaryButton
          className={`${loading ? 'opacity-50' : 'opacity-100'}`}
          onPress={recoverPassword}
          disabled={loading}
          text={loading ? t("sendingEmail") : t("sendEmail")}
        />
      </View>
    </View>
  )
}