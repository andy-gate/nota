import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ListNotaScreen from './src/screens/ListNotaScreen';
import ListItemScreen from './src/screens/ListItemScreen';
import AddItemScreen from './src/screens/AddItemScreen';
import ListCartScreen from './src/screens/ListCartScreen';
import AddCartScreen from './src/screens/AddCartScreen';
import PreviewScreen from './src/screens/PreviewScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const Home = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Nota" component={ListNotaScreen} />
      <Tab.Screen name="Barang" component={ListItemScreen} />
    </Tab.Navigator>
  )
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ header: () => false }}>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="AddItem" component={AddItemScreen} />
        <Stack.Screen name="ListCart" component={ListCartScreen} />
        <Stack.Screen name="AddCart" component={AddCartScreen} />
        <Stack.Screen name="Preview" component={PreviewScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
