import auth from '@react-native-firebase/auth';
import { FirebaseError } from 'firebase/app';
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  SafeAreaView,
  Text,
  View
} from "react-native";

import { PrimaryButton } from '@/components/buttons';
import { Input } from '@/components/inputs';

export default function CreateAccount() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatedPassword, setRepeatedPassword] = useState('');

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [repeatedPasswordError, setRepeatedPasswordError] = useState('');

  const [loading, setLoading] = useState(false);

  const validateEmail = (): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if(email.trim() == '' || !emailRegex.test(email)){
      setEmailError("The email in invalid")
      return false
    }
    setEmailError("")
    return true
  }

  const validatePassword = (): boolean => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    if (password.trim() == '' || !passwordRegex.test(password)){
      setPasswordError("Use at least 6 numbers and characters")
      return false
    }
    setPasswordError("")
    return true
  }

  const validateRepeatedPassword = (): boolean => {
    if(password != repeatedPassword){
      setRepeatedPasswordError("The passwords does not match")
      return false
    }
    setRepeatedPasswordError("")
    return true
  }

  const createAccount = async () => {
    try {
      const {user} = await auth().createUserWithEmailAndPassword(email, password);
      user.sendEmailVerification();
      alert("Check your email!")
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
        <Text className='text-4xl text-primaryTextOverLight mb-4'>Create Account</Text>
      </View>
      <KeyboardAvoidingView className='w-full grow-[1] justify-start p-10'>
        <Input className='mb-2' value={email} onChangeText={setEmail} keyboardType="email-address" placeholder="Email" />
        <Text className='pl-2 mb-2 text-error text-lg'>{emailError}</Text>
        <Input className='mb-2' value={password} onChangeText={setPassword} secureTextEntry placeholder="Password" />
        <Text className='pl-2 mb-2 text-error text-lg'>{passwordError}</Text>
        <Input className='mb-2' value={repeatedPassword} onChangeText={setRepeatedPassword} secureTextEntry placeholder="Repeat Password" />
        <Text className='pl-2 mb-2 text-error text-lg'>{repeatedPasswordError}</Text>
        <PrimaryButton
          className='mt-2 mb-4'
          onPress={signUp}
          disabled={loading}
          style={{ opacity: loading ? 0.5 : 1 }}
          text={loading ? 'Loading...' : '¡Start Saving!'}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}