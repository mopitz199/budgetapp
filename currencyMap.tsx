const currencyMap: Record<string, any> = {
    'USD': {
      'locale': 'en-US',
      'decimal': '.',
      'symbol': '$',
      'replaceDecimalSeparator': function puntoPorComa(stringNum: string) {
        return stringNum.replace(".", ".");
      },
      'removeThousandSeparator': function quitarMiles(num: string) {
        let [integer, decimal] = num.toString().split(".");
        integer = integer.replace(/\,/g, "");
        return decimal !== undefined ? `${integer}.${decimal}` : integer;
      },
      'addThousandSeparator': function formatearMiles(num: number) {
        let [integer, decimal] = num.toString().split(".");
        integer = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return decimal !== undefined ? `${integer}.${decimal}` : integer;
      }
    },
    'CLP': {
      'locale': 'es-CL',
      'decimal': ",",
      'symbol': '$',
      'replaceDecimalSeparator': function puntoPorComa(stringNum: string) {
        return stringNum.replace(".", ",");
      },
      'removeThousandSeparator': function quitarMiles(stringNum: string) {
        let [integer, decimal] = stringNum.toString().split(",");
        integer = integer.replace(/\./g, "");
        return decimal !== undefined ? `${integer},${decimal}` : integer;
      },
      'addThousandSeparator': function formatearMiles(stringNum: string) {
        let [integer, decimal] = stringNum.toString().split(",");
        integer = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        return decimal !== undefined ? `${integer},${decimal}` : integer;
      }
    },
    'EUR': {
      'locale': 'de-DE',
      'decimal': null,
      'symbol': '€',
      'replaceDecimal': function puntoPorComa(stringNum: string) {
        return stringNum.replace(".", ",");
      },
      'removeThousandSeparator': function quitarMiles(num: string) {
        return num.replace(/\./g, "");
      },
      'addThousandSeparator': function formatearMiles(num: number) {
        let str = num.toString();
        return str.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      }
    }
}
  // Currency code to locale mapping

export default currencyMap;