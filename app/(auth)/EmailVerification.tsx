import { useTranslation } from 'react-i18next';
import {
  Text,
} from "react-native";

export default function EmailVerification() {
  const { t } = useTranslation();

  return (
    <Text>{t("Welcome to React")}</Text>
  )
}