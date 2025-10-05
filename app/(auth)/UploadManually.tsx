import { CustomSafeAreaView } from "@/components/customMainView";
import { EditTransactionView } from "@/components/editTransactionModal";
import type { Categories, TransactionToDisplay } from "@/types";
import { headerSettings } from "@/utils";
import { getAuth } from "@react-native-firebase/auth";
import { doc, getDoc, getFirestore } from "@react-native-firebase/firestore";
import { useNavigation } from 'expo-router';
import { useEffect, useLayoutEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, useColorScheme } from "react-native";
import { useTheme } from "react-native-paper";

export default function UploadManually() {

  // Use always to ensure the color scheme is applied correctly
  const colorScheme = useColorScheme();
  const navigation = useNavigation();
  const { t } = useTranslation();
  const auth = getAuth()
  const { colors } = useTheme() as any;

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
    currency: 'USD',
  });
  const [mapCategories, setMapCategories] = useState<Categories>({});

  const getUserSettings = async () => {
    const user = auth.currentUser;

    if(!user){
      Alert.alert(t("error"), "User not authenticated");
      return
    }

    const db = getFirestore();
    const docRef = doc(db, "user_settings", user.uid);
    const docSnap = await getDoc(docRef); 

    if(docSnap.exists()){
      const userSettings = docSnap.data();
      return userSettings;
    }else{
      Alert.alert(t("error"), "User settings not foundd");
      return
    }
  }

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