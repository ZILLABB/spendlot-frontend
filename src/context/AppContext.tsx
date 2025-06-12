import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance } from 'react-native';
import { AppContextType } from '../types';
import { STORAGE_KEYS } from '../constants';

interface AppState {
  theme: 'light' | 'dark' | 'system';
  effectiveTheme: 'light' | 'dark';
  isOffline: boolean;
  isLoading: boolean;
  notifications: {
    enabled: boolean;
    receiptProcessing: boolean;
    weeklyReports: boolean;
    spendingAlerts: boolean;
  };
}

type AppAction =
  | { type: 'SET_THEME'; payload: 'light' | 'dark' | 'system' }
  | { type: 'SET_EFFECTIVE_THEME'; payload: 'light' | 'dark' }
  | { type: 'SET_OFFLINE_STATUS'; payload: boolean }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'UPDATE_NOTIFICATIONS'; payload: Partial<AppState['notifications']> };

const initialState: AppState = {
  theme: 'system',
  effectiveTheme: 'light',
  isOffline: false,
  isLoading: true,
  notifications: {
    enabled: true,
    receiptProcessing: true,
    weeklyReports: true,
    spendingAlerts: true,
  },
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_THEME':
      return {
        ...state,
        theme: action.payload,
      };
    case 'SET_EFFECTIVE_THEME':
      return {
        ...state,
        effectiveTheme: action.payload,
      };
    case 'SET_OFFLINE_STATUS':
      return {
        ...state,
        isOffline: action.payload,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'UPDATE_NOTIFICATIONS':
      return {
        ...state,
        notifications: {
          ...state.notifications,
          ...action.payload,
        },
      };
    default:
      return state;
  }
};

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    initializeApp();
    setupThemeListener();
  }, []);

  useEffect(() => {
    updateEffectiveTheme();
  }, [state.theme]);

  const initializeApp = async () => {
    try {
      // Load saved theme
      const savedTheme = await AsyncStorage.getItem(STORAGE_KEYS.THEME);
      if (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'system') {
        dispatch({ type: 'SET_THEME', payload: savedTheme as 'light' | 'dark' | 'system' });
      }

      // Load notification preferences
      const notificationSettings = await AsyncStorage.getItem('notification_settings');
      if (notificationSettings) {
        const settings = JSON.parse(notificationSettings);
        dispatch({ type: 'UPDATE_NOTIFICATIONS', payload: settings });
      }

      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error) {
      console.error('Error initializing app:', error);
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const setupThemeListener = () => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      if (state.theme === 'system') {
        dispatch({
          type: 'SET_EFFECTIVE_THEME',
          payload: colorScheme === 'dark' ? 'dark' : 'light'
        });
      }
    });

    return () => subscription?.remove();
  };

  const updateEffectiveTheme = () => {
    if (state.theme === 'system') {
      const systemTheme = Appearance.getColorScheme();
      dispatch({
        type: 'SET_EFFECTIVE_THEME',
        payload: systemTheme === 'dark' ? 'dark' : 'light'
      });
    } else {
      dispatch({ type: 'SET_EFFECTIVE_THEME', payload: state.theme });
    }
  };

  // Network listener will be added later with NetInfo
  // const setupNetworkListener = () => {
  //   const unsubscribe = NetInfo.addEventListener(state => {
  //     dispatch({ type: 'SET_OFFLINE_STATUS', payload: !state.isConnected });
  //   });
  //   return unsubscribe;
  // };

  const setTheme = async (theme: 'light' | 'dark' | 'system') => {
    dispatch({ type: 'SET_THEME', payload: theme });

    try {
      await AsyncStorage.setItem(STORAGE_KEYS.THEME, theme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const toggleTheme = async () => {
    const themes: ('light' | 'dark' | 'system')[] = ['light', 'dark', 'system'];
    const currentIndex = themes.indexOf(state.theme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    await setTheme(nextTheme);
  };

  const updateNotificationSettings = async (settings: Partial<AppState['notifications']>) => {
    dispatch({ type: 'UPDATE_NOTIFICATIONS', payload: settings });
    
    try {
      const updatedSettings = { ...state.notifications, ...settings };
      await AsyncStorage.setItem('notification_settings', JSON.stringify(updatedSettings));
    } catch (error) {
      console.error('Error saving notification settings:', error);
    }
  };

  const value: AppContextType & {
    notifications: AppState['notifications'];
    updateNotificationSettings: (settings: Partial<AppState['notifications']>) => Promise<void>;
    effectiveTheme: 'light' | 'dark';
    setTheme: (theme: 'light' | 'dark' | 'system') => Promise<void>;
  } = {
    theme: state.theme,
    effectiveTheme: state.effectiveTheme,
    toggleTheme,
    setTheme,
    isOffline: state.isOffline,
    notifications: state.notifications,
    updateNotificationSettings,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;
