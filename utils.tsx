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