import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Card, Button } from '../../components/ui';
import { receiptService } from '../../services/receiptService';
import { categoryService } from '../../services/categoryService';
import { Receipt, Category, ReceiptStackParamList } from '../../types';
import { COLORS, FONT_SIZES, SPACING } from '../../constants';

type ReceiptDetailScreenRouteProp = RouteProp<ReceiptStackParamList, 'ReceiptDetail'>;
type ReceiptDetailScreenNavigationProp = StackNavigationProp<ReceiptStackParamList, 'ReceiptDetail'>;

interface ReceiptDetailScreenProps {
  route: ReceiptDetailScreenRouteProp;
  navigation: ReceiptDetailScreenNavigationProp;
}

export const ReceiptDetailScreen: React.FC<ReceiptDetailScreenProps> = ({
  route,
  navigation,
}) => {
  const { receiptId } = route.params;
  const [loading, setLoading] = useState(true);
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadReceiptDetails();
  }, [receiptId]);

  const loadReceiptDetails = async () => {
    try {
      setLoading(true);
      const response = await receiptService.getReceiptById(receiptId);
      
      if (response.success && response.data) {
        setReceipt(response.data);
        
        // Load category if available
        if (response.data.category_id) {
          const categoryResponse = await categoryService.getCategoryById(response.data.category_id);
          if (categoryResponse.success && categoryResponse.data) {
            setCategory(categoryResponse.data);
          }
        }
      } else {
        Alert.alert('Error', response.error || 'Failed to load receipt details');
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error loading receipt details:', error);
      Alert.alert('Error', 'Failed to load receipt details');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    if (receipt) {
      navigation.navigate('ReceiptEdit', {
        receiptId: receipt.id.toString(),
      });
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Receipt',
      'Are you sure you want to delete this receipt? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: deleteReceipt },
      ]
    );
  };

  const deleteReceipt = async () => {
    if (!receipt) return;

    try {
      setProcessing(true);
      const response = await receiptService.deleteReceipt(receipt.id);
      
      if (response.success) {
        Alert.alert('Success', 'Receipt deleted successfully', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      } else {
        Alert.alert('Error', response.error || 'Failed to delete receipt');
      }
    } catch (error) {
      console.error('Error deleting receipt:', error);
      Alert.alert('Error', 'Failed to delete receipt');
    } finally {
      setProcessing(false);
    }
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getProcessingStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return COLORS.success[500];
      case 'pending':
        return COLORS.warning[500];
      case 'failed':
        return COLORS.error[500];
      default:
        return COLORS.gray[500];
    }
  };

  const getProcessingStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Processing Complete';
      case 'pending':
        return 'Processing...';
      case 'failed':
        return 'Processing Failed';
      default:
        return 'Unknown Status';
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary[500]} />
          <Text style={styles.loadingText}>Loading receipt...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!receipt) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Receipt not found</Text>
          <Button title="Go Back" onPress={() => navigation.goBack()} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Receipt Image */}
        {receipt.file_path && (
          <Card style={styles.imageCard}>
            <Image source={{ uri: receipt.file_path }} style={styles.receiptImage} />
          </Card>
        )}

        {/* Processing Status */}
        <Card style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <Text style={styles.statusTitle}>Processing Status</Text>
            <View style={[
              styles.statusBadge,
              { backgroundColor: getProcessingStatusColor(receipt.processing_status) }
            ]}>
              <Text style={styles.statusBadgeText}>
                {getProcessingStatusText(receipt.processing_status)}
              </Text>
            </View>
          </View>
          
          {receipt.ocr_confidence && (
            <Text style={styles.confidenceText}>
              OCR Confidence: {(receipt.ocr_confidence * 100).toFixed(1)}%
            </Text>
          )}
        </Card>

        {/* Receipt Details */}
        <Card style={styles.detailsCard}>
          <Text style={styles.cardTitle}>Receipt Details</Text>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Merchant:</Text>
            <Text style={styles.detailValue}>
              {receipt.merchant_name || 'Not specified'}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Amount:</Text>
            <Text style={styles.detailValue}>
              {receipt.amount 
                ? formatCurrency(receipt.amount, receipt.currency)
                : 'Not specified'
              }
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date:</Text>
            <Text style={styles.detailValue}>
              {receipt.transaction_date 
                ? formatDate(receipt.transaction_date)
                : 'Not specified'
              }
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Category:</Text>
            <Text style={styles.detailValue}>
              {category?.name || 'Uncategorized'}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Verified:</Text>
            <Text style={[
              styles.detailValue,
              { color: receipt.is_verified ? COLORS.success[600] : COLORS.warning[600] }
            ]}>
              {receipt.is_verified ? 'Yes' : 'No'}
            </Text>
          </View>

          {receipt.notes && (
            <View style={styles.notesSection}>
              <Text style={styles.detailLabel}>Notes:</Text>
              <Text style={styles.notesText}>{receipt.notes}</Text>
            </View>
          )}
        </Card>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Button
            title="Edit Receipt"
            onPress={handleEdit}
            style={styles.editButton}
          />
          
          <Button
            title="Delete Receipt"
            onPress={handleDelete}
            variant="outline"
            loading={processing}
            style={[styles.deleteButton, { borderColor: COLORS.error[500] }]}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray[50],
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: FONT_SIZES.base,
    color: COLORS.gray[600],
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  errorText: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.error[600],
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  imageCard: {
    margin: SPACING.md,
    padding: 0,
    overflow: 'hidden',
  },
  receiptImage: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
  },
  statusCard: {
    margin: SPACING.md,
    padding: SPACING.lg,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  statusTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.gray[900],
  },
  statusBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 12,
  },
  statusBadgeText: {
    color: 'white',
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
  },
  confidenceText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[600],
  },
  detailsCard: {
    margin: SPACING.md,
    padding: SPACING.lg,
  },
  cardTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.gray[900],
    marginBottom: SPACING.lg,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  detailLabel: {
    fontSize: FONT_SIZES.base,
    color: COLORS.gray[600],
    fontWeight: '500',
  },
  detailValue: {
    fontSize: FONT_SIZES.base,
    color: COLORS.gray[900],
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  notesSection: {
    marginTop: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[200],
  },
  notesText: {
    fontSize: FONT_SIZES.base,
    color: COLORS.gray[700],
    marginTop: SPACING.xs,
    lineHeight: 20,
  },
  actionButtons: {
    padding: SPACING.lg,
    gap: SPACING.md,
  },
  editButton: {
    backgroundColor: COLORS.primary[500],
  },
  deleteButton: {
    borderColor: COLORS.error[500],
  },
});

export default ReceiptDetailScreen;
