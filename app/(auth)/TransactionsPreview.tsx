import { PrimaryButton, SecondaryButton } from '@/components/buttons';
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
import { Alert, BackHandler, Platform, Pressable, ScrollView, Text, useColorScheme, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { Snackbar, TextInput } from 'react-native-paper';

type Transaction = {
  index: number;
  date: string;
  description: string;
  amount: string;
  removed: boolean;
};


export default function TransactionEdition() {

  // Use always to ensure the color scheme is applied correctly
  const colorScheme = useColorScheme();

  const navigation = useNavigation();
  const { t } = useTranslation();
  let { transactionsId } = useLocalSearchParams();
  transactionsId = transactionsId as string;
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [snackBarVisible, setSnackBarVisible] = useState(false);

  const [transactionToEdit, setTransactionToEdit] = useState<Transaction>({
    index: -1,
    date: '',
    description: '',
    amount: '',
    removed: true
  });

  const [showTransactionEditModal, setShowTransactionEditModal] = useState(false);

  const [lastIndexElementRemoved, setIndexLastElementRemoved] = useState<number | null>(null);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [transactionDate, setTransactionDate] = useState<Date>(new Date());

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
      "Sube tus imagenes",
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
      const responseTransactions = jsonOutput.transactions.map((transaction: Transaction, index: number) => {
        return {
          ...transaction,
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
    // readTransactions()
    // Simulate fetching transactions from a database
    const fetchedTransactions: Transaction[] = [
      { index: 0, date: '2023-10-02', description: 'Compra en tienda', amount: "50.0", removed: false },
      { index: 1, date: '2023-10-02', description: 'Pago de servicios', amount: "-30.0", removed: false },
      { index: 2, date: '2023-10-03', description: 'Transferencia recibida por una persona con muchas persona con muchas', amount: "100000", removed: false },
      { index: 3, date: '2023-10-02', description: 'Compra en tienda', amount: "50.0", removed: false },
      { index: 4, date: '2023-10-02', description: 'Pago de servicios', amount: "-30.0", removed: false },
      { index: 5, date: '2023-10-03', description: 'Transferencia recibida por una persona con muchas persona con muchas', amount: "100000", removed: false },
      { index: 6, date: '2023-10-02', description: 'Compra en tienda', amount: "50.0", removed: false },
      { index: 7, date: '2023-10-02', description: 'Pago de servicios', amount: "-30.0", removed: false },
      { index: 8, date: '2023-10-03', description: 'Transferencia recibida por una persona con muchas persona con muchas', amount: "100000", removed: false },
      { index: 9, date: '2023-10-02', description: 'Compra en tienda', amount: "50.0", removed: false },
      { index: 10, date: '2023-10-02', description: 'Pago de servicios', amount: "-30.0", removed: false },
      { index: 11, date: '2023-10-03', description: 'Transferencia recibida por una persona con muchas persona con muchas', amount: "100000", removed: false },
    ]
    setTransactions(fetchedTransactions);
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
            {transactions.filter(transaction => !transaction.removed).map((transaction) => (
              <View className="flex-row border p-4 bg-surfaceCard mb-4 rounded-2xl border-divider" key={transaction.index}>
                <View className='flex-1 grow-[3] justify-between'>
                  <Text className='text-lg font-light leading-6 mb-4 text-textPrimary'>{transaction.description}</Text>
                  <View className='flex-row items-center'>
                    <Text className='text-sm font-light mr-2 text-textSecondary'>{transaction.date}</Text>
                    <Text className='text-sm font-sans rounded-md bg-slate-400 pt-1 pb-1 pr-2 pl-2 text-textPrimary'>General</Text>
                  </View>
                </View>
                <View className='flex flex-1 flex-col grow-[2] justify-between items-end'>
                  <View className=''>
                    <Text
                      className={`font-bold text-2xl ${parseFloat(transaction.amount) > 0 ? 'text-success' : 'text-error'} `}
                    >{formatNumber(transaction.amount)}</Text>
                  </View>
                  <View className='flex-row'>
                    <Pressable
                      className='justify-center items-center p-2 active:opacity-20'
                      onPress={() => { editTransaction(transaction) }}
                    >
                      <Ionicons name={"create-outline"} size={28} color="#0057FF" className=''/>
                    </Pressable>
                    <Pressable
                      className='justify-center items-center p-2 pr-0 active:opacity-20'
                      onPress={() => removeTransaction(transaction.index)}
                    >
                      <Ionicons name={"close-circle-outline"} size={28} color="#5C677D" className=''/>
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
        value={transactionDate}
        onChange={(date) => setTransactionDate(date)}
        onClose={() => setShowDatePicker(false)}
      />;
    }
  }

  const displayDatePickerView = () => {
    if (Platform.OS === 'ios') {
      setShowDatePicker(true);
    } else {
      DateTimePickerAndroid.open({
        value: transactionDate,
        onChange: (event, date) => {
          if (date) {
            setTransactionDate(date);
          }
        },
        mode: 'date',
        is24Hour: true,
      });
    }
  }

  const editTransactionModal = () => {
    return (
      <CustomSafeAreaView
        className='pr-10 pl-10'
        screenWithHeader={hideBackButton}
      >
        {iosPicker()}

        <View className='p-4 flex-1 justify-center'>
          <View className=''>
            <View className='mb-4'>
              <View className='rounded-xl overflow-hidden'>
                <TextInput
                  mode="flat"
                  underlineStyle={{
                    backgroundColor: 'transparent',
                  }}
                  value={transactionToEdit.amount.toString()}
                  label="Monto"
                  right={<TextInput.Icon icon="minus" />}
                  keyboardType="numeric"
                  onChangeText={(value) => {
                    setTransactionToEdit({...transactionToEdit, amount: value ? value.toString() : ""})
                  }}
                />
              </View>
            </View>
            <View className='mb-4'>
              <Input value={"Descripcion del la transaccionn"} keyboardType="email-address" label={"Monto"} />
            </View>
            <View className=''>
              <Pressable
                className='
                  p-4
                  bg-surfaceCard
                  rounded-xl
                  border-divider
                  border
                '
                onPress={displayDatePickerView}
              >
                <Text className='text-xl font-light text-textPrimary'>{transactionToEdit.date}</Text>
              </Pressable>
            </View>
            <View className='mt-4'>
              <DropDownPicker
                  open={open}
                  value={value}
                  items={items}
                  setOpen={setOpen}
                  setValue={setValue}
                  setItems={setItems}
                  placeholder={'Choose a fruit.'}
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
    )
  }

  return (
    showTransactionEditModal ? editTransactionModal() : transactionListPreview()
  )
}