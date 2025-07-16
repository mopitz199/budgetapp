import React from 'react';
import { Platform, StatusBar, View, ViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface CustomComponentProps extends ViewProps {
  children?: React.ReactNode; // <- permite pasar contenido entre etiquetas
}

// Use when we do not have a header
export function CustomSafeAreaView(
  {
    children,
    screenWithHeader = true,
    className,
    ...rest
  }: CustomComponentProps & { screenWithHeader?: boolean }
) {
  return (
    <SafeAreaView
      className="bg-background dark:bg-darkMode-background flex-1"
      style={{
        paddingTop: Platform.OS === 'android' && screenWithHeader ? StatusBar.currentHeight : 0,
      }}
    >
      <View className={`flex-1 ${className || ''}`} {...rest}>
        {children}
      </View>
    </SafeAreaView>
  );
}


// Use when we have a header
export function CustomMainView(
  {
    children,
    screenWithHeader = true,
    className,
    ...rest
  }: CustomComponentProps & { screenWithHeader?: boolean }
) {
  return (
    <View
      className={`bg-background dark:bg-darkMode-background flex-1 ${className || ''}`}
      style={{
        paddingTop: Platform.OS === 'android' && screenWithHeader ? StatusBar.currentHeight : 0,
      }}
      {...rest}
    >
      {children}
    </View>
  );
}