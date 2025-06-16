import { Text, TextInput, TextInputProps, View } from 'react-native';

export function Input({ className, value, onChangeText, ...otherProps}: TextInputProps) {
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
      value={value}
      onChangeText={onChangeText}
      autoCapitalize='none'
      {...otherProps}
    />
  );
}


export function InputWithError({
  className,
  value,
  onChangeText,
  errorMessage,
  ...otherProps}: TextInputProps & { errorMessage?: string }
) {
  return (
    <View className='mb-2'>
      <Input className='mb-2' value={value} onChangeText={onChangeText} {...otherProps}/>
      <Text className='pl-2 text-error text-lg'>{errorMessage}</Text>
    </View>
  );
}