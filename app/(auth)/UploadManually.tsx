import { CustomSafeAreaView } from "@/components/customMainView";
import { EditTransactionView } from "@/components/editTransactionModal";
import { useUserSettingContext } from "@/contexts/UserAuthenticatedContext";
import type { Categories, TransactionToDisplay } from "@/types";
import { headerSettings, logger } from "@/utils";
import { getAuth } from "@react-native-firebase/auth";
import { doc, getDoc, getFirestore } from "@react-native-firebase/firestore";
import { useNavigation } from 'expo-router';
import { useEffect, useLayoutEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useColorScheme } from "react-native";
import { useTheme } from "react-native-paper";

export default function UploadManually() {

  // Use always to ensure the color scheme is applied correctly
  const colorScheme = useColorScheme();
  const navigation = useNavigation();
  const { t } = useTranslation();
  const auth = getAuth()
  const { colors } = useTheme() as any;
  const userSettings = useUserSettingContext();
  logger("User settings in UploadManually", userSettings);

  useLayoutEffect(() => headerSettings(
      navigation,
      colorScheme,
      t("transaction"),
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
  const [mapCategories, setMapCategories] = useState<Categories>({});

  const readCategories = async () => {
    const db = getFirestore();
    let categories: Categories = {};
    const categoriesRef = doc(db, "categories", "cP2dsMNnTfqK8EeG9Ai6");
    const categoriesSnap = await getDoc(categoriesRef);
    if(categoriesSnap.exists()){
      const categoriesData = categoriesSnap.data();
      categories = categoriesData as Categories;
    }
    setMapCategories(categories);
  }

  useEffect(() => {
    readCategories()
  }, []);

  return (
    <CustomSafeAreaView>
      <EditTransactionView
        allowCurrencySelection={true}
        transactionToEditDefault={transactionToEdit}
        colors={colors}
        mapCategories={mapCategories}
        hideBackButton={true}
        onSaveEditTransaction={(transaction: TransactionToDisplay) => {
          console.log("Save transaction in Firestore", transaction);
        }}
        hideCancelButton={true}
      />
    </CustomSafeAreaView>
  );
}