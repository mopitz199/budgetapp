import { EditTransactionView } from '@/components/editTransactionModal';
import { formatNegative, headerSettings } from '@/utils';
import { Ionicons } from '@expo/vector-icons';
import { doc, getDoc, getFirestore } from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, BackHandler, Pressable, ScrollView, Text, useColorScheme, View } from 'react-native';
import { Snackbar, Tooltip, useTheme } from 'react-native-paper';

import type { Categories, Transaction } from "@/types";

type Props = {
  transactions: Transaction[];
  setTransactions: (transactions: Transaction[]) => void;
  floatButton: any;
};

export default function TransactionListEditor({
  transactions,
  setTransactions,
  floatButton,
}: Props) {

  // Use always to ensure the color scheme is applied correctly
  const colorScheme = useColorScheme();
  const { colors } = useTheme() as any;

  const navigation = useNavigation();
  const { t, i18n } = useTranslation();
  let { transactionsId, selectedCurrency } = useLocalSearchParams();
  transactionsId = transactionsId as string;
  selectedCurrency = selectedCurrency as string;

  // States to handle the undo snackbar when removing a transaction
  const [snackBarVisible, setSnackBarVisible] = useState(false);
  const [lastIndexElementRemoved, setIndexLastElementRemoved] = useState<number | null>(null);

  const [transactionToEdit, setTransactionToEdit] = useState<Transaction>(null as any);
  
  const [modalOpened, setModalOpened] = useState<boolean>(false);

  const [mapCategories, setMapCategories] = useState<Categories>({});

  const getCategoryInfo = (key: string) => {
    return mapCategories[key as keyof typeof mapCategories];
  }

  const readCategories = async () => {
    const db = getFirestore();
    let categories: Categories = {};
    const categoriesRef = doc(db, "categories", "cP2dsMNnTfqK8EeG9Ai6");
    const categoriesSnap = await getDoc(categoriesRef);
    if(categoriesSnap.exists()){
      const categoriesData = categoriesSnap.data();
      categories = categoriesData as Categories;
    }
    setMapCategories(categories);
  }

  useLayoutEffect(() => headerSettings(
      navigation,
      colorScheme,
      t("transactions"),
      {
        headerShown: !modalOpened,
        gestureEnabled: !modalOpened,
      },
    ), [navigation, colorScheme, modalOpened]
  );

  const removeTransaction = (index: number) => {
    const newTransactions = [...transactions];
    newTransactions[index].removed = true; // Mark the transaction as removed
    setTransactions(newTransactions);
    setIndexLastElementRemoved(index);
    setSnackBarVisible(true);
  }

  const editTransaction = (transaction: Transaction) => {
    setModalOpened(true);
    setTransactionToEdit(transaction);
  }

  const undoRemoveTransaction = () => {
    if (lastIndexElementRemoved !== null) {
      const newTransactions = [...transactions];
      newTransactions[lastIndexElementRemoved].removed = false; // Mark the transaction as restored
      setTransactions(newTransactions);
      setIndexLastElementRemoved(null);
    }
  }

  const getTransactions = () => {
    return transactions.filter(t => !t.removed)
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
    readCategories()
    console.log("Read transactions effect");
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
      <View
        className='flex-1'
      >
        <View className="flex-1 bg-background dark:bg-darkMode-background p-4">
          <ScrollView>
            {getUniqueSortedDates().map((date, dateIndex, dates) => (
              <View key={dateIndex} className={`${dates.length - 1 === dateIndex && floatButton ? 'mb-24' : 'mb-6'}`}>
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
                            {formatNegative(transaction.stringAmount, transaction.negative)}
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
          {floatButton? floatButton : null}
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
      </View>
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
    mapCategories && Object.keys(mapCategories).length === 0 ? (
        <ActivityIndicator size="large" color="#FFFFFF" />
      ) : modalOpened ? editTransactionModal() : transactionListPreview()
  )
}