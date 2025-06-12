import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { MainTabParamList, ReceiptStackParamList, SettingsStackParamList } from '../types';
import { COLORS } from '../constants';

// Import main screens
import HomeScreen from '../screens/main/HomeScreen';
import TransactionsScreen from '../screens/main/TransactionsScreen';
import AnalyticsScreen from '../screens/main/AnalyticsScreen';
import SettingsScreen from '../screens/main/SettingsScreen';
import BankAccountsScreen from '../screens/main/BankAccountsScreen';
import BackendTestScreen from '../screens/testing/BackendTestScreen';

// Import receipt screens
import ReceiptsScreen from '../screens/main/ReceiptsScreen';
import ReceiptCameraScreen from '../screens/receipts/ReceiptCameraScreen';
import ReceiptPreviewScreen from '../screens/receipts/ReceiptPreviewScreen';
import ReceiptEditScreen from '../screens/receipts/ReceiptEditScreen';
import ReceiptDetailScreen from '../screens/receipts/ReceiptDetailScreen';
import ReceiptSuccessScreen from '../screens/receipts/ReceiptSuccessScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();
const ReceiptStack = createStackNavigator<ReceiptStackParamList>();
const SettingsStack = createStackNavigator<SettingsStackParamList>();

// Receipt Stack Navigator
const ReceiptStackNavigator = () => {
  return (
    <ReceiptStack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: 'white' },
      }}
    >
      <ReceiptStack.Screen name="ReceiptList" component={ReceiptsScreen} />
      <ReceiptStack.Screen name="ReceiptCamera" component={ReceiptCameraScreen} />
      <ReceiptStack.Screen name="ReceiptPreview" component={ReceiptPreviewScreen} />
      <ReceiptStack.Screen name="ReceiptEdit" component={ReceiptEditScreen} />
      <ReceiptStack.Screen name="ReceiptDetail" component={ReceiptDetailScreen} />
      <ReceiptStack.Screen name="ReceiptSuccess" component={ReceiptSuccessScreen} />
    </ReceiptStack.Navigator>
  );
};

// Settings Stack Navigator
const SettingsStackNavigator = () => {
  return (
    <SettingsStack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: 'white',
          shadowColor: COLORS.gray[200],
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 2,
        },
        headerTitleStyle: {
          fontSize: 18,
          fontWeight: 'bold',
          color: COLORS.gray[900],
        },
        cardStyle: { backgroundColor: 'white' },
      }}
    >
      <SettingsStack.Screen
        name="SettingsMain"
        component={SettingsScreen}
        options={{ title: 'Settings' }}
      />
      <SettingsStack.Screen
        name="BankAccounts"
        component={BankAccountsScreen}
        options={{ title: 'Bank Accounts' }}
      />
      <SettingsStack.Screen
        name="BackendTest"
        component={BackendTestScreen}
        options={{ title: 'Backend Testing' }}
      />
    </SettingsStack.Navigator>
  );
};

// Simple icon component for now (will be replaced with proper icons)
const TabIcon = ({ name, focused }: { name: string; focused: boolean }) => {
  const icons: Record<string, string> = {
    Home: '🏠',
    Receipts: '📄',
    Transactions: '💳',
    Analytics: '📊',
    Settings: '⚙️',
  };

  return (
    <Text style={{
      fontSize: 24,
      opacity: focused ? 1 : 0.6
    }}>
      {icons[name]}
    </Text>
  );
};

export const MainNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => (
          <TabIcon name={route.name} focused={focused} />
        ),
        tabBarActiveTintColor: COLORS.primary[600],
        tabBarInactiveTintColor: COLORS.gray[500],
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopColor: COLORS.gray[200],
          paddingTop: 8,
          paddingBottom: 8,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        headerStyle: {
          backgroundColor: 'white',
          shadowColor: COLORS.gray[200],
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 2,
        },
        headerTitleStyle: {
          fontSize: 18,
          fontWeight: 'bold',
          color: COLORS.gray[900],
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          title: 'Dashboard',
        }}
      />
      <Tab.Screen
        name="Receipts"
        component={ReceiptStackNavigator}
        options={{
          title: 'Receipts',
        }}
      />
      <Tab.Screen
        name="Transactions"
        component={TransactionsScreen}
        options={{
          title: 'Transactions',
        }}
      />
      <Tab.Screen
        name="Analytics"
        component={AnalyticsScreen}
        options={{
          title: 'Analytics',
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsStackNavigator}
        options={{
          title: 'Settings',
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
};

export default MainNavigator;
