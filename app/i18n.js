import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
  en: {
    translation: {
      "continueWithGoogle": "Continue with Google",
      "forgotPassword": "Forgot Password?",
      "or": "or",
      "doesNotHaveAnAccount": "Don't have an account?",
      "signUp": "Sign Up",
      "signOut": "Sign Out",
      "logIn": "Log In",
      "email": "Email",
      "password": "Password",
      "repeatPassword": "Repeat Password",
      "startSaving": "¡Start Saving!",
      "creatingAccount": "Creating account...",
      "invalidEmail": "The email is invalid",
      "invalidPassword": "Use at least 6 numbers and characters",
      "invalidRepeatedPassword": "The passwords does not match",
      "createAccount": "Create Account",
      "verifyYourEmail": "Verify your Email",
      "emailSent": "Email sent.",
      "verifyAgain": "Verify Again",
      "notVerifiedCheckEmail": "Not verified yet. check your inbox or spam.",
      "weHaveSentYouVerificationLink": "We have sent you a verification link.",
      "checkYourEmail": "Check your email",
      "resendEmail": "Resend Email",
      "passwordRecovery": "Password Recovery",
      "sendEmail": "Send email",
      "sendingEmail": "Sending email...",
      "emailSentForPasswordRecovery": "We've sent you a link to recover your password",
      "Welcome to React": "Welcome to React and react-i18next",
      "addYourImages": "Add you images",
      "select": "Select",
      "loading": "Loading...",
      "upload": "Upload",
      "selectAgain": "Select again",
      "undo": "Undo",
      "transactionRemoved": "Transaction removed",
      "confirm": "Confirm",
      "confirming": "Confirming...",
      "verifyYourTransactions": "Verify your transactions",
      "wrongEmailOrPassword": "Wrong email or password",
      "description": "Description",
      "category": "Category",
      "save": "Save",
      "cancel": "Cancel",
      "amount": "Amount",
      "uploadYourImages": "Upload your images",
    }
  },
  es: {
    translation: {
      "continueWithGoogle": "Continuar con Google",
      "forgotPassword": "Olvidaste la contraseña?",
      "or": "o",
      "doesNotHaveAnAccount": "No tienes una cuenta?",
      "signUp": "Registrate",
      "signOut": "Salir",
      "logIn": "Ingresar",
      "email": "Correo",
      "password": "Contraseña",
      "repeatPassword": "Repite la contraseña",
      "startSaving": "¡Empeiza a ahorrar!",
      "creatingAccount": "Creando cuenta...",
      "invalidEmail": "El correo es invalido",
      "invalidPassword": "Usa al menos 6 numeros y caracteres",
      "invalidRepeatedPassword": "Las contraseñas no calzan",
      "createAccount": "Crea tu Cuenta",
      "verifyYourEmail": "Verifica tu Correo",
      "emailSent": "Correo enviado.",
      "notVerifiedCheckEmail": "No verificado aun. Revisa tu correo o tu bandeja de spam",
      "verifyAgain": "Verificar de nuevo",
      "weHaveSentYouVerificationLink": "Te hemos enviado un correo de verificación",
      "checkYourEmail": "Revisa tu correo",
      "resendEmail": "Reenviar Correo",
      "passwordRecovery": "Recuperación de Contraseña",
      "sendEmail": "Enviar correo",
      "sendingEmail": "Enviando correo...",
      "emailSentForPasswordRecovery": "Te enviamos un enlace para restablecer tu contraseña.",
      "Welcome to React": "Bienvenue à React et react-i18next",
      "addYourImages": "Agrega tus imágenes",
      "select": "Seleccionar",
      "loading": "Cargando...",
      "upload": "Subir",
      "selectAgain": "Seleccionar de nuevo",
      "undo": "Deshacer",
      "transactionRemoved": "Transacción eliminada",
      "confirm": "Confirmar",
      "confirming": "Confirmando...",
      "verifyYourTransactions": "Verificar tus transacciones",
      "wrongEmailOrPassword": "Correo o contraseña incorrectos",
      "description": "Descripción",
      "category": "Categoría",
      "save": "Guardar",
      "cancel": "Cancelar",
      "amount": "Monto",
      "uploadYourImages": "Sube tus imágenes",
    }
  }
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: "es", // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
    // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
    // if you're using a language detector, do not define the lng option

    interpolation: {
      escapeValue: false // react already safes from xss
    }
  }
);

export default i18n;