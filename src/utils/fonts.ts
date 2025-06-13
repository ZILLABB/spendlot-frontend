import { useFonts } from 'expo-font';
import {
  Inter_100Thin,
  Inter_200ExtraLight,
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
  Inter_900Black,
} from '@expo-google-fonts/inter';

export const useCustomFonts = () => {
  const [fontsLoaded] = useFonts({
    'Inter-Thin': Inter_100Thin,
    'Inter-ExtraLight': Inter_200ExtraLight,
    'Inter-Light': Inter_300Light,
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
    'Inter-ExtraBold': Inter_800ExtraBold,
    'Inter-Black': Inter_900Black,
    // Aliases for easier usage
    'Inter': Inter_400Regular,
  });

  return fontsLoaded;
};

// Font family mapping for different weights
export const getFontFamily = (weight: string = 'normal'): string => {
  switch (weight) {
    case '100':
    case 'thin':
      return 'Inter-Thin';
    case '200':
    case 'extralight':
      return 'Inter-ExtraLight';
    case '300':
    case 'light':
      return 'Inter-Light';
    case '400':
    case 'normal':
      return 'Inter-Regular';
    case '500':
    case 'medium':
      return 'Inter-Medium';
    case '600':
    case 'semibold':
      return 'Inter-SemiBold';
    case '700':
    case 'bold':
      return 'Inter-Bold';
    case '800':
    case 'extrabold':
      return 'Inter-ExtraBold';
    case '900':
    case 'black':
      return 'Inter-Black';
    default:
      return 'Inter-Regular';
  }
};

// Typography helper function
export const createTextStyle = (
  fontSize: number,
  fontWeight: string = 'normal',
  lineHeight?: number,
  letterSpacing?: number
) => ({
  fontFamily: getFontFamily(fontWeight),
  fontSize,
  fontWeight: 'normal' as const, // Reset fontWeight since we're using fontFamily
  lineHeight,
  letterSpacing,
});
