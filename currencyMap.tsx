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

function removeThousandSeparator(num: string, decimalSeparator: string, thousandSeparator: string) {
  let [integer, decimal] = num.toString().split(decimalSeparator);
  integer = integer.replace(new RegExp(`\\${thousandSeparator}`, "g"), "");
  return decimal !== undefined ? `${integer}.${decimal}` : integer;
}

function addThousandSeparator(stringNum: string, decimalSeparator: string, thousandSeparator: string) {
  let [integer, decimal] = stringNum.toString().split(decimalSeparator);
  integer = integer.replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator);
  return decimal !== undefined ? `${integer}${decimalSeparator}${decimal}` : integer;
}

export function formatCurrency(text: string, currency: string) {
  const currencyTool = currencyMap[currency]
  const lastCharacter = text.charAt(text.length - 1);

  if(lastCharacter === "." && text.split(".").length > 2){
    text = text.slice(0, -1);
  }
  else if(lastCharacter === "," && text.split(",").length > 2){
    text = text.slice(0, -1);
  }
  text = text.replace(/[^0-9,.]/g, "");

  //text = removeThousandSeparator(text, currencyTool.decimal, currencyTool.thousand);
  text = replaceDecimalSeparator(text, ".", currencyTool.decimal);
  text = addThousandSeparator(text, currencyTool.decimal, currencyTool.thousand);

  return text;
}

export function cleanNumber (text: string, currency: string) {
  const currencyTool = currencyMap[currency]
  const lastCharacter = text.charAt(text.length - 1);

  if(lastCharacter === "." && text.split(".").length > 2){
    text = text.slice(0, -1);
  }
  else if(lastCharacter === "," && text.split(",").length > 2){
    text = text.slice(0, -1);
  }
  text = text.replace(/[^0-9,.]/g, "");
  text = removeThousandSeparator(text, currencyTool.decimal, currencyTool.thousand);
  text = replaceDecimalSeparator(text, currencyTool.decimal, ".");

  return text.replace(/^0+/, '');
}