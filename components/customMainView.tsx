import React from 'react';
import { ActivityIndicator, Platform, StatusBar, View, ViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface CustomComponentProps extends ViewProps {
  children?: React.ReactNode; // <- permite pasar contenido entre etiquetas
}

// Use when we do not have a header
export function CustomSafeAreaView(
  {
    children,
    screenWithHeader = true,
    loading = false,
    className,
    ...rest
  }: CustomComponentProps & { screenWithHeader?: boolean, loading?: boolean }
) {
  return (
    <SafeAreaView
      className="bg-background dark:bg-darkMode-background flex-1 border-2"
      style={{
        paddingTop: Platform.OS === 'android' && screenWithHeader ? StatusBar.currentHeight : 0,
      }}
    >
      <View className={`flex-1 ${className || ''}`} {...rest}>
        {loading?
          <View className='absolute top-0 left-0 right-0 inset-0 h-max z-10 justify-center'>
            <View className='absolute top-0 left-0 right-0 opacity-20 bg-black inset-0 h-max z-10 justify-center' />
            <View className="absolute top-0 left-0 right-0 inset-0 h-max z-20 justify-center">
              <ActivityIndicator size="large" color="#FFFFFF" />
            </View>
          </View>
        : null}
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
    loading = false,
    className,
    ...rest
  }: CustomComponentProps & { screenWithHeader?: boolean, loading?: boolean }
) {
  return (
    <View
      className={`bg-background dark:bg-darkMode-background flex-1 ${className || ''}`}
      style={{
        paddingTop: Platform.OS === 'android' && screenWithHeader ? StatusBar.currentHeight : 0,
      }}
      {...rest}
    >
      {loading?
        <View className='absolute top-0 left-0 right-0 inset-0 h-max z-10 justify-center'>
          <View className='absolute top-0 left-0 right-0 opacity-20 bg-black inset-0 h-max z-10 justify-center' />
          <View className="absolute top-0 left-0 right-0 inset-0 h-max z-20 justify-center">
            <ActivityIndicator size="large" color="#FFFFFF" />
          </View>
        </View>
      : null}
      {children}
    </View>
  );
}