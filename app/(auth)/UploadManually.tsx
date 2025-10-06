import { CustomMainView } from "@/components/customMainView";
import { EditTransactionView } from "@/components/editTransactionModal";
import { useCurrencyRatioContext, useTransactionCategoriesContext, useUserSettingContext } from "@/contexts/UserAuthenticatedContext";
import { currencyConvertor } from "@/currencyUtils";
import type { Categories, TransactionToDisplay } from "@/types";
import { headerSettings, logger } from "@/utils";
import { getAuth } from "@react-native-firebase/auth";
import { doc, getFirestore, setDoc } from "@react-native-firebase/firestore";
import { router, useNavigation } from 'expo-router';
import { useLayoutEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, useColorScheme } from "react-native";
import { useTheme } from "react-native-paper";
import uuid from 'react-native-uuid';

export default function UploadManually() {

  // Use always to ensure the color scheme is applied correctly
  const colorScheme = useColorScheme();
  const navigation = useNavigation();
  const { t } = useTranslation();
  const auth = getAuth()
  const { colors } = useTheme() as any;
  const userSettings = useUserSettingContext();
  const currencyRatio = useCurrencyRatioContext();
  const transactionCategories = useTransactionCategoriesContext();

  logger("User settings in UploadManually", transactionCategories);

  useLayoutEffect(() => headerSettings(
      navigation,
      colorScheme,
      t("newTransaction"),
      false,
    ), [navigation, colorScheme]
  );

  const [transactionToEdit, setTransactionToEdit] = useState<TransactionToDisplay>({
    index: 0,
    date: new Date(),
    description: '',
    amount: 0,
    stringAmount: '0',
    removed: false,
    negative: false,
    category: '1',
    currency: userSettings.defaultCurrency,
  });

  const saveTransaction = async (transaction: TransactionToDisplay) => {
    const user = auth.currentUser;

    if(!user){
      logger("User not authenticated in saveTransaction");
      Alert.alert(t("error"), "User not authenticated");
      return
    }
    const db = getFirestore();
    const docRef = doc(db, "user_transactions", user.uid);
    let id = uuid.v4()

    let transactionToSave = {} as Record<string, any>;
    transactionToSave[id] = {
      id: id,
      category: transaction.category,
      currency: userSettings["defaultCurrency"],
      date: transaction.date,
      description: transaction.description,
      amount: currencyConvertor(
        transaction.amount,
        transaction.currency,
        userSettings["defaultCurrency"],
        currencyRatio
      ).toFixed(currencyRatio[transaction.currency]),
    }
    await setDoc(docRef, transactionToSave, { merge: false });
  }

  return (
    <CustomMainView loading={false}>
      <EditTransactionView
        allowCurrencySelection={true}
        transactionToEditDefault={transactionToEdit}
        colors={colors}
        mapCategories={transactionCategories as Categories}
        onSaveEditTransaction={(transaction: TransactionToDisplay) => {
          saveTransaction(transaction);
          router.replace('/(auth)/(tabs)/Home');
        }}
        hideCancelButton={true}
      />
    </CustomMainView>
  );
}