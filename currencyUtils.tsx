
export const currencyMap: Record<string, any> = {
    'USD': {
      'decimal': '.',
      'thousand': ',',
      'numberDecimals': 2
    },
    'CLP': {
      'decimal': null,
      'thousand': ".",
      'numberDecimals': 0
    },
    'EUR': {
      'decimal': '.',
      'thousand': ',',
      'numberDecimals': 2
    },
    'MXN': {
      'decimal': '.',
      'thousand': ',',
      'numberDecimals': 2
    },
    'ARS': {
      'decimal': ',',
      'thousand': '.',
      'numberDecimals': 0
    },
    'PEN': {
      'decimal': '.',
      'thousand': ',',
      'numberDecimals': 0
    },
    'COP': {
      'decimal': ',',
      'thousand': '.',
      'numberDecimals': 0
    }
}

function replaceDecimalSeparator(stringNum: string, from: string, to: string) {
  if(to === null && from === null){
    return stringNum;
  } else if (to === null){
    return stringNum.split(from)[0];
  } else if (from === null){
    return stringNum;    
  } else {
    return stringNum.replace(from, to);
  }
}

function removeThousandSeparatorAndResetDecimal(num: string, decimalSeparator: string, thousandSeparator: string) {
  let [integer, decimal] = num.toString().split(decimalSeparator);
  integer = integer.replace(new RegExp(`\\${thousandSeparator}`, "g"), "");
  return decimal !== undefined ? `${integer}.${decimal}` : integer;
}

function addThousandSeparator(stringNum: string, decimalSeparator: string, thousandSeparator: string) {
  let [integer, decimal] = stringNum.toString().split(decimalSeparator);
  integer = integer.replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator);
  return decimal !== undefined ? `${integer}${decimalSeparator}${decimal}` : integer;
}

function isNumber(str: any) {
  return !isNaN(str) && str.trim() !== "";
}

function transformNumberDecimal(value: number, toCurrency: string): number {
  const currencyTool = currencyMap[toCurrency]
  if(currencyTool.decimal){
    return value
  }else{
    return Math.trunc(value)
  }
}

function stringToNumber (text: string, currency: string, negative: boolean = false): number {
  const currencyTool = currencyMap[currency]
  let lastCharacter = text.charAt(text.length - 1);

  // If the last character is not a number, we remove it to avoid issues when converting to number
  if(!isNumber(lastCharacter)){
    text = text.slice(0, -1);
  }

  // Remove all characters except numbers and decimal separators
  if(!currencyTool.decimal && currencyTool.thousand){
    // If the currency doesn't have decimal separator, we remove all characters except numbers and thousand separator
    text = text.replace(new RegExp(`[^0-9\\${currencyTool.thousand}]`, 'g'), '');
  }else{
    text = text.replace(/[^0-9,.]/g, "");
  }

  // Remove thousand separators to keep the integer without them
  text = removeThousandSeparatorAndResetDecimal(text, currencyTool.decimal, currencyTool.thousand);

  // Remove leading zeros
  text = text.replace(/^0+/, '');
  let number = Number(text)

  if(negative){
    number = number * -1
  }

  return number;
}

export function cleanNumber(text: string, fromCurrency: string, toCurrency: string, negative: boolean = false) {
    let cleanedNumber = transformNumberDecimal(stringToNumber(text, fromCurrency), toCurrency)
    if(negative){
      cleanedNumber = cleanedNumber * -1
    }
    return cleanedNumber
}

export function formatNumberToDisplay(text: string, fromCurrency: string, toCurrency: string, finalFormat: boolean = false) {

  const toCurrencyTool = currencyMap[toCurrency]
  let lastCharacter = text.charAt(text.length - 1);
  
  let value = stringToNumber(text, fromCurrency);
  value = transformNumberDecimal(value, toCurrency);

  let stringValue = value.toString();
  stringValue = replaceDecimalSeparator(stringValue, ".", toCurrencyTool.decimal);
  stringValue = addThousandSeparator(stringValue, toCurrencyTool.decimal, toCurrencyTool.thousand);

  if(lastCharacter == toCurrencyTool.decimal && !finalFormat){
    stringValue = stringValue + toCurrencyTool.decimal;
  }

  return stringValue
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