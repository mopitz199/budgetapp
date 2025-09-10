
import { useTranslation } from 'react-i18next';
import { Image, Text, TouchableOpacity, TouchableOpacityProps, View } from 'react-native';

type Props = {
  text?: string;
  onPress: () => void;
  className: string;
  rightIcon?: any;
};

export function PrimaryButton({ text, onPress , className, ...props }: TouchableOpacityProps & Props ) {
  return (
    <TouchableOpacity onPress={onPress} className={`bg-primary p-4 rounded-xl ${className}`} {...props}>
      <Text className='text-white text-center text-xl'>{text}</Text>
    </TouchableOpacity>
  );
}

export function SecondaryButton({ text, onPress , className, rightIcon, ...props }: TouchableOpacityProps & Props ) {
  return (
    <TouchableOpacity onPress={onPress} className={`bg-surface p-4 rounded-xl border border-divider ${className}`} {...props}>
      <View className='flex-row justify-center'>
        <Text className='text-textPrimary text-center text-xl'>{text}</Text>
        {rightIcon ? rightIcon : null}
      </View>
    </TouchableOpacity>
  );
}

export function GoogleButton({onPress , className}: Props) {
  const { t } = useTranslation();

  return (
    <TouchableOpacity onPress={onPress} className={`flex-row items-center justify-center rounded-xl p-4 bg-white border border-gray-300 ${className}`}>
      <Image
        className='absolute left-0 w-7 h-7 ml-4'
        source={{ uri: 'https://www.gstatic.com/marketing-cms/assets/images/d5/dc/cfe9ce8b4425b410b49b7f2dd3f3/g.webp=s48-fcrop64=1,00000000ffffffff-rw' }}
      />
      <Text className='text-xl text-textPrimary '>{t("continueWithGoogle")}</Text>
    </TouchableOpacity>
  );
}