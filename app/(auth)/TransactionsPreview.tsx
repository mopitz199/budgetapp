import { formatNumber } from '@/utils';
import { Ionicons } from '@expo/vector-icons';
import { doc, getDoc, getFirestore } from '@react-native-firebase/firestore';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Pressable, SafeAreaView, ScrollView, Text, View } from 'react-native';

type Transaction = {
  date: string;
  description: string;
  amount: number;
  type?: 'expense' | 'income'; // Optional type field
};


export default function TransactionEdition() {
  let { transactionsId } = useLocalSearchParams();
  transactionsId = transactionsId as string;
  const [transactions, setTransactions] = useState<Transaction[]>([]);


  const readTransactions = async () => {
    const db = getFirestore();
    const docRef = doc(db, "analysis_requirement", transactionsId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const jsonOutput = docSnap.data()?.json_output;
      const responseTransactions = jsonOutput.transactions as Transaction[]
      setTransactions(responseTransactions);
      // setTransactions(docSnap.data()?.json_output as Transaction[]);
      //debugger;
      console.log("Document data:", docSnap.data());
    } else {
      // docSnap.data() will be undefined in this case
      console.log("No such document!");
    }

  }

  useEffect(() => {
    // readTransactions()
    // Simulate fetching transactions from a database
    const fetchedTransactions: Transaction[] = [
      { date: '2023-10-01', description: 'Compra en tienda', amount: 50.0, type: 'expense' },
      { date: '2023-10-02', description: 'Pago de servicios', amount: -30.0, type: 'expense'},
      { date: '2023-10-03', description: 'Transferencia recibida por una persona con muchas persona con muchas', amount: 100000, type: 'income' },
    ]
    setTransactions(fetchedTransactions);
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-backgroundPrimary">
      <Text>Transaction List Preview</Text>
      <View className="flex-1 bg-background p-4">
        <ScrollView>
          {transactions.map((transaction, index) => (
            <View className="flex-row border p-4 bg-surfaceCard mb-4 rounded-2xl border-divider" key={index}>
              <View className=' flex-1 grow-[3] justify-between'>
                <Text className='text-lg font-light leading-6 mb-4 text-primaryTextOverLight'>{transaction.description}</Text>
                <View className='flex-row items-center'>
                  <Text className='text-sm font-light mr-2 text-secondaryTextOverLight'>{transaction.date}</Text>
                  <Text className='text-sm font-sans rounded-md bg-slate-400 pt-1 pb-1 pr-2 pl-2 text-primaryTextOverColorOrDark'>General</Text>
                </View>
              </View>
              <View className=' flex flex-1 flex-col grow-[2] justify-between items-end'>
                <View className=''>
                  <Text
                    className={`font-sans text-xl mb-2 ${transaction.amount > 0 ? 'text-success' : 'text-error'} `}
                  >{formatNumber(transaction.amount)}</Text>
                </View>
                <View className='flex-row '>
                  <Pressable
                    className='justify-center items-center p-2 active:opacity-20'
                    onPress={() => {Alert.alert("Edit Transaction", "This feature")}}
                  >
                    <Ionicons name={"create-outline"} size={28} color="#0057FF" className=''/>
                  </Pressable>
                  <Pressable
                    className='justify-center items-center p-2 pr-0 active:opacity-20'
                    onPress={() => {Alert.alert("Remove Transaction", "This feature")}}
                  >
                    <Ionicons name={"close-circle-outline"} size={28} color="#5C677D" className=''/>
                  </Pressable>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}