import { PrimaryButton, SecondaryButton } from '@/components/buttons';
import CustomDropDownPicker from '@/components/customDropDown';
import { CustomMainView, CustomSafeAreaView } from '@/components/customMainView';
import { Input } from '@/components/inputs';
import IOSDatePicker from '@/components/iosDatePicker';
import { formatNumber, headerSettings } from '@/utils';
import { Ionicons } from '@expo/vector-icons';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { doc, getDoc, getFirestore } from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, BackHandler, Keyboard, Platform, Pressable, ScrollView, Text, TouchableWithoutFeedback, useColorScheme, View } from 'react-native';
import { Snackbar, TextInput, Tooltip, useTheme } from 'react-native-paper';

type Transaction = {
  index: number;
  date: Date;
  description: string;
  amount: number;
  removed: boolean;
};


export default function TransactionEdition() {

  // Use always to ensure the color scheme is applied correctly
  const colorScheme = useColorScheme();
  const { colors } = useTheme() as any;

  const navigation = useNavigation();
  const { t } = useTranslation();
  let { transactionsId } = useLocalSearchParams();
  transactionsId = transactionsId as string;
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [snackBarVisible, setSnackBarVisible] = useState(false);

  const [transactionToEdit, setTransactionToEdit] = useState<Transaction>({
    index: -1,
    date: new Date(),
    description: '',
    amount: 0,
    removed: true
  });

  const [showTransactionEditModal, setShowTransactionEditModal] = useState(false);
  const [lastIndexElementRemoved, setIndexLastElementRemoved] = useState<number | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [hideBackButton, setHideBackButton] = useState<boolean>(false);

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
      {label: 'Apple', value: 'apple'},
      {label: 'Banana', value: 'banana'},
      {label: 'Pear', value: 'pear'},
  ]);

  useLayoutEffect(() => headerSettings(
      navigation,
      colorScheme,
      t("verifyYourTransactions"),
      {
        headerShown: !hideBackButton,
        gestureEnabled: !hideBackButton,
      }
    ), [navigation, colorScheme, hideBackButton]
  );


  const readTransactions = async () => {
    const db = getFirestore();
    const docRef = doc(db, "analysis_requirement", transactionsId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const jsonOutput = docSnap.data()?.json_output;
      const responseTransactions = jsonOutput.transactions.map((transaction: any, index: number) => {
        return {
          ...transaction,
          date: new Date(transaction.date),
          index: index,
        };
      });
      setTransactions(responseTransactions);
      console.log("Document data:", docSnap.data());
    } else {
      console.log("No such document!");
    }

  }

  const removeTransaction = (index: number) => {
    setTransactions(prevTransactions => {
      const newTransactions = [...prevTransactions];
      newTransactions[index].removed = true; // Mark the transaction as removedd
      return newTransactions;
    });
    setIndexLastElementRemoved(index);
    setSnackBarVisible(true);
  }

  const editTransaction = (transaction: Transaction) => {
    setHideBackButton(true);
    setTransactionToEdit(transaction);
    setShowTransactionEditModal(true);
  }

  const undoRemoveTransaction = () => {
    if (lastIndexElementRemoved !== null) {
      setTransactions(prevTransactions => {
        const newTransactions = [...prevTransactions];
        newTransactions[lastIndexElementRemoved].removed = false; // Restore the transaction
        return newTransactions;
      });
      setIndexLastElementRemoved(null);
    }
  }

  useEffect(() => {
    readTransactions()
    // Simulate fetching transactions from a database
    /*const fetchedTransactions: Transaction[] = [
      { index: 0, date: new Date('2023-10-02'), description: 'Compra en tienda', amount: "50.0", removed: false },
      { index: 1, date: new Date('2023-10-02'), description: 'Pago de servicios', amount: "-30.0", removed: false },
      { index: 2, date: new Date('2023-10-03'), description: 'Transferencia recibida por una persona con muchas persona con muchas', amount: "100000", removed: false },
      { index: 3, date: new Date('2023-10-02'), description: 'Compra en tienda', amount: "50.0", removed: false },
      { index: 4, date: new Date('2023-10-02'), description: 'Pago de servicios', amount: "-30.0", removed: false },
      { index: 5, date: new Date('2023-10-03'), description: 'Transferencia recibida por una persona con muchas persona con muchas', amount: "100000", removed: false },
      { index: 6, date: new Date('2023-10-02'), description: 'Compra en tienda', amount: "50.0", removed: false },
      { index: 7, date: new Date('2023-10-02'), description: 'Pago de servicios', amount: "-30.0", removed: false },
      { index: 8, date: new Date('2023-10-03'), description: 'Transferencia recibida por una persona con muchas persona con muchas', amount: "100000", removed: false },
      { index: 9, date: new Date('2023-10-02'), description: 'Compra en tienda', amount: "50.0", removed: false },
      { index: 10, date: new Date('2023-10-02'), description: 'Pago de servicios', amount: "-30.0", removed: false },
      { index: 11, date: new Date('2023-10-03'), description: 'Transferenciaa recibida por una persona con muchas persona con muchas', amount: "100000", removed: false },
    ]
    setTransactions(fetchedTransactions);*/
  }, []);

  useEffect(() => {
    if(!hideBackButton) return;

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        // 🔒 Evita salir de la pantalla mientras el modal está activo
        return true;
      }
    );
    return () => backHandler.remove();
  }, [hideBackButton]);


  const transactionListPreview = () => {
    return (
      <CustomMainView
        screenWithHeader={hideBackButton}
        className='pb-8'
      >
        <View className="flex-1 bg-background dark:bg-darkMode-background p-4">
          <ScrollView>
            {transactions.filter(transaction => !transaction.removed).map((transaction, index, transaccions) => (
              <View
                className={`
                  flex-row
                  p-4
                  bg-surface
                  dark:bg-darkMode-surface
                  ${transaccions.length - 1 === index ? 'mb-24' : 'mb-1'}
                  rounded-md
                  border-divider
                  dark:border-darkMode-surface`}
                key={transaction.index}
              >
                <View className='flex-1 grow-[3] justify-between'>
                  <Tooltip title={transaction.description}>
                    <Text
                      className='text-lg pt-1 font-light leading-5 mb-4 text-onSurface dark:text-darkMode-onSurface'
                      numberOfLines={1}
                    >
                      {transaction.description}
                    </Text>
                  </Tooltip>
                  <View className='flex-row items-center'>
                    <Text className='text-sm font-light mr-2 text-onSurfaceVariant dark:text-darkMode-onSurfaceVariant'>
                      {transaction.date.toDateString()}
                    </Text>
                    <Text className='text-sm font-sans rounded-md bg-success pt-1 pb-1 pr-2 pl-2 text-onSurface'>
                      General
                    </Text>
                  </View>
                </View>
                <View className='flex flex-1 flex-col grow-[2] justify-between items-end'>
                    <Text
                      className={`text-xl ${transaction.amount > 0 ? 'text-success' : 'text-warning'} `}
                    >{formatNumber(transaction.amount.toString())}</Text>
                  <View className='flex-row'>
                    <Pressable
                      className='justify-center items-center p-2 active:opacity-20'
                      onPress={() => { editTransaction(transaction) }}
                    >
                      <Ionicons name={"create-outline"} size={28} color={colors.onSurface} className=''/>
                    </Pressable>
                    <Pressable
                      className='justify-center items-center p-2 pr-0 active:opacity-20'
                      onPress={() => removeTransaction(transaction.index)}
                    >
                      <Ionicons name={"close-circle-outline"} size={28} color={colors.error} className=''/>
                    </Pressable>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
          <PrimaryButton
            className={
            `
              ${false ? 'opacity-50' : 'opacity-100'}
              rounded-2xl
              items-center
              absolute
              bottom-10
              right-10
              left-10
              shadow-sm'
            `}
            onPress={() => {
              Alert.alert("Create Account", "This feature is not implemented yet")
            }}
            disabled={false}
            text={false ? t("confirming") : t("confirm")}
          />
        </View>
        <Snackbar
          visible={snackBarVisible}
          style={{
            backgroundColor: '#1D2430',
            alignItems: 'center',
            marginHorizontal: 16,
            borderRadius: 12,
          }}
          onDismiss={() => {setSnackBarVisible(false)}}
          duration={4000}
          action={{
            label: t("undo"),
            onPress: () => {
              undoRemoveTransaction()
              setSnackBarVisible(false)
            },
            textColor: '#FFFFFF'
          }}
        >
          <Text className='font-sans color-white'>{t("transactionRemoved")}</Text>
        </Snackbar>
      </CustomMainView>
    )
  }

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
          if (date) {
            setTransactionToEdit({...transactionToEdit, date: date} as Transaction);
          }
        },
        mode: 'date',
        is24Hour: true,
      });
    }
  }

  const editTransactionModal = () => {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <CustomSafeAreaView
          className='pr-10 pl-10 pt-10'
          screenWithHeader={hideBackButton}
        >
          {iosPicker()}

          <View className='p-4 flex-1'>
            <View className=''>
              <View className='mb-4'>
                <View className='rounded-xl overflow-hidden'>
                  <Input
                    value={transactionToEdit.amount.toString()}
                    label="Monto"
                    right={
                      <TextInput.Icon
                        onPress={() => {}}
                        icon={`${transactionToEdit.amount < 0 ? "minus" : "plus"}`}
                        color={transactionToEdit.amount < 0 ? colors.error : colors.success}
                      />}
                    keyboardType="numeric"
                    onChangeText={(value: any) => {
                      setTransactionToEdit({...transactionToEdit, amount: value ? parseFloat(value) : 0})
                    }}
                  />
                </View>
              </View>
              <View className='mb-4'>
                <Input value={transactionToEdit.description} keyboardType="email-address" label={"Descripcion"} />
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
                  open={open}
                  value={value}
                  items={items}
                  setOpen={setOpen}
                  setValue={setValue}
                  setItems={setItems}
                  placeholder={'Categoria'}
                />
              </View>
            </View>
            <PrimaryButton className='mt-4' onPress={() => {
              Alert.alert("Edit Transaction", "This feature is not implemented yet")
            }} text={"Guardar"} />
            <SecondaryButton className='mt-4' onPress={() => {
              setShowTransactionEditModal(false)
              setHideBackButton(false);
            }} text={"Cancelar"} />
          </View>
        </CustomSafeAreaView>
      </TouchableWithoutFeedback>
    )
  }

  return (
      showTransactionEditModal ? editTransactionModal() : transactionListPreview()
  )
}