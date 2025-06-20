import { PrimaryButton } from '@/components/buttons';
import { Input, PasswordInput } from '@/components/inputs';
import { getAuth } from '@react-native-firebase/auth';
import { FirebaseError } from 'firebase/app';
import React, { useState } from "react";
import { useTranslation } from 'react-i18next';
import {
  KeyboardAvoidingView,
  SafeAreaView,
  Text,
  View
} from "react-native";

export default function CreateAccount() {

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
    <SafeAreaView className="flex-1 flex-col justify-center items-center bg-background">
      <View className='grow-[1] justify-end'>
        <Text className='text-4xl text-primaryTextOverLight mb-4'>{t("createAccount")}</Text>
      </View>
      <KeyboardAvoidingView className='w-full grow-[1] justify-start p-10'>
        <Input editable={!loading} className='mb-2' value={email} onChangeText={setEmail} keyboardType="email-address" placeholder={t("email")} />
        <Text className='pl-2 mb-2 text-error text-lg'>{emailError}</Text>
        <PasswordInput
          onIconPress={() => setShowPassword((showPassword) => !showPassword)}
          iconName={showPassword ? "eye" : "eye-off"}
          editable={!loading}
          className='mb-2'
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          placeholder={t("password")}
        />
        <Text className='pl-2 mb-2 text-error text-lg'>{passwordError}</Text>
        <PasswordInput
          onIconPress={() => setShowRepeatedPassword((showRepeatedPassword) => !showRepeatedPassword)}
          iconName={showRepeatedPassword ? "eye" : "eye-off"}
          editable={!loading}
          className='mb-2'
          value={repeatedPassword}
          onChangeText={setRepeatedPassword}
          secureTextEntry={!showRepeatedPassword}
          placeholder={t("repeatPassword")}
        />
        <Text className='pl-2 mb-2 text-error text-lg'>{repeatedPasswordError}</Text>
        <PrimaryButton
          className={`mt-2 mb-4 ${loading ? 'opacity-50' : 'opacity-100'}`}
          onPress={signUp}
          disabled={loading}
          text={loading ? t("creatingAccount") : t("startSaving")}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}