import { PrimaryButton } from '@/components/buttons';
import { CustomMainView } from '@/components/customMainView';
import { Input } from '@/components/inputs';
import { headerSettings } from '@/utils';
import { getAuth } from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/core';
import { FirebaseError } from 'firebase/app';
import React, { useLayoutEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableWithoutFeedback,
  useColorScheme,
  View
} from "react-native";
import { TextInput } from 'react-native-paper';

export default function CreateAccount() {

  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const { t } = useTranslation();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatedPassword, setRepeatedPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatedPassword, setShowRepeatedPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [repeatedPasswordError, setRepeatedPasswordError] = useState('');

  const [loading, setLoading] = useState(false);
  const auth = getAuth()

  
  useLayoutEffect(() => headerSettings(
    navigation,
    colorScheme,
    t("signUp")
  ), [navigation, colorScheme]);

  const validateEmail = (): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if(email.trim() == '' || !emailRegex.test(email)){
      setEmailError(t("invalidEmail"))
      return false
    }
    setEmailError("")
    return true
  }

  const validatePassword = (): boolean => {
    const passwordRegex = /^(?=.*[a-z])(?=.*\d).{6,}$/;
    if (password.trim() == '' || !passwordRegex.test(password)){
      setPasswordError(t("invalidPassword"))
      return false
    }
    setPasswordError("")
    return true
  }

  const validateRepeatedPassword = (): boolean => {
    if(password != repeatedPassword){
      setRepeatedPasswordError(t("invalidRepeatedPassword"))
      return false
    }
    setRepeatedPasswordError("")
    return true
  }

  const createAccount = async () => {
    try {
      const {user} = await auth.createUserWithEmailAndPassword(email, password);
      user.sendEmailVerification();
    } catch (e: any) {
      const err = e as FirebaseError;
      alert("Registration failed: " + err.message)
    } finally {
      setLoading(false);
    }
  }

  const signUp = async () => {
    setLoading(true)
    if(!loading){
      if(validateEmail() && validatePassword() && validateRepeatedPassword()){
        await createAccount()
      }
      setLoading(false)
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <CustomMainView className='flex-1'>
        <View className='flex-1 p-10 flex-col justify-center'>
          <Text className='text-center text-3xl text-textPrimary dark:text-darkMode-textPrimary mb-10'>{t("createAccount")}</Text>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}>
            <Input editable={!loading} value={email} onChangeText={setEmail} keyboardType="email-address" label={t("email")} />
            <Text className='pl-2 mb-2 text-error text-lg'>{emailError}</Text>
            <Input
              className=''
              value={password}
              forceTextInputFocus={false}
              onChangeText={setPassword}
              disabled={loading}
              secureTextEntry={!showPassword}
              label={t("password")}
              right={
                <TextInput.Icon
                  onPress={() => {setShowPassword((showPassword) => !showPassword)}}
                  icon={showPassword ? "eye" : "eye-off"}
                />
              }
            />
            <Text className='pl-2 mb-2 text-error text-lg'>{passwordError}</Text>
            <Input
              className=''
              value={repeatedPassword}
              forceTextInputFocus={false}
              onChangeText={setRepeatedPassword}
              disabled={loading}
              secureTextEntry={!showRepeatedPassword}
              label={t("repeatPassword")}
              right={
                <TextInput.Icon
                  onPress={() => setShowRepeatedPassword((showRepeatedPassword) => !showRepeatedPassword)}
                  icon={showRepeatedPassword ? "eye" : "eye-off"}
                />
              }
            />
            <Text className='pl-2 mb-2 text-error text-lg'>{repeatedPasswordError}</Text>
            <PrimaryButton
              className={`${loading ? 'opacity-50' : 'opacity-100'}`}
              onPress={signUp}
              disabled={loading}
              text={loading ? t("creatingAccount") : t("startSaving")}
            />
          </KeyboardAvoidingView>
        </View>
      </CustomMainView>
    </TouchableWithoutFeedback>
  );
}