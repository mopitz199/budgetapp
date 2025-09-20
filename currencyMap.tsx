
export const currencyMap: Record<string, any> = {
    'USD': {
      'decimal': '.',
      'thousand': ','
    },
    'CLP': {
      'decimal': null,
      'thousand': "."
    },
    'EUR': {
      'decimal': '.',
      'thousand': ','
    },
    'MXN': {
      'decimal': '.',
      'thousand': ','
    },
    'ARS': {
      'decimal': ',',
      'thousand': '.'
    },
    'PEN': {
      'decimal': '.',
      'thousand': ','
    },
    'COP': {
      'decimal': ',',
      'thousand': '.'
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


export function cleanNumber (text: string, fromCurrency: string, toCurrency: string, finalFormat: boolean = false) {
    const fromCurrencyTool = currencyMap[fromCurrency]
  const toCurrencyTool = currencyMap[toCurrency]
  let lastCharacter = text.charAt(text.length - 1);

  // Allow only one decimal separator with .
  if(lastCharacter === "."){
    if(text.split(".").length > 2){
      text = text.slice(0, -1);
    }
  }

  // Allow only one decimal separator with ,
  if(lastCharacter === ","){
    if(text.split(",").length > 2){
      text = text.slice(0, -1);
    }
  }

  // Remove all characters except numbers and decimal separators
  if(!toCurrencyTool.decimal && toCurrencyTool.thousand){
    // If the currency doesn't have decimal separator, we remove all characters except numbers and thousand separator
    text = text.replace(new RegExp(`[^0-9\\${toCurrencyTool.thousand}]`, 'g'), '');
  }else{
    text = text.replace(/[^0-9,.]/g, "");
  }

  // If the last character is not a number, we remove it to avoid issues when converting to number
  lastCharacter = text.charAt(text.length - 1);
  if(!isNumber(lastCharacter)){
    text = text.slice(0, -1);
  }

  // Remove thousand separators to keep the integer without them
  text = removeThousandSeparatorAndResetDecimal(text, fromCurrencyTool.decimal, fromCurrencyTool.thousand);

  // Remove leading zeros
  text = text.replace(/^0+/, '');

  return text;
}

export function formatNumber (text: string, fromCurrency: string, toCurrency: string, finalFormat: boolean = false) {

  const toCurrencyTool = currencyMap[toCurrency]
  let lastCharacter = text.charAt(text.length - 1);
  
  text = cleanNumber(text, fromCurrency, toCurrency, finalFormat)

  text = replaceDecimalSeparator(text, ".", toCurrencyTool.decimal);
  text = addThousandSeparator(text, toCurrencyTool.decimal, toCurrencyTool.thousand);

  if(toCurrencyTool.decimal && !isNumber(lastCharacter) && lastCharacter == toCurrencyTool.decimal && !finalFormat){
    text = text + toCurrencyTool.decimal;
  }

  // Here we will have an standard number with . as decimal separator but as string. Except but the decimal separator if there is no decimal part
  return text
}