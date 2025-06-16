
import { Image, Text, TouchableOpacity } from 'react-native';

type Props = {
  text?: string;
  onPress: () => void;
  className: string;
};

export function PrimaryButton({ text, onPress , className }: Props) {
  return (
    <TouchableOpacity onPress={onPress} className={`bg-primary p-4 rounded-xl ${className}`}>
      <Text className='text-white text-center text-2xl font-semibold'>{text}</Text>
    </TouchableOpacity>
  );
}

export function GoogleButton({onPress , className}: Props) {
  return (
    <TouchableOpacity onPress={onPress} className={`flex-row items-center justify-center rounded-xl p-4 bg-white border border-gray-300 ${className}`}>
      <Image
        className='absolute left-0 w-7 h-7 ml-4'
        source={{ uri: 'https://www.gstatic.com/marketing-cms/assets/images/d5/dc/cfe9ce8b4425b410b49b7f2dd3f3/g.webp=s48-fcrop64=1,00000000ffffffff-rw' }}
      />
      <Text className='text-xl text-primaryTextOverLight '>Continue with Google</Text>
    </TouchableOpacity>
  );
}