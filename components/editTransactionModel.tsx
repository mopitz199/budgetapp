
import { PrimaryButton, SecondaryButton } from '@/components/buttons';
import CustomDropDownPicker from '@/components/customDropDown';
import { CustomSafeAreaView } from '@/components/customMainView';
import { Input } from '@/components/inputs';
import IOSDatePicker from '@/components/iosDatePicker';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Keyboard, Platform, Pressable, Text, TouchableWithoutFeedback, View } from 'react-native';
import { TextInput } from 'react-native-paper';

type Transaction = {
  index: number;
  date: Date;
  description: string;
  amount: string;
  removed: boolean;
  negative: boolean;
  category: string;
};

export function EditTransactionView(
  {
    hideBackButton, // if we want to hide the back button in the header
    transactionToEditDefault, // Transaction to edit, if null, we are creating a new transaction
    colors, // Colors from the theme
    formatCLP, // Method to format a number to CLP currency format
    categories, // Categories array for the dropdown
    setCategories, // Method to store the categories array
    onSaveEditTransaction, // Function to execute when saving the edited transaction
    onCancelEditTransaction // Function to execute when cancelling the edit transaction
  }: any
) {

  const [categoryOption, setCategoryOption] = useState(transactionToEditDefault.category);

  const [openCategoryPicker, setOpenCategoryPicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState<Transaction>(transactionToEditDefault);

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

        <View className='p-4 flex-1'>
          <View className=''>
            <View className='mb-4'>
              <View className='rounded-xl overflow-hidden'>
                <Input
                  value={formatCLP(transactionToEdit.amount.toString())}
                  label="Monto"
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
                    />}
                  keyboardType="numeric"
                  onChangeText={(value: any) => {
                    setTransactionToEdit({...transactionToEdit, amount: value ? formatCLP(value) : ""})
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
                label={"Descripcion"} />
            </View>
            <View className=''>
              <Pressable
                className='
                  p-4
                  bg-surface
                  dark:bg-darkMode-surface
                  rounded-xl                  
                '
                onPress={displayDatePickerView}
              >
                <Text className='text-xl font-light text-onSurface dark:text-darkMode-onSurface'>
                  {transactionToEdit.date.toDateString()}
                </Text>
              </Pressable>
            </View>
            <View className='mt-4'>
              <CustomDropDownPicker
                open={openCategoryPicker}
                value={categoryOption}
                items={categories}
                setOpen={setOpenCategoryPicker}
                setValue={setCategoryOption}
                onSelectItem={(item: any) => {
                  setTransactionToEdit({...transactionToEdit, category: item.value})
                }}
                setItems={setCategories}
                placeholder={'Categoria'}
              />
            </View>
          </View>
          <PrimaryButton className='mt-4' onPress={() => onSaveEditTransaction(transactionToEdit)} text={"Guardar"} />
          <SecondaryButton className='mt-4' onPress={() => onCancelEditTransaction(transactionToEdit)} text={"Cancelar"} />
        </View>
      </CustomSafeAreaView>
    </TouchableWithoutFeedback>
  );
}
