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

export function headerSettings(navigation: any, colorScheme: any, title: string, rest?: any): void {
  return navigation.setOptions({
    title: title,
    headerStyle: {
      backgroundColor: colorScheme === 'dark' ? '#1D2430' : '#F3F4F6', // usa tu paleta
    },
    headerTintColor: colorScheme === 'dark' ? '#EAECEE' : '#1D2430',
    headerShadowVisible: false,
    ...(rest ?? {}),
  })
}

export function compareYearMonth(date1: Date, date2: Date): number {
  const val1 = date1.getFullYear() * 100 + date1.getMonth();
  const val2 = date2.getFullYear() * 100 + date2.getMonth();

  return val1 - val2; // negativo: date1 < date2, positivo: date1 > date2, 0: mismo año y mes
}

export function currencyConvertor(amount: number, fromCurrency: string, toCurrency: string, conversionMap: Record<string, number>): number {

  let fromRate = undefined;
  let toRate = undefined;

  if(fromCurrency === toCurrency){
    return amount;
  } else if (fromCurrency === 'USD'){
    toRate = conversionMap[`USD-${toCurrency}`];
    if(toRate === undefined){
      throw new Error(`Conversion rate not found for currency: ${toCurrency}`);
    }
    return amount * toRate;
  } else if (toCurrency === 'USD'){
    fromRate = conversionMap[`USD-${fromCurrency}`];
    if(fromRate === undefined){
      throw new Error(`Conversion rate not found for currency: ${fromCurrency}`);
    }
    return amount / fromRate;
  } else {
    let fromRateKey = `USD-${fromCurrency}`;
    let toRateKey = `USD-${toCurrency}`;
    fromRate = conversionMap[fromRateKey];
    toRate = conversionMap[toRateKey];

    if(fromRate === undefined || toRate === undefined){
      throw new Error(`Conversion rate not found for currency: ${fromCurrency} or ${toCurrency}`);
    } else {
      return (amount * toRate) / fromRate;
    }
  }
}