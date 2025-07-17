import { View } from 'react-native';
import { TextInput } from 'react-native-paper';

export function Input({ className = '', ...otherProps }: any) {
  return (
    <View className={`rounded-xl overflow-hidden ${className}`}>
      <TextInput
        mode="flat"
        theme={{
          colors: {
            primary: '#1D2430',     // Color del label activo (focused)
            text: '#1D2430',        // Color del texto dentro del input
            placeholder: '#1D2430', // Color del label en reposo
          },
        }}
        underlineStyle={{
          backgroundColor: 'transparent',
        }}
        selectionColor="#9AA1B3"
        cursorColor="#1D2430"
        textColor="#1D2430"
        {...otherProps}
      />
    </View>
  );
}
