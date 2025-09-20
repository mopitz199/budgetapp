import { PrimaryButton } from '@/components/buttons';
import { CustomMainView } from '@/components/customMainView';
import IOSDatePicker from '@/components/iosDatePicker';
import TransactionListEditor from '@/components/transactionList';
import { formatNumber } from '@/currencyMap';
import type { Transaction } from "@/types";
import { headerSettings } from '@/utils';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { getAuth } from '@react-native-firebase/auth';
import { doc, getDoc, getFirestore } from '@react-native-firebase/firestore';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect, useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Keyboard, Platform, Pressable, Text, useColorScheme, View } from 'react-native';
import { Icon, useTheme } from 'react-native-paper';
 
export default function TransactionEdition() {

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredDate, setFilteredDate] = useState<Date | null>(new Date("2025-08-20"));
  const [pickerFilteredDate, setPickerFilteredDate] = useState<Date | null>(new Date("2025-08-20"));
  const [showDatePicker, setShowDatePicker] = useState(false);

  const { t, i18n } = useTranslation();
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const { colors } = useTheme() as any;

  let { transactionsId, selectedCurrency } = useLocalSearchParams();
  transactionsId = transactionsId as string;
  selectedCurrency = selectedCurrency as string;

  const auth = getAuth()

  useLayoutEffect(() => headerSettings(
      navigation,
      colorScheme,
      t("transactions"),
      {
        headerShown: true,
        gestureEnabled: true,
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
    ), [navigation, colorScheme, filteredDate]
  );

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
          if(date)setFilteredDate((prevDate) => {
            return date
          });
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
          setFilteredDate((prevDate) => {
            return pickerFilteredDate;
          });
        }}
        buttonName={t("filter")}
        displayCloseButton={true}
      />;
    }
  }

  const readTransactions = async () => {
    console.log("Reading transactions from Firestore...");
    const db = getFirestore();

    const docRef = doc(db, "analysis_requirement", transactionsId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const jsonOutput = docSnap.data()?.json_output;
      let responseTransactions = jsonOutput.transactions.map((transaction: any, index: number) => {
        return {
          description: transaction.description,
          date: new Date(transaction.date),
          negative: transaction.amount < 0,
          removed: false,
          numberAmount: formatNumber(Math.abs(transaction.amount).toString(), selectedCurrency, selectedCurrency),
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

  const saveTransactions = async () => {
    const user = auth.currentUser;
    const db = getFirestore();
    await db.collection("user_transactions").doc(user?.uid).set({
      "transactions": transactions.filter(t => !t.removed).map(t => ({
        category: t.category,
        currency: t.currency,
        date: t.date,
        description: t.description,
        negative: t.negative,
        numberAmount: t.numberAmount,
      }))
    });
    console.log("user", user?.uid)
  }

  useEffect(() => {
    console.log("Read transactions effect");
    readTransactions()
  }, []);

  return (
    <CustomMainView
      screenWithHeader={true}
      className='pb-8'
    >
      {iosPicker()}
      <TransactionListEditor
        transactions={transactions}
        setTransactions={setTransactions}
        floatButton={
          <PrimaryButton
            className={`${false ? 'opacity-50' : 'opacity-100'} rounded-2xl items-center absolute bottom-10 right-10 left-10 shadow-sm'`}
            onPress={() => saveTransactions()}
            disabled={false}
            text={false ? t("confirming") : t("confirm")}
          />
        }
      />
    </CustomMainView>
  )


}