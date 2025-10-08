import { currencyConvertor, currencyMap } from "@/currencyUtils";
import { getCrashlytics, setAttributes, setUserId } from '@react-native-firebase/crashlytics';
import { HeaderBackButton } from "@react-navigation/elements";
import { TransactionToDisplay } from "./types";

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function formatNegative(value: string, negative: boolean, currency: string): string {
  const currencyTool = currencyMap[currency]
  value = currencyTool.symbol+value
  if(negative){
    return "-"+value
  }else {
    return value
  }
}

export function headerSettings(
  navigation: any,
  colorScheme: any,
  title: string,
  hideBack: boolean,
  rest?: any
): void {
  navigation.setOptions({
    title: title,
    headerLeft: (props: any) => {
      return (
        hideBack ? <></> :
        <HeaderBackButton
          {...props}
          displayMode="minimal"
          onPress={() => navigation.goBack()}
        />
      )
    },
    headerShadowVisible: false,
    headerStyle: {
      backgroundColor: colorScheme === 'dark' ? '#1D2430' : '#F3F4F6', // usa tu paleta
    },
    headerTintColor: colorScheme === 'dark' ? '#EAECEE' : '#1D2430',
    ...(rest ?? {}),
  })
}

export function compareYearMonth(date1: Date, date2: Date): number {
  const val1 = date1.getFullYear() * 100 + date1.getMonth();
  const val2 = date2.getFullYear() * 100 + date2.getMonth();

  return val1 - val2; // negativo: date1 < date2, positivo: date1 > date2, 0: mismo año y mes
}

export function initAuthenticatedLogs(user: any) {
  const crashlytics = getCrashlytics();
  setUserId(crashlytics, user.uid.toString());
  setAttributes(crashlytics, {
    email: user.email,
    uuid: user.uid.toString(),
  });
  return crashlytics;
}

export function logger(msg: string, value?: any){
  if(value !== undefined){
    console.log(msg, value);
  }else{
    console.log(msg);
  }
  //getCrashlytics().log(msg);
}

export function errorLogger(msg: string, error?: string){
  /*getCrashlytics().log(msg);
  recordError(getCrashlytics(), new Error(error));*/
}

export function transformDisplayedTransactionToSavedTransaction(
  transaction: TransactionToDisplay,
  userSettings: any,
  currencyRatio: Record<string, number>
) {
  return {
    id: transaction.uuid,
    category: transaction.category,
    currency: userSettings["defaultCurrency"],
    date: transaction.date,
    description: transaction.description,
    amount: currencyConvertor(
      transaction.amount,
      transaction.currency,
      userSettings["defaultCurrency"],
      currencyRatio
    ),
  }
}