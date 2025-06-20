import { Ionicons } from '@expo/vector-icons';
import { Pressable, TextInput, TextInputProps, View } from 'react-native';

export function Input({ className, ...otherProps}: TextInputProps) {
  return (
    <TextInput
      className={`
        text-2xl p-4
        text-primaryTextOverLight 
        bg-surfaceCard
        rounded-xl
        border-divider
        border
      ${className}`}
      autoCapitalize='none'
      {...otherProps}
    />
  );
}

export function PasswordInput({onIconPress, iconName, ...props}: any & "text" & TextInputProps)  {
  return (
    <View className='justify-center'>
      <Input {...props} />
      <Pressable className='absolute right-4' onPress={onIconPress}>
        <Ionicons name={iconName} size={30} color="#1D2430" />
      </Pressable>
    </View>
  )
}
