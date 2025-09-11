import { PrimaryButton } from '@/components/buttons';
import { CustomMainView } from '@/components/customMainView';
import { EditTransactionView } from '@/components/editTransactionModal';
import { cleanNumber } from '@/currencyMap';
import { formatNumber, headerSettings } from '@/utils';
import { Ionicons } from '@expo/vector-icons';
import { doc, getDoc, getFirestore } from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, BackHandler, Pressable, ScrollView, Text, useColorScheme, View } from 'react-native';
import { Snackbar, Tooltip, useTheme } from 'react-native-paper';

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


export default function TransactionEdition() {

  // Use always to ensure the color scheme is applied correctly
  const colorScheme = useColorScheme();
  const { colors } = useTheme() as any;

  const navigation = useNavigation();
  const { t } = useTranslation();
  let { transactionsId, selectedCurrency } = useLocalSearchParams();
  transactionsId = transactionsId as string;
  selectedCurrency = selectedCurrency as string;

  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const [groupedTransactions, setGroupedTransactions] = useState<{ [key: string]: Transaction[] }>({});
  const [sortedDates, setSortedDates] = useState<string[]>([]);

  // States to handle the undo snackbar when removing a transaction
  const [snackBarVisible, setSnackBarVisible] = useState(false);
  const [lastIndexElementRemoved, setIndexLastElementRemoved] = useState<number | null>(null);

  const [transactionToEdit, setTransactionToEdit] = useState<Transaction>(null as any);
  
  const [modalOpened, setModalOpened] = useState<boolean>(false);

  const [items, setItems] = useState([
      {label: 'GENERAL', value: 'GENERAL'},
      {label: 'COSTOS FIJOS', value: 'COSTOS FIJOS'},
      {label: 'OCIO', value: 'OCIO'},
      {label: 'EMERGENCIA', value: 'EMERGENCIA'},
      {label: 'SUELDO', value: 'SUELDO'},
      {label: 'OTROS INGRESOS', value: 'OTROS INGRESOS'},
      {label: 'OTROS GASTOS', value: 'OTROS GASTOS'},
  ]);

  useLayoutEffect(() => headerSettings(
      navigation,
      colorScheme,
      t("verifyYourTransactions"),
      {
        headerShown: !modalOpened,
        gestureEnabled: !modalOpened,
      }
    ), [navigation, colorScheme, modalOpened]
  );


  const readTransactions = async () => {
    const db = getFirestore();
    const docRef = doc(db, "analysis_requirement", transactionsId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const jsonOutput = docSnap.data()?.json_output;
      /*const jsonOutput = {
        "transactions": [
          {"amount": -2425693.2, "date": "2025-08-28", "description": "Paypal *uber bv compras int.vi"},
          {"amount": 2425693.2, "date": "2025-08-28", "description": "Paypal *uber bv compras int.vi"},
          {"amount": -2238.58, "date": "2025-08-28", "description": "Paypal temu 35314369001 ie"},
          {"amount": 2238.58, "date": "2025-08-28", "description": "Paypal temu 35314369001 ie"},
          {"amount": 20.79, "date": "2025-08-28", "description": "Paypal temu 35314369001 ie"},
          {"amount": -20.79, "date": "2025-08-28", "description": "Paypal temu 35314369001 ie"},
          {"amount": -2.22, "date": "2025-08-28", "description": "Paypal uber bv 35314369001 nl"},
          {"amount": 2.22, "date": "2025-08-28", "description": "Paypal uber bv 35314369001 nl"},
          {"amount": -0.35, "date": "2025-08-28", "description": "Paypal spotifyp39ff89 35314369001 gb"},
          {"amount": 0.35, "date": "2025-08-28", "description": "Paypal spotifyp39ff89 35314369001 gb"}
        ]
      }*/

      /*const jsonOutput = {
        "transactions": [
          {"amount": 2425693, "date": "2025-08-28", "description": "Paypal *uber bv compras int.vi"},
          {"amount": -2425693, "date": "2025-08-28", "description": "Paypal *uber bv compras int.vi"},
          {"amount": -2238, "date": "2025-08-28", "description": "Paypal temu 35314369001 ie"},
          {"amount": 2238, "date": "2025-08-28", "description": "Paypal temu 35314369001 ie"},
          {"amount": 20, "date": "2025-08-28", "description": "Paypal temu 35314369001 ie"},
          {"amount": -20, "date": "2025-08-28", "description": "Paypal temu 35314369001 ie"},
          {"amount": -2.23, "date": "2025-08-28", "description": "Paypal uber bv 35314369001 nl"},
          {"amount": 2.23, "date": "2025-08-28", "description": "Paypal uber bv 35314369001 nl"},
        ]
      }*/
      // console.log(jsonOutput)
      const responseTransactions = jsonOutput.transactions.map((transaction: any, index: number) => {
        return {
          ...transaction,
          date: new Date(transaction.date),
          negative: transaction.amount < 0,
          numberAmount: cleanNumber(Math.abs(transaction.amount).toString(), selectedCurrency, selectedCurrency),
          index: index,
          category: 'GENERAL',
          currency: selectedCurrency,
        };
      });
      setTransactions(responseTransactions);
      groupTransactionsByDate(responseTransactions);
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
    setModalOpened(true);
    setTransactionToEdit(transaction);
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

  const groupTransactionsByDate = (transactions: Transaction[]) => {
    let sortedDates = transactions
      .map(t => t.date.toDateString())
      .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())


    let uniqueSortedDates = sortedDates.filter((s, i) => sortedDates.indexOf(s) === i);

    let groupedDates =  transactions.reduce((groups: any, transaction) => {
      const date = transaction.date.toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(transaction);
      return groups;
    }, {});
    setGroupedTransactions(groupedDates);
    setSortedDates(uniqueSortedDates);
  }

  useEffect(() => {
    readTransactions()
  }, []);

  useEffect(() => {
    if(!modalOpened) return;

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        // 🔒 Evita salir de la pantalla mientras el modal está activo
        return true;
      }
    );
    return () => backHandler.remove();
  }, [modalOpened]);


  const transactionListPreview = () => {
    return (
      <CustomMainView
        screenWithHeader={modalOpened}
        className='pb-8'
      >
        <View className="flex-1 bg-background dark:bg-darkMode-background p-4">
          <ScrollView>
            {sortedDates.map((date, dateIndex, dates) => (
              <View key={dateIndex} className={`${dates.length - 1 === dateIndex ? 'mb-24' : 'mb-6'}`}>
                <Text className='text-sm font-light mr-2 mb-2 text-onSurfaceVariant dark:text-darkMode-onSurfaceVariant'>
                  {date}
                </Text>
                {groupedTransactions[date].map((transaction, index, transaccions) => (
                  <View
                    className={`
                      flex-row
                      bg-surface
                      dark:bg-darkMode-surface
                      rounded-md
                      border-divider
                      dark:border-darkMode-surface
                      mb-2`}
                    key={transaction.index}
                  >
                    <View className='flex-1 grow-[2] justify-between mt-4 mb-4 ml-4'>
                      <Tooltip title={transaction.description}>
                        <Text
                          className='text-lg pt-1 font-light leading-5 mb-4 text-onSurface dark:text-darkMode-onSurface'
                          numberOfLines={1}
                        >
                          {transaction.description}
                        </Text>
                      </Tooltip>
                      <View className='items-start'>
                        <Text className='text-xs font-sans rounded-md bg-success pt-1 pb-1 pr-2 pl-2 text-onSurface'>
                          {transaction.category}
                        </Text>
                      </View>
                    </View>
                    <View className='flex-1 flex-col items-end mt-4 mb-4 pr-4'>
                      <Text
                          className={`text-lg ${!transaction.negative ? 'text-success' : 'text-warning'} `}
                        >
                          {formatNumber(transaction.numberAmount, transaction.negative)}
                        </Text>
                    </View>
                    <View className='flex-col justify-between items-end'>
                      <Pressable
                        className='flex-1 justify-center items-center px-4 active:opacity-20 border-l border-b border-background dark:border-darkMode-background'
                        onPress={() => { editTransaction(transaction) }}
                      >
                        <Ionicons name={"create-outline"} size={22} color={colors.onSurface} className=''/>
                      </Pressable>
                      <Pressable
                        className='flex-1 justify-center items-center px-4 active:opacity-20 border-l border-background dark:border-darkMode-background'
                        onPress={() => removeTransaction(transaction.index)}
                      >
                        <Ionicons name={"trash"} size={22} color={colors.error} className=''/>
                      </Pressable>
                    </View>
                  </View>
                ))}
              </View>
            ))}
          </ScrollView>
          <PrimaryButton
            className={`${false ? 'opacity-50' : 'opacity-100'} rounded-2xl items-center absolute bottom-10 right-10 left-10 shadow-sm'`}
            onPress={() => {Alert.alert("Create Account", "This feature is not implemented yet") }}
            disabled={false}
            text={false ? t("confirming") : t("confirm")}
          />
        </View>
        <Snackbar
          visible={snackBarVisible}
          style={{
            backgroundColor: colors.warning,
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
            textColor: colors.onSurfaceDarkText
          }}
        >
          <Text className='font-sans color-onSurfaceDarkText'>{t("transactionRemoved")}</Text>
        </Snackbar>
      </CustomMainView>
    )
  }

  const editTransactionModal = () => {
    return (
      <EditTransactionView
        modalOpened={modalOpened}
        colors={colors}
        categories={items}
        setCategories={setItems}
        transactionToEditDefault={transactionToEdit}

        onSaveEditTransaction={(transaction: Transaction) => {
          transactions[transaction.index] = transaction;
          setTransactions(transactions)
          groupTransactionsByDate(transactions);
          setModalOpened(false);
        }}
        onCancelEditTransaction={() => {
          setModalOpened(false);
        }}
      />
    )
  }

  return (
      modalOpened ? editTransactionModal() : transactionListPreview()
  )
}