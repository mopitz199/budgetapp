import DropDownPicker from 'react-native-dropdown-picker';
import { useTheme } from 'react-native-paper';

export default function CustomDropDownPicker({...props}: any) {

  const { colors } = useTheme();

  return (
    <DropDownPicker
      zIndex={9}
      arrowIconStyle={{ tintColor: colors.onSurface }}
      tickIconStyle={{ tintColor: colors.onSurface }}
      style={{
        backgroundColor: colors.surfaceVariant,
        paddingVertical: 18,
        borderRadius: 12,
        paddingHorizontal: 15,
        borderWidth: 0,
      }}
      textStyle={{ fontSize: 16, color: colors.onSurface }}  
      dropDownContainerStyle={{
        zIndex: 9,
        backgroundColor: colors.surfaceVariant,
        paddingVertical: 18,
        borderRadius: 12,
        paddingHorizontal: 7,
        borderWidth: 0,
      }}
      {...props}
    />
  )
}