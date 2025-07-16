export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function formatNumber(value: number): string {
  const parts = value.toString().split('.');
  const integer = parts[0];
  const decimal = parts[1];

  let formatedInteger = integer.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  if(formatedInteger.startsWith('-')) {
    formatedInteger = '-' + "$"+ formatedInteger.slice(1);
  }else {
    formatedInteger = "$" + formatedInteger;
  }

  if (decimal && parseInt(decimal) !== 0) {
    const cutDecimal = (Number('0.' + decimal)).toFixed(2).split('.')[1];
    return `${formatedInteger},${cutDecimal}`;
  }

  return formatedInteger;
}

export function colorSchemeStyle(scheme: any, style: string, color: string): string {
  const finalStyle = `${style}-${color} dark:${style}-${color}`;
  console.log(finalStyle)
  return finalStyle;
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