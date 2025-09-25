import { PrimaryButton } from '@/components/buttons';
import { CustomMainView } from '@/components/customMainView';
import IOSDatePicker from '@/components/iosDatePicker';
import TransactionListEditor from '@/components/transactionList';
import { currencyMap, formatNumber } from '@/currencyMap';
import type { Transaction } from "@/types";
import { currencyConvertor, headerSettings } from '@/utils';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { getAuth } from '@react-native-firebase/auth';
import { collection, doc, getDoc, getDocs, getFirestore } from '@react-native-firebase/firestore';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect, useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Keyboard, Platform, Pressable, Text, useColorScheme, View } from 'react-native';
import { Icon, useTheme } from 'react-native-paper';
import uuid from 'react-native-uuid';
 
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

  const getCurrencyConvertorValues = async () => {
    const db = getFirestore();
    const collectionRef = collection(db, "currency_conversion");
    const docSnap = await getDocs(collectionRef);

    let conversionMap: Record<string, number> = {};

    docSnap.forEach((doc) => {
      conversionMap[`${doc.id}`] = doc.data().value;
    });
    return conversionMap;
  }

  const getUserSettings = async () => {
    const user = auth.currentUser;

    if(!user){
      Alert.alert(t("error"), "User not authenticated");
      return
    }

    const db = getFirestore();
    const docRef = doc(db, "user_settings", user.uid);
    const docSnap = await getDoc(docRef); 

    if(docSnap.exists()){
      const userSettings = docSnap.data();
      return userSettings;
    }else{
      Alert.alert(t("error"), "User settings not foundd");
      return
    }
  }

  const readTransactions = async () => {
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
          amount: transaction.amount,
          stringAmount: formatNumber(Math.abs(transaction.amount).toString(), selectedCurrency, selectedCurrency),
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
    const conversionMap = await getCurrencyConvertorValues();
    const userSettings = await getUserSettings();
    if(!userSettings) return;

    const user = auth.currentUser;
    const db = getFirestore();

    const transactionsToSave = {} as Record<string, any>;
    
    transactions.filter(t => !t.removed).forEach(t => {
      let id = uuid.v4()
      transactionsToSave[id] = {
        id: id,
        category: t.category,
        currency: userSettings["defaultCurrency"],
        date: t.date,
        description: t.description,
        amount: currencyConvertor(t.amount, t.currency, userSettings["defaultCurrency"], conversionMap).toFixed(currencyMap[t.currency]),
      }
    })

    await db.collection("user_transactions").doc(user?.uid).set(transactionsToSave)
  }

  useEffect(() => {
    console.log("Read transactions effectt");
    readTransactions()
  }, []);

  return (
    <CustomMainView
      screenWithHeader={true}
      className='flex-1 pb-8'
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