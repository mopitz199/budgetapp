
import { PrimaryButton, SecondaryButton } from '@/components/buttons';
import CustomDropDownPicker from '@/components/customDropDown';
import { CustomSafeAreaView } from '@/components/customMainView';
import { Input } from '@/components/inputs';
import IOSDatePicker from '@/components/iosDatePicker';
import { cleanNumber, currencyMap, formatCurrency } from '@/currencyMap';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Keyboard, Platform, Pressable, ScrollView, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { Modal, Portal, TextInput } from 'react-native-paper';


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

export function EditTransactionView(
  {
    hideBackButton, // if we want to hide the back button in the header
    transactionToEditDefault, // Transaction to edit, if null, we are creating a new transaction
    colors, // Colors from the theme
    categories, // Categories array for the dropdown
    setCategories, // Method to store the categories array
    onSaveEditTransaction, // Function to execute when saving the edited transaction
    onCancelEditTransaction // Function to execute when cancelling the edit transaction
  }: any
) {

  const { t, i18n } = useTranslation();

  const [categoryOption, setCategoryOption] = useState(transactionToEditDefault.category);
  const [openCategoryPicker, setOpenCategoryPicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState<Transaction>(transactionToEditDefault);
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);

  const iosPicker = () => {
    if (Platform.OS == 'ios' && showDatePicker) {
      return <IOSDatePicker
        value={new Date(transactionToEdit.date)}
        onChange={(date) => setTransactionToEdit({...transactionToEdit, date: date} as Transaction)}
        onClose={() => setShowDatePicker(false)}
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


  const getCurrencyList = () => {
    let currencyList: string[] = [];
    for (const key in currencyMap) {
      currencyList.push(key);
    }
    return currencyList;
  }

  const modal = () => {
    return (
      <Portal>
        <Modal
          visible={showCurrencyModal}
          contentContainerStyle={{
            height: '40%',
            width: '80%',
            alignSelf: 'center',
            justifyContent: 'center',
            backgroundColor: colors.surface,
            margin: 28,
            borderRadius: 10
          }} onDismiss={() => {setShowCurrencyModal(false)}}>
            <ScrollView indicatorStyle="black" className='rounded-xl'>
              {getCurrencyList().map((currency) => (
                <TouchableOpacity
                  className={`
                    border-divider 
                    dark:border-darkMode-divider
                    border-b
                    p-6
                    ${currency === transactionToEdit.currency ? 'bg-primary dark:bg-darkMode-primary' : ''}
                  `}
                  key={currency}
                  onPress={() => {
                    setTransactionToEdit({
                      ...transactionToEdit,
                      currency: currency,
                      numberAmount: cleanNumber(transactionToEdit.numberAmount, currency),
                    });
                    setShowCurrencyModal(false);
                  }}
                >
                  <Text className='text-md color-onSurface dark:color-darkMode-onSurface'>{currency}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
        </Modal>
      </Portal>
    )
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
        {modal()}
        <View className='p-4 flex-1'>
          <View className=''>
            <View className='mb-4'>
              <View className='rounded-xl overflow-hidden'>
                <Input
                  value={formatCurrency(transactionToEdit.numberAmount, transactionToEdit.currency)}
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
                  //keyboardType="numeric"
                  onChangeText={(value: any) => {
                    setTransactionToEdit({
                      ...transactionToEdit,
                      numberAmount: value ? cleanNumber(value, transactionToEdit.currency) : "0"
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
                open={openCategoryPicker}
                value={categoryOption}
                items={categories}
                setOpen={() => {
                  Keyboard.dismiss();
                  setOpenCategoryPicker(true)
                }}
                setValue={setCategoryOption}
                onSelectItem={(item: any) => {
                  setTransactionToEdit({...transactionToEdit, category: item.value})
                }}
                setItems={setCategories}
                placeholder={t("category")}
              />
            </View>
          </View>
          <PrimaryButton className='mt-4' onPress={() => onSaveEditTransaction(
            {
              ...transactionToEdit,
              numberAmount: cleanNumber(transactionToEdit.numberAmount, transactionToEdit.currency, true)
            }
          )} text={t("save")} />
          <SecondaryButton className='mt-4' onPress={() => onCancelEditTransaction(transactionToEdit)} text={t("cancel")} />
        </View>
      </CustomSafeAreaView>
    </TouchableWithoutFeedback>
  );
}
