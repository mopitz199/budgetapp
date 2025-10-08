import { CustomMainView } from "@/components/customMainView";
import IOSDatePicker from "@/components/iosDatePicker";
import TransactionListEditor from "@/components/transactionList";
import { useCurrencyRatioContext, useUserSettingContext } from "@/contexts/UserAuthenticatedContext";
import { formatNumberToDisplay } from "@/currencyUtils";
import { TransactionToDisplay } from "@/types";
import { compareYearMonth, headerSettings, transformDisplayedTransactionToSavedTransaction } from "@/utils";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { getAuth } from '@react-native-firebase/auth';
import { doc, getDoc, getFirestore, setDoc } from "@react-native-firebase/firestore";
import { useNavigation } from "expo-router";
import { useEffect, useLayoutEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Keyboard, Platform, Pressable, Text, useColorScheme, View } from "react-native";
import { Icon, useTheme } from "react-native-paper";

export default function Transactions() {

  const [transactions, setTransactions] = useState<TransactionToDisplay[]>([]);
  const [filteredDate, setFilteredDate] = useState<Date>(new Date("2025-08-20"));
  const [pickerFilteredDate, setPickerFilteredDate] = useState<Date>(new Date("2025-08-20"));
  const [showDatePicker, setShowDatePicker] = useState(false);

  const auth = getAuth()
  const { t, i18n } = useTranslation();
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const userSettings = useUserSettingContext();
  const currencyRatio = useCurrencyRatioContext();
  const { colors } = useTheme() as any;

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

  const readTransactions = async () => {
    let transactions: TransactionToDisplay[] = [];
    const db = getFirestore();
    const user = auth.currentUser;
    const docRef = doc(db, "user_transactions", user?.uid || "");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const jsonOutput = docSnap.data();
      let index = 0;
      for (const transactionUUID in jsonOutput) {
        if (jsonOutput.hasOwnProperty(transactionUUID)) {
          const transaction = jsonOutput[transactionUUID];
          if(compareYearMonth(transaction.date.toDate(), filteredDate) == 0){
            transactions.push({
              uuid: transactionUUID,
              amount: transaction.amount,
              description: transaction.description,
              date: transaction.date.toDate(),
              removed: false,
              negative: transaction.amount < 0,
              stringAmount: formatNumberToDisplay(Math.abs(transaction.amount).toString(), transaction.currency, transaction.currency),
              index: index,
              category: transaction.category,
              currency: transaction.currency,
            });
            index += 1;
          }
        }      
      }
      setTransactions(transactions);
    }
  }

  const saveEditedTransaction = async (editedTransaction: TransactionToDisplay) => {
    const db = getFirestore();
    const user = auth.currentUser;
    const docRef = doc(db, "user_transactions", user?.uid || "");
    
    const transactionToSave = transformDisplayedTransactionToSavedTransaction(
      editedTransaction,
      editedTransaction.currency,
      currencyRatio
    )
    await setDoc(docRef, transactionToSave, { merge: false });
    console.log("Transaction saved", transactionToSave);
  }

  useEffect(() => {
    readTransactions()
  }, [filteredDate]);

  useLayoutEffect(() => headerSettings(
      navigation, colorScheme, t("transactions"), true,
      {
        headerShown: true,
        gestureEnabled: true,
        headerRight: () => {
          const currentDate = getCurrentMonth();
          if (!currentDate) {
            return null;
          } else {
            return (
              <Pressable
                className="mr-4"
                onPress={() => displayDatePickerView()}
              >
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
    ), [navigation, colorScheme, filteredDate]
  );

  return (
    <CustomMainView
      screenWithHeader={true}
    >
      {iosPicker()}
      <TransactionListEditor
        transactions={transactions}
        onSaveEditTransaction={(editedTransaction) => saveEditedTransaction(editedTransaction)}
        setTransactions={setTransactions}
        floatButton={null}
        allowCurrencySelection={false}
      />
    </CustomMainView>
  );
}