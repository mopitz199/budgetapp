import { View } from 'react-native';
import { TextInput, useTheme } from 'react-native-paper';

export function Input({ className = '', ...otherProps }: any) {
  const { colors } = useTheme();

  return (
    <View className={`rounded-xl overflow-hidden ${className}`}>
      <TextInput
        mode="flat"
        theme={{
          colors: {
            primary: colors.onSurface,     // Color del label activo (focused)
            text: colors.onSurface,        // Color del texto dentro del input
          },
        }}
        underlineStyle={{
          backgroundColor: 'transparent',
        }}
        selectionColor={colors.onSurface}
        {...otherProps}
      />
    </View>
  );
}
