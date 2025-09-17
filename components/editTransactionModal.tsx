
import { PrimaryButton, SecondaryButton } from '@/components/buttons';
import CustomDropDownPicker from '@/components/customDropDown';
import { CustomSafeAreaView } from '@/components/customMainView';
import { Input } from '@/components/inputs';
import IOSDatePicker from '@/components/iosDatePicker';
import { cleanNumber } from '@/currencyMap';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Keyboard, Platform, Pressable, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { TextInput } from 'react-native-paper';
import { CurrencyPickerModal } from './currencyPickerModal';


type Transaction = {
  index: number;
  date: Date;
  description: string;
  amount: string;
  numberAmount: string;
  removed: boolean;
  negative: boolean;
  category: string;
  currency: string;
};

type Categories = Record<string, { value: string; color: string }>;


export function EditTransactionView(
  {
    hideBackButton, // if we want to hide the back button in the header
    transactionToEditDefault, // Transaction to edit, if null, we are creating a new transaction
    colors, // Colors from the theme
    mapCategories, // Map of categories
    onSaveEditTransaction, // Function to execute when saving the edited transaction
    onCancelEditTransaction // Function to execute when cancelling the edit transaction
  }: any
) {

  const buildCategories = () => {
    let categories = [];
    for(const key in mapCategories){
      const k = key as keyof typeof mapCategories;
      categories.push({
        label: t(mapCategories[k].value),
        value: k
      })
    }
    return categories;
  }

  const { t, i18n } = useTranslation();

  const [categoryOption, setCategoryOption] = useState(transactionToEditDefault.category);
  const [openCategoryPicker, setOpenCategoryPicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState<Transaction>(transactionToEditDefault);
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  const [categories, setCategories] = useState(buildCategories());

  const iosPicker = () => {
    if (Platform.OS == 'ios' && showDatePicker) {
      return <IOSDatePicker
        value={new Date(transactionToEdit.date)}
        onChange={(date) => setTransactionToEdit({...transactionToEdit, date: date} as Transaction)}
        onClose={() => setShowDatePicker(false)}
        displayCloseButton={true}
      />;
    }
  }

  const displayDatePickerView = () => {
    Keyboard.dismiss();
    if (Platform.OS === 'ios') {
      setShowDatePicker(true);
    } else {
      DateTimePickerAndroid.open({
        value: new Date(transactionToEdit.date),
        onChange: (event, date) => {
          setTransactionToEdit({...transactionToEdit, date: date} as Transaction);
        },
        mode: 'date',
        is24Hour: true,
      });
    }
  }

  const displayDate = (date: Date) => {
    return date.toLocaleDateString(i18n.language, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  return (
    <TouchableWithoutFeedback onPress={() => {
      Keyboard.dismiss();
      setOpenCategoryPicker(false);
      setShowDatePicker(false);
    }}>
      <CustomSafeAreaView
        className='px-4 pt-4'
        screenWithHeader={hideBackButton}
      >
        {iosPicker()}

        <CurrencyPickerModal
          showCurrencyModal={showCurrencyModal}
          setShowCurrencyModal={setShowCurrencyModal}
          colors={colors}
          currencyValue={transactionToEdit.currency}
          onCurrencyChange={(previousCurrencyValue: string, newCurrencyValue: string) => {
            setTransactionToEdit({
              ...transactionToEdit,
              currency: newCurrencyValue,
              numberAmount: cleanNumber(transactionToEdit.numberAmount, previousCurrencyValue, newCurrencyValue),
            });
          }}
        />

        <View className='p-4 flex-1'>
          <View className=''>
            <View className='mb-4'>
              <View className='rounded-xl overflow-hidden'>
                <Input
                  value={transactionToEdit.numberAmount}
                  label={t("amount")}
                  left={
                    <TextInput.Icon
                      icon={() => {
                        return (
                          <TouchableOpacity
                            className='flex-1 w-full justify-center items-center'
                            onPress={() => {
                              Keyboard.dismiss();
                              setShowCurrencyModal(true);
                            }}
                          >
                            <Text className='text-onSurface dark:text-darkMode-onSurface'>{transactionToEdit.currency}</Text>
                          </TouchableOpacity>
                        );
                      }}
                      style={{
                        borderColor: transactionToEdit.negative ? colors.error : colors.success,
                        borderRightWidth: 1,
                        borderRadius: 0,
                        paddingRight: 5,
                        marginRight: 5,
                      }}
                    />}
                  right={
                    <TextInput.Icon
                      onPress={() => {
                        setTransactionToEdit({
                          ...transactionToEdit,
                          negative: !transactionToEdit.negative
                        });
                      }}
                      icon={transactionToEdit.negative ? "minus" : "plus"}
                      color={transactionToEdit.negative ? colors.error : colors.success}
                      style={{
                        borderColor: transactionToEdit.negative ? colors.error : colors.success,
                        borderWidth: 1
                      }}
                    />}
                  onChangeText={(value: any) => {
                    setTransactionToEdit({
                      ...transactionToEdit,
                      numberAmount: value ? cleanNumber(value, transactionToEdit.currency, transactionToEdit.currency) : "0"
                    })
                  }}
                />
              </View>
            </View>
            <View className='mb-4'>
              <Input
                value={transactionToEdit.description}
                onChangeText={(value: any) => {
                  setTransactionToEdit({...transactionToEdit, description: value})
                }}
                label={t("description")} />
            </View>
            <View className=''>
              <Pressable
                className='p-4 bg-surface dark:bg-darkMode-surface rounded-xl'
                onPress={displayDatePickerView}
              >
                <Text className='text-xl font-light text-onSurface dark:text-darkMode-onSurface'>
                  {displayDate(transactionToEdit.date)}
                </Text>
              </Pressable>
            </View>
            <View className='mt-4'>
              <CustomDropDownPicker
                value={categoryOption}
                setValue={setCategoryOption}
                items={categories}
                setItems={setCategories}
                open={openCategoryPicker}
                onPress={(wasClosed: boolean) => {
                  Keyboard.dismiss();
                  setOpenCategoryPicker(wasClosed)
                }}
                onChangeValue={(value: string) => {
                  setOpenCategoryPicker(false)
                  setTransactionToEdit({...transactionToEdit, category: value})
                }}
                placeholder={t("category")}
              />
            </View>
          </View>
          <PrimaryButton className='mt-4' onPress={() => onSaveEditTransaction(
            {
              ...transactionToEdit,
              numberAmount: cleanNumber(transactionToEdit.numberAmount, transactionToEdit.currency, transactionToEdit.currency, true)
            }
          )} text={t("save")} />
          <SecondaryButton className='mt-4' onPress={() => onCancelEditTransaction(transactionToEdit)} text={t("cancel")} />
        </View>
      </CustomSafeAreaView>
    </TouchableWithoutFeedback>
  );
}
