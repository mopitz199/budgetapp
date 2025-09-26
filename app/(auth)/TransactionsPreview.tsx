import { PrimaryButton } from '@/components/buttons';
import { CustomMainView } from '@/components/customMainView';
import TransactionListEditor from '@/components/transactionList';
import { currencyConvertor, currencyMap, formatNumberToDisplay } from '@/currencyUtils';
import type { TransactionToDisplay } from "@/types";
import { headerSettings } from '@/utils';
import { getAuth } from '@react-native-firebase/auth';
import { collection, doc, getDoc, getDocs, getFirestore } from '@react-native-firebase/firestore';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect, useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, useColorScheme } from 'react-native';
import uuid from 'react-native-uuid';
 
export default function TransactionEdition() {

  const [transactions, setTransactions] = useState<TransactionToDisplay[]>([]);

  const { t } = useTranslation();
  const auth = getAuth()
  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  // Get parameters from the route
  let { transactionsId, selectedCurrency } = useLocalSearchParams();
  transactionsId = transactionsId as string;
  selectedCurrency = selectedCurrency as string;

  useLayoutEffect(() => headerSettings(
      navigation,
      colorScheme,
      t("transactions"),
    ), [navigation, colorScheme]
  );

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
          stringAmount: formatNumberToDisplay(Math.abs(transaction.amount).toString(), selectedCurrency, selectedCurrency),
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