import { HeaderBackButton } from "@react-navigation/elements";

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function formatNegative(value: string, negative: boolean): string {
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