import { currencyMap } from '@/currencyUtils';
import { ScrollView, Text, TouchableOpacity } from "react-native";
import { Modal, Portal } from "react-native-paper";

type Props = {
  showCurrencyModal: boolean;
  setShowCurrencyModal: any;
  colors: any;
  currencyValue: string;
  onCurrencyChange: any;
};

export function CurrencyPickerModal(
  {
    showCurrencyModal,
    setShowCurrencyModal,
    colors,
    currencyValue,
    onCurrencyChange
  } : Props
){

  const getCurrencyList = () => {
    let currencyList: string[] = [];
    for (const key in currencyMap) {
      currencyList.push(key);
    }
    return currencyList;
  }

  return (
    <Portal>
      <Modal
        visible={showCurrencyModal}
        contentContainerStyle={{
          height: '40%',
          width: '80%',
          alignSelf: 'center',
          justifyContent: 'center',
          backgroundColor: colors.surface,
          margin: 28,
          borderRadius: 10
        }} onDismiss={() => {setShowCurrencyModal(false)}}>
          <ScrollView indicatorStyle="black" className='rounded-xl'>
            {getCurrencyList().map((currency) => (
              <TouchableOpacity
                className={`
                  border-divider 
                  dark:border-darkMode-divider
                  border-b
                  p-6
                  ${currency === currencyValue ? 'bg-primary dark:bg-darkMode-primary' : ''}
                `}
                key={currency}
                onPress={() => {
                  onCurrencyChange(currencyValue, currency)
                  setShowCurrencyModal(false);
                }}
              >
                <Text className='text-md color-onSurface dark:color-darkMode-onSurface'>{currency}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
      </Modal>
    </Portal>
  )
}