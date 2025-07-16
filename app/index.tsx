// import auth from '@react-native-firebase/auth';
import { getAuth, GoogleAuthProvider } from '@react-native-firebase/auth';
import {
  GoogleSignin,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes
} from '@react-native-google-signin/google-signin';
import { useRouter } from "expo-router";
import { FirebaseError } from 'firebase/app';
import React, { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Pressable,
  Text,
  TouchableWithoutFeedback,
  View
} from "react-native";

import { GoogleButton, PrimaryButton } from '@/components/buttons';
import { CustomMainView } from '@/components/customMainView';
import { Input, PasswordInput } from '@/components/inputs';

export default function Index() {

  const router = useRouter();
  const { t } = useTranslation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const auth = getAuth()
  

  useEffect(() => {
    GoogleSignin.configure();
  }, []);

  const googleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const response: any = await GoogleSignin.signIn();
      if (isSuccessResponse(response)) {
        console.log("user", response.data);
        const googleCredential = GoogleAuthProvider.credential(
          response.data.idToken,
        );
        console.log("google credential", googleCredential);
        await auth.signInWithCredential(googleCredential);
      } else {
        console.log('Sign in cancelled by the user');
      }
    } catch (error) {
      if (isErrorWithCode(error)) {
        console.log('Error code:', error);
        switch (error.code) {
          case statusCodes.IN_PROGRESS:
            Alert.alert('Information', 'Sign in already in progress', [{text: 'OK'}]);
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            // Android only, play services not available or outdated
            Alert.alert('Error', 'Play services not available or outdated', [{text: 'OK'}]);
            break;
          default:
            Alert.alert('Error', 'Please try again later', [{text: 'OK'}]);
        }
      } else {
        // an error that's not related to google sign in occurred
        Alert.alert('Error', 'Please try again later', [{text: 'OK'}]);
      }
    }
  }

  const signUp = async () => {
    router.push('/SignUp');
  }

  const recoverPassword = () => {
    router.push('/PasswordRecovery');
  }

  const signIn = async () => {
    setLoading(true);
    try {
      await auth.signInWithEmailAndPassword(email, password);
    } catch (e: any) {
      const err = e as FirebaseError;
      console.log("sign in error", err);
      Alert.alert('Error', 'Wrong email or password', [{text: 'OK'}]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <CustomMainView className='flex-1'>
        <View className="flex-1 p-10 justify-center">
          <View className="flex-1 items-center grow-[1] justify-end">
            <Image source={require('@/assets/images/logo.png')} resizeMode='contain' className="h-28 w-full" />
            <Image source={require('@/assets/images/logo-title.png')} resizeMode='contain' className="h-14 w-full mt-4" />
          </View>
          <View className="flex-1 pt-6 grow-[2] justify-start">
            {loading ? (
                <ActivityIndicator size={'large'} className="flex-1"/>
              ) : (
                <View>
                  <View>
                    <KeyboardAvoidingView behavior="padding" className="">
                      <Input className='mb-4' value={email} onChangeText={setEmail} keyboardType="email-address" placeholder={t("email")} />
                      <PasswordInput
                        onIconPress={() => setShowPassword((showPassword) => !showPassword)}
                        iconName={showPassword ? "eye" : "eye-off"}
                        editable={!loading}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                        placeholder={t("password")}
                      />
                      <PrimaryButton className='mb-4 mt-4' onPress={signIn} text={t("logIn")}/>
                    </KeyboardAvoidingView>
                    <Pressable className="active:opacity-20" onPress={recoverPassword} hitSlop={15}>
                      <Text className="text-right text-textPrimary dark:text-darkMode-textPrimary">{t('forgotPassword')}</Text>
                    </Pressable>
                  </View>
                  <View className="flex-row">
                    <View className='flex-1 grow-[1] border-t border-divider mt-4'></View>
                    <Text className='text-end text-2xl mr-4 ml-4 text-textSecondary'>{t('or')}</Text>
                    <View className='flex-1 grow-[1] border-t border-divider mt-4'></View>
                  </View>
                  <View>
                    <GoogleButton onPress={googleSignIn} className='mt-4'/>
                    <View className='flex-row items-start justify-center mt-4'>
                      <Text className='text-md text-textPrimary dark:text-darkMode-textPrimary'>{t('doesNotHaveAnAccount')}</Text>
                      <Pressable className="active:opacity-20" onPress={signUp} hitSlop={15}>
                        <Text className="text-md text-linkTextOverLight"> {t('signUp')}</Text>
                      </Pressable>
                    </View>
                  </View>
                </View>
              )}
          </View>
        </View>
      </CustomMainView>
    </TouchableWithoutFeedback>
  );
}
