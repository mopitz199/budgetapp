import { PrimaryButton, SecondaryButton } from '@/components/buttons';
import { CustomMainView } from '@/components/customMainView';
import { headerSettings } from '@/utils';
import { getAuth } from '@react-native-firebase/auth';
import { useNavigation, useRouter } from "expo-router";
import { useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Image,
  Pressable,
  Text,
  useColorScheme,
  View
} from "react-native";

export default function EmailVerification() {

  const navigation = useNavigation();
  const colorScheme = useColorScheme(); // 👉 'light' o 'dark'
  const { t } = useTranslation();
  const router = useRouter();
  const auth = getAuth()

  useLayoutEffect(() => headerSettings(
      navigation,
      colorScheme,
      t("verifyYourEmail"),
      false,
    ), [navigation, colorScheme]
  );

  const resend = () => {
    const user = auth.currentUser;
    user?.sendEmailVerification()
    alert(t("emailSent"))
  }

  const signOut = () => {
    auth.signOut()
  }

  const retry = async () => {
    const user = auth.currentUser;
    if(user){
      await user.reload();
      if(user.emailVerified){
        router.replace('/(auth)/(tabs)/Home');
      }else{
        alert(t("notVerifiedCheckEmail"))
      }
    }
  }

  return (
    <CustomMainView className='flex-1 p-10'>
      <View className='flex-[1] grow-[1] justify-end'>
        <Image
          source={require('@/assets/images/check-email.png')} 
          resizeMode='contain'
          className="h-36 w-full"
        />
      </View>
      <View className='items-center mt-4 mb-4'>
        <Text className='text-3xl text-onSurface dark:text-darkMode-onSurface'>{t("checkYourEmail")}</Text>
        <Text className='text-2xl text-textSecondary dark:text-darkMode-textSecondary text-center'>{t("weHaveSentYouVerificationLink")}</Text>
      </View>
      <View className='flex-[1] grow-[1]'>
        <PrimaryButton text={t("resendEmail")} className='mt-4' onPress={resend} />
        <SecondaryButton onPress={retry} className='mt-4' text={t("verifyAgain")} />
        <View className='items-center mt-4'>
          <Pressable className="active:opacity-20" onPress={signOut}>
            <Text className=" text-linkTextOverLight dark:text-darkMode-onSurface">{t("signOut")}</Text>
          </Pressable>
        </View>
      </View>
    </CustomMainView>
  )
}