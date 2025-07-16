import { PrimaryButton } from '@/components/buttons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Pressable, View } from 'react-native';

type Props = {
  value: Date;
  onClose: () => void;
  onChange: (newDate: Date) => void;
};

export default function IOSDatePicker({ value, onClose, onChange }: Props) {
  return (
    <View className='absolute top-0 left-0 right-0 inset-0 h-max z-10 justify-center'>
      <Pressable onPress={onClose} className='absolute top-0 left-0 right-0 opacity-70 bg-black inset-0 h-max z-11 justify-center'>
        <></>
      </Pressable>
      <View className={`bg-background dark:bg-darkMode-background z-12 m-4 rounded-2xl p-4`}>
        <DateTimePicker
          value={value}
          mode="date"
          display="spinner"
          onChange={(event, date?: Date) => {
            let newDate: Date = date? date : new Date();
            onChange(newDate)
          }}
        />
        <PrimaryButton className='mt-4 mr-10 ml-10' onPress={onClose} text={"Close"} />
      </View>
    </View>
  )
}