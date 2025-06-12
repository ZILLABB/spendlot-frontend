import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
// import * as Haptics from 'expo-haptics';
import { Button, Input, Card } from '../../components/ui';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, DEFAULT_CATEGORIES } from '../../constants';
import { ReceiptEditForm } from '../../types';

interface ReceiptEditScreenProps {
  navigation: any;
  route: {
    params: {
      receiptId?: string;
      imageUri?: string;
      ocrData?: {
        text: string;
        confidence: number;
        boundingBox?: any;
      };
    };
  };
}

export const ReceiptEditScreen: React.FC<ReceiptEditScreenProps> = ({
  navigation,
  route,
}) => {
  const { receiptId, imageUri, ocrData } = route.params;
  const [selectedCategory, setSelectedCategory] = useState(DEFAULT_CATEGORIES[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // Animations
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<ReceiptEditForm>({
    defaultValues: {
      merchantName: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      categoryId: DEFAULT_CATEGORIES[0].id,
      items: [],
    },
  });

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Parse OCR data if available
    if (ocrData?.text) {
      parseOCRData(ocrData.text);
    }
  }, []);

  const parseOCRData = (text: string) => {
    try {
      // Smart parsing of OCR text
      const lines = text.split('\n').map(line => line.trim()).filter(Boolean);
      
      // Extract merchant name (usually first line or line with store name)
      const merchantLine = lines.find(line => 
        line.length > 3 && 
        !line.includes('$') && 
        !line.match(/\d{2}\/\d{2}\/\d{4}/) &&
        !line.toLowerCase().includes('total')
      );
      
      if (merchantLine) {
        setValue('merchantName', merchantLine);
      }

      // Extract total amount
      const totalRegex = /(?:total|amount|sum)[\s:]*\$?(\d+\.?\d*)/i;
      const amountRegex = /\$(\d+\.?\d*)/g;
      
      let amount = '';
      
      // Try to find total first
      for (const line of lines) {
        const totalMatch = line.match(totalRegex);
        if (totalMatch) {
          amount = totalMatch[1];
          break;
        }
      }
      
      // If no total found, get the largest amount
      if (!amount) {
        const amounts = [];
        for (const line of lines) {
          const matches = line.match(amountRegex);
          if (matches) {
            amounts.push(...matches.map(m => parseFloat(m.replace('$', ''))));
          }
        }
        if (amounts.length > 0) {
          amount = Math.max(...amounts).toString();
        }
      }
      
      if (amount) {
        setValue('amount', amount);
      }

      // Extract date
      const dateRegex = /(\d{1,2}\/\d{1,2}\/\d{4}|\d{4}-\d{2}-\d{2})/;
      for (const line of lines) {
        const dateMatch = line.match(dateRegex);
        if (dateMatch) {
          const dateStr = dateMatch[1];
          // Convert to YYYY-MM-DD format
          if (dateStr.includes('/')) {
            const [month, day, year] = dateStr.split('/');
            setValue('date', `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
          } else {
            setValue('date', dateStr);
          }
          break;
        }
      }

      // Smart category detection
      const merchantName = merchantLine?.toLowerCase() || '';
      const detectedCategory = DEFAULT_CATEGORIES.find(cat => {
        const keywords = {
          'Food & Dining': ['restaurant', 'cafe', 'pizza', 'burger', 'food', 'dining'],
          'Groceries': ['market', 'grocery', 'supermarket', 'whole foods', 'trader', 'safeway'],
          'Transportation': ['gas', 'fuel', 'uber', 'lyft', 'taxi', 'parking'],
          'Shopping': ['store', 'shop', 'mall', 'target', 'walmart', 'amazon'],
          'Entertainment': ['movie', 'theater', 'cinema', 'game', 'entertainment'],
          'Healthcare': ['pharmacy', 'hospital', 'clinic', 'medical', 'cvs', 'walgreens'],
        };
        
        const categoryKeywords = keywords[cat.name as keyof typeof keywords] || [];
        return categoryKeywords.some(keyword => merchantName.includes(keyword));
      });

      if (detectedCategory) {
        setSelectedCategory(detectedCategory);
        setValue('categoryId', detectedCategory.id);
      }

    } catch (error) {
      console.error('Error parsing OCR data:', error);
    }
  };

  const handleCategorySelect = async (category: typeof DEFAULT_CATEGORIES[0]) => {
    setSelectedCategory(category);
    setValue('categoryId', category.id);
  };

  const onSubmit = async (data: ReceiptEditForm) => {
    try {
      setIsSubmitting(true);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Navigate to success screen
      navigation.navigate('ReceiptSuccess', {
        receiptId: receiptId || 'new-receipt-id',
      });

    } catch (error) {
      console.error('Submit error:', error);
      Alert.alert('Error', 'Failed to save receipt. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleAdvanced = async () => {
    setShowAdvanced(!showAdvanced);
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{
              translateY: slideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0],
              }),
            }],
          },
        ]}
      >
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backIcon}>←</Text>
            </TouchableOpacity>
            
            <View style={styles.headerContent}>
              <Text style={styles.title}>Edit Receipt</Text>
              {ocrData && (
                <Text style={styles.subtitle}>
                  Confidence: {Math.round(ocrData.confidence * 100)}%
                </Text>
              )}
            </View>
          </View>

          {/* Basic Information */}
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Basic Information</Text>
            
            <Controller
              control={control}
              name="merchantName"
              rules={{ required: 'Merchant name is required' }}
              render={({ field: { onChange, value } }) => (
                <Input
                  label="Merchant Name"
                  placeholder="Enter merchant name"
                  value={value}
                  onChangeText={onChange}
                  error={errors.merchantName?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="amount"
              rules={{ 
                required: 'Amount is required',
                pattern: {
                  value: /^\d+\.?\d*$/,
                  message: 'Please enter a valid amount'
                }
              }}
              render={({ field: { onChange, value } }) => (
                <Input
                  label="Amount"
                  placeholder="0.00"
                  value={value}
                  onChangeText={onChange}
                  keyboardType="numeric"
                  error={errors.amount?.message}
                  leftIcon={<Text style={styles.currencySymbol}>$</Text>}
                />
              )}
            />

            <Controller
              control={control}
              name="date"
              rules={{ required: 'Date is required' }}
              render={({ field: { onChange, value } }) => (
                <Input
                  label="Date"
                  placeholder="YYYY-MM-DD"
                  value={value}
                  onChangeText={onChange}
                  error={errors.date?.message}
                />
              )}
            />
          </Card>

          {/* Category Selection */}
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Category</Text>
            
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.categoriesContainer}
            >
              {DEFAULT_CATEGORIES.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryItem,
                    selectedCategory.id === category.id && styles.categoryItemSelected,
                  ]}
                  onPress={() => handleCategorySelect(category)}
                >
                  <Text style={styles.categoryIcon}>{category.icon}</Text>
                  <Text style={[
                    styles.categoryName,
                    selectedCategory.id === category.id && styles.categoryNameSelected,
                  ]}>
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Card>

          {/* Advanced Options */}
          <Card style={styles.section}>
            <TouchableOpacity 
              style={styles.advancedToggle}
              onPress={toggleAdvanced}
            >
              <Text style={styles.sectionTitle}>Advanced Options</Text>
              <Text style={styles.toggleIcon}>
                {showAdvanced ? '▼' : '▶'}
              </Text>
            </TouchableOpacity>
            
            {showAdvanced && (
              <View style={styles.advancedContent}>
                <Text style={styles.advancedText}>
                  Additional features like item breakdown, tax details, and payment method 
                  will be available here.
                </Text>
              </View>
            )}
          </Card>

          {/* OCR Data Preview */}
          {ocrData?.text && (
            <Card style={styles.section}>
              <Text style={styles.sectionTitle}>Original OCR Text</Text>
              <Text style={styles.ocrText}>{ocrData.text}</Text>
            </Card>
          )}
        </ScrollView>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Button
            title="Cancel"
            onPress={() => navigation.goBack()}
            variant="outline"
            style={styles.actionButton}
          />
          <Button
            title={isSubmitting ? "Saving..." : "Save Receipt"}
            onPress={handleSubmit(onSubmit)}
            loading={isSubmitting}
            disabled={!isValid}
            style={styles.actionButton}
          />
        </View>
      </Animated.View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray[50],
  },
  content: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  backIcon: {
    fontSize: 20,
    color: COLORS.gray[700],
    fontWeight: 'bold',
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.gray[900],
  },
  subtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[600],
    marginTop: 2,
  },
  section: {
    margin: SPACING.lg,
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.gray[900],
    marginBottom: SPACING.md,
  },
  currencySymbol: {
    fontSize: FONT_SIZES.base,
    color: COLORS.gray[600],
    fontWeight: '600',
  },
  categoriesContainer: {
    marginHorizontal: -SPACING.xs,
  },
  categoryItem: {
    alignItems: 'center',
    padding: SPACING.md,
    marginHorizontal: SPACING.xs,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.gray[100],
    minWidth: 80,
  },
  categoryItemSelected: {
    backgroundColor: COLORS.primary[100],
    borderWidth: 2,
    borderColor: COLORS.primary[500],
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: SPACING.xs,
  },
  categoryName: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.gray[700],
    textAlign: 'center',
    fontWeight: '600',
  },
  categoryNameSelected: {
    color: COLORS.primary[700],
  },
  advancedToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleIcon: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[500],
  },
  advancedContent: {
    marginTop: SPACING.md,
    padding: SPACING.md,
    backgroundColor: COLORS.gray[50],
    borderRadius: BORDER_RADIUS.md,
  },
  advancedText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[600],
    fontStyle: 'italic',
  },
  ocrText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[700],
    lineHeight: 18,
    fontFamily: 'monospace',
    backgroundColor: COLORS.gray[50],
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
  },
  actionButtons: {
    flexDirection: 'row',
    padding: SPACING.lg,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[200],
    gap: SPACING.md,
  },
  actionButton: {
    flex: 1,
  },
});

export default ReceiptEditScreen;
