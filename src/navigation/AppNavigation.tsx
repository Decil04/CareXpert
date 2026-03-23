import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { LandingScreen } from '../screens/LandingScreen';
import { DashboardScreen } from '../screens/DashboardScreen';
import { TranslatorScreen } from '../screens/TranslatorScreen';
import { LoadingScreen } from '../screens/LoadingScreen';
import { ResultScreen } from '../screens/ResultScreen';
import { AdminScreen } from '../screens/AdminScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { DoctorsScreen } from '../screens/DoctorsScreen';

const Stack = createStackNavigator();

export const AppNavigation = () => {
  return (
    <Stack.Navigator 
      initialRouteName="Landing"
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#FAF9FC' }
      }}
    >
      <Stack.Screen name="Landing" component={LandingScreen} />
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen name="Translator" component={TranslatorScreen} />
      <Stack.Screen name="Loading" component={LoadingScreen} />
      <Stack.Screen name="Result" component={ResultScreen} />
      <Stack.Screen name="Admin" component={AdminScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="Doctors" component={DoctorsScreen} />
    </Stack.Navigator>
  );
};
