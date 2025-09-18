import { PrimaryButton } from '@/components/buttons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';

type Props = {
  value: Date;
  onClose: () => void;
  onButtonPress: () => void;
  onChange: (newDate: Date) => void;
  buttonName: string;
  displayCloseButton: boolean;
};

export default function IOSDatePicker({ value, onClose, onButtonPress, onChange, buttonName, displayCloseButton = true }: Props) {

  const { t, i18n } = useTranslation();

  return (
    <View className='absolute top-0 left-0 right-0 inset-0 h-max z-10 justify-center'>
      <Pressable onPress={onClose} className='absolute top-0 left-0 right-0 opacity-70 bg-black inset-0 h-max z-11 justify-center'>
        <></>
      </Pressable>
      <View className={`bg-background dark:bg-darkMode-background z-12 m-4 rounded-2xl p-4`}>
        <DateTimePicker
          value={value}
          locale={i18n.language}
          mode="date"
          display="spinner"
          onChange={(event: DateTimePickerEvent, date?: Date) => {
            let newDate: Date = date? date : new Date();
            onChange(newDate)
          }}
        />
        {displayCloseButton ? <PrimaryButton className='mt-4 mr-10 ml-10' onPress={onButtonPress} text={buttonName} /> : null}
      </View>
    </View>
  )
}