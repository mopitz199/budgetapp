import { PrimaryButton } from '@/components/buttons';
import auth from '@react-native-firebase/auth';
import { useRouter } from "expo-router";
import { useTranslation } from 'react-i18next';
import {
  Image,
  Text,
  TouchableOpacity,
  View
} from "react-native";

export default function EmailVerification() {
  const { t } = useTranslation();
  const router = useRouter();

  const resend = () => {
    const user = auth().currentUser;
    user?.sendEmailVerification()
    alert(t("emailSent"))
  }

  const signOut = () => {
    auth().signOut()
  }

  const retry = async () => {
    const user = auth().currentUser;
    if(user){
      await user.reload();
      if(user.emailVerified){
        router.replace('/(auth)/home');
      }else{
        alert(t("notVerifiedCheckEmail"))
      }
    }
  }

  return (
    <View className='flex-1'>
      <View className='flex-[1] grow-[1] justify-end'>
        <Image
          source={require('@/assets/images/check-email.png')} 
          resizeMode='contain'
          className="h-36 w-full"
        />
      </View>
      <View className='items-center mt-4 mb-4'>
        <Text className='text-4xl font-semibold text-primaryTextOverLight'>{t("checkYourEmail")}</Text>
      </View>
      <View className='flex-[1] grow-[1] items-center'>
        <Text className='text-2xl text-secondaryTextOverLight text-center'>{t("weHaveSentYouVerificationLink")}</Text>
        <PrimaryButton text={t("resendEmail")} className='mt-4' onPress={resend} />
        <TouchableOpacity onPress={retry} className={`bg-white p-2 rounded-xl mt-4`}>
          <Text className='text-primaryTextOverLight text-center text-xl'>{t("verifyAgain")}</Text>
        </TouchableOpacity>
        <Text onPress={signOut} className="text-md text-linkTextOverLight mt-4">{t("signOut")}</Text>
      </View>
    </View>
  )
}