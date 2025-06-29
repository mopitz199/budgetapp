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