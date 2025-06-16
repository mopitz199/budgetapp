import { TextInput, TextInputProps } from 'react-native';

export function TopInput({ className, value, onChangeText, ...otherProps}: TextInputProps) {
  return (
    <TextInput
      className='text-2xl p-4 text-primaryTextOverLight bg-surfaceCard rounded-t-xl'
      value={value}
      onChangeText={onChangeText}
      {...otherProps}
    />
  );
}

export function BottomInput({ className, value, onChangeText, ...otherProps}: TextInputProps) {
  return (
    <TextInput
      className='border-t text-2xl p-4 border-divider rounded-b-xl text-primaryTextOverLight bg-surfaceCard'
      value={value}
      onChangeText={onChangeText}
      {...otherProps}
    />
  );
}