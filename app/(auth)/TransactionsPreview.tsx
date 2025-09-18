import { PrimaryButton } from '@/components/buttons';
import { CustomMainView } from '@/components/customMainView';
import { EditTransactionView } from '@/components/editTransactionModal';
import IOSDatePicker from '@/components/iosDatePicker';
import { cleanNumber } from '@/currencyMap';
import { formatNumber, headerSettings } from '@/utils';
import { Ionicons } from '@expo/vector-icons';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { doc, getDoc, getFirestore } from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, BackHandler, Keyboard, Platform, Pressable, ScrollView, Text, useColorScheme, View } from 'react-native';
import { Icon, Snackbar, Tooltip, useTheme } from 'react-native-paper';

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


export default function TransactionEdition() {

  // Use always to ensure the color scheme is applied correctly
  const colorScheme = useColorScheme();
  const { colors } = useTheme() as any;

  const navigation = useNavigation();
  const { t, i18n } = useTranslation();
  let { transactionsId, selectedCurrency } = useLocalSearchParams();
  transactionsId = transactionsId as string;
  selectedCurrency = selectedCurrency as string;

  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // States to handle the undo snackbar when removing a transaction
  const [snackBarVisible, setSnackBarVisible] = useState(false);
  const [lastIndexElementRemoved, setIndexLastElementRemoved] = useState<number | null>(null);

  const [transactionToEdit, setTransactionToEdit] = useState<Transaction>(null as any);
  
  const [modalOpened, setModalOpened] = useState<boolean>(false);
  const [mapCategories, setMapCategories] = useState<Categories>({});

  const [filteredDate, setFilteredDate] = useState<Date | null>(new Date("2025-08-20"));
  const [pickerFilteredDate, setPickerFilteredDate] = useState<Date | null>(new Date("2025-08-20"));
  const [showDatePicker, setShowDatePicker] = useState(false);

  const getCategoryInfo = (key: string) => {
    return mapCategories[key as keyof typeof mapCategories];
  }

  const getCurrentMonth = () => {
    if(!filteredDate) return null;
    const locale: Record<string, string> = {
      "en": 'en-US',
      "es": 'es-ES'
    }
    const formatter = new Intl.DateTimeFormat(locale[i18n.language], {
      month: "short", // "Jan", "Feb", ..., "Dec"
      year: "numeric"
    });
    let result = formatter.format(filteredDate);
    result = result.charAt(0).toUpperCase() + result.slice(1);
    return result;
  }


  const displayDatePickerView = () => {
    Keyboard.dismiss();
    if (Platform.OS === 'ios') {
      setShowDatePicker(true);
    } else {
      DateTimePickerAndroid.open({
        value: filteredDate || new Date(),
        onChange: (event, date) => {
          if(date)setFilteredDate(date);
        },
        mode: 'date',
        is24Hour: true,
      });
    }
  }

  const iosPicker = () => {
    if (Platform.OS == 'ios' && showDatePicker) {
      return <IOSDatePicker
        value={pickerFilteredDate || new Date()}
        onChange={(date) => {
          setPickerFilteredDate(date);
        }}
        onClose={() => {
          console.log("Closing date picker", filteredDate)
          setShowDatePicker(false)
          setPickerFilteredDate(filteredDate);
        }}
        onButtonPress={() => {
          setShowDatePicker(false)
          setFilteredDate(pickerFilteredDate);
        }}
        buttonName={t("filter")}
        displayCloseButton={true}
      />;
    }
  }


  useLayoutEffect(() => headerSettings(
      navigation,
      colorScheme,
      t("transactions"),
      {
        headerShown: !modalOpened,
        gestureEnabled: !modalOpened,
        headerRight: () => {
          const currentDate = getCurrentMonth();
          if (!currentDate) {
            return null;
          } else {
            return (
              <Pressable onPress={() => displayDatePickerView()}>
                <View className='
                  flex-row
                  items-center
                  bg-primary
                  rounded-full p-2 pr-3 pl-3'
                >
                  <Text className='text-onPrimary mr-1'>{`${currentDate}`}</Text>
                  <Icon
                    source="arrow-down-drop-circle"
                    color={colors.onPrimary}
                    size={20}
                  />
                </View>
              </Pressable>
            );
          }
      }
      },
    ), [navigation, colorScheme, modalOpened, filteredDate]
  );

  const filterTransactionsByDate = () => {
    return transactions.filter((transaction) => {
      if(!filteredDate) return true;
      return (
        transaction.date.getFullYear() === filteredDate.getFullYear() &&
        transaction.date.getMonth() === filteredDate.getMonth()
      );
    });
  }

  const readTransactions = async () => {
    console.log("Reading transactions from Firestore...");
    const db = getFirestore();

    const docRef = doc(db, "analysis_requirement", transactionsId);
    const docSnap = await getDoc(docRef);

    const categoriesRef = doc(db, "categories", "cP2dsMNnTfqK8EeG9Ai6");
    const categoriesSnap = await getDoc(categoriesRef);
    if(categoriesSnap.exists()){
      const categoriesData = categoriesSnap.data();
      let categories: Categories = categoriesData as Categories;
      setMapCategories(categories);
    }

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
      let responseTransactions = jsonOutput.transactions.map((transaction: any, index: number) => {
        return {
          ...transaction,
          date: new Date(transaction.date),
          negative: transaction.amount < 0,
          numberAmount: cleanNumber(Math.abs(transaction.amount).toString(), selectedCurrency, selectedCurrency),
          index: index,
          category: "1",
          currency: selectedCurrency,
        };
      })
      setTransactions(responseTransactions);
    } else {
      console.log("No such document!");
    }

  }

  const removeTransaction = (index: number) => {
    setTransactions(prevTransactions => {
      const newTransactions = [...prevTransactions];
      newTransactions[index].removed = true; // Mark the transaction as removed
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

  const getTransactions = () => {
    return transactions.filter(t => !t.removed).filter(t => {
      if(!filteredDate) return true;
      return (
        t.date.getFullYear() === filteredDate.getFullYear() &&
        t.date.getMonth() === filteredDate.getMonth()
      );
    });
  }

  const getUniqueSortedDates = () => {
      let notRemovedTransactions = getTransactions()
      .map(t => t.date.toDateString())
      .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())

      let uniqueSortedDates = notRemovedTransactions.filter((s, i) => notRemovedTransactions.indexOf(s) === i);
      return uniqueSortedDates
  }

  const getGroupedTransactions = () => {
    let notRemovedTransactions = getTransactions()
    let groupedTransactions =  notRemovedTransactions.reduce((groups: any, transaction) => {
      const date = transaction.date.toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(transaction);
      return groups;
    }, {});
    return groupedTransactions;
  }

  useEffect(() => {
    console.log("Read transactions effect");
    readTransactions()
  }, [filteredDate]);

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
        {iosPicker()}
        <View className="flex-1 bg-background dark:bg-darkMode-background p-4">
          <ScrollView>
            {getUniqueSortedDates().map((date, dateIndex, dates) => (
              <View key={dateIndex} className={`${dates.length - 1 === dateIndex ? 'mb-24' : 'mb-6'}`}>
                <Text className='text-sm font-light mr-2 mb-2 text-onSurfaceVariant dark:text-darkMode-onSurfaceVariant'>
                  {date}
                </Text>
                {getGroupedTransactions()[date].map((transaction: Transaction) => (
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
                        <Text
                          style={{
                            backgroundColor: getCategoryInfo(transaction.category).color
                          }}
                          className={`text-xs font-sans rounded-md pt-1 pb-1 pr-2 pl-2 text-onSurface`}
                        >
                          {t(getCategoryInfo(transaction.category).value)}
                        </Text>
                      </View>
                    </View>
                    <View className='flex-1 flex-col items-end mt-4 mb-4 pr-4'>
                        <Text
                            className={`text-xl ${!transaction.negative ? 'text-success' : 'text-warning'}`}
                          >
                            {formatNumber(transaction.numberAmount, transaction.negative)}
                        </Text>
                        <Text className='text-sm text-onSurface dark:text-darkMode-onSurface'>{transaction.currency}</Text>
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
        transactionToEditDefault={transactionToEdit}
        colors={colors}
        mapCategories={mapCategories}
        hideBackButton={true}
        onSaveEditTransaction={(transaction: Transaction) => {
          transactions[transaction.index] = transaction;
          setTransactions(transactions)
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