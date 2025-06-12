import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  FlatList,
  Image,
  Alert,
} from 'react-native';
import { Card, Button, Loading } from '../../components/ui';
import { receiptService } from '../../services/receiptService';
import { Receipt } from '../../types';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../../constants';

interface ReceiptsScreenProps {
  navigation: any;
}

export const ReceiptsScreen: React.FC<ReceiptsScreenProps> = ({ navigation }) => {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadReceipts();
  }, []);

  const loadReceipts = async () => {
    try {
      setIsLoading(true);
      const response = await receiptService.getReceipts();

      if (response.success && response.data) {
        setReceipts(response.data.items || []);
      } else {
        console.error('Failed to load receipts:', response.error);
        Alert.alert('Error', response.error || 'Failed to load receipts');
      }
    } catch (error) {
      console.error('Error loading receipts:', error);
      Alert.alert('Error', 'Failed to load receipts');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadReceipts();
    setIsRefreshing(false);
  };

  const handleScanReceipt = async () => {
    navigation.navigate('ReceiptCamera');
  };

  const handleGalleryUpload = async () => {
    navigation.navigate('ReceiptGallery');
  };

  const handleReceiptPress = (receipt: Receipt) => {
    navigation.navigate('ReceiptDetail', { receiptId: receipt.id.toString() });
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
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

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Processed';
      case 'pending':
        return 'Processing...';
      case 'failed':
        return 'Failed';
      default:
        return 'Unknown';
    }
  };

  const renderReceiptItem = ({ item }: { item: Receipt }) => (
    <TouchableOpacity
      style={styles.receiptItem}
      onPress={() => handleReceiptPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.receiptLeft}>
        {item.file_path && (
          <Image source={{ uri: item.file_path }} style={styles.receiptThumbnail} />
        )}
        <View style={styles.receiptInfo}>
          <Text style={styles.merchantName} numberOfLines={1}>
            {item.merchant_name || 'Unknown Merchant'}
          </Text>
          <Text style={styles.receiptDate}>
            {item.transaction_date ? formatDate(item.transaction_date) : 'No date'}
          </Text>
          <View style={styles.statusContainer}>
            <View style={[
              styles.statusDot,
              { backgroundColor: getStatusColor(item.processing_status) }
            ]} />
            <Text style={styles.statusText}>
              {getStatusText(item.processing_status)}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.receiptRight}>
        <Text style={styles.receiptAmount}>
          {item.amount
            ? formatCurrency(item.amount, item.currency)
            : 'No amount'
          }
        </Text>
        {item.is_verified && (
          <View style={styles.verifiedBadge}>
            <Text style={styles.verifiedText}>✓ Verified</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Loading text="Loading receipts..." />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Receipts</Text>
          <Text style={styles.subtitle}>
            Scan and manage your receipts
          </Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.primaryAction} onPress={handleScanReceipt}>
            <View style={styles.actionIcon}>
              <Text style={styles.actionEmoji}>📷</Text>
            </View>
            <Text style={styles.actionTitle}>Scan Receipt</Text>
            <Text style={styles.actionSubtitle}>Take a photo with camera</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryAction} onPress={handleGalleryUpload}>
            <View style={styles.actionIconSmall}>
              <Text style={styles.actionEmojiSmall}>🖼️</Text>
            </View>
            <Text style={styles.actionTitleSmall}>Upload from Gallery</Text>
          </TouchableOpacity>
        </View>

        {/* Empty State */}
        {receipts.length === 0 && (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyText}>📄 No receipts yet</Text>
            <Text style={styles.emptySubtext}>
              Start by scanning your first receipt to track your expenses
            </Text>

            <View style={styles.emptyActions}>
              <Button
                title="Get Started"
                onPress={handleScanReceipt}
                style={styles.getStartedButton}
              />
            </View>
          </Card>
        )}

        {/* Receipt List */}
        {receipts.length > 0 && (
          <View style={styles.receiptsList}>
            <Text style={styles.sectionTitle}>Recent Receipts</Text>
            <FlatList
              data={receipts}
              renderItem={renderReceiptItem}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          </View>
        )}
      </ScrollView>
    </View>
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
  content: {
    padding: SPACING.lg,
  },
  header: {
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: FONT_SIZES['2xl'],
    fontWeight: 'bold',
    color: COLORS.gray[900],
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONT_SIZES.base,
    color: COLORS.gray[600],
  },
  quickActions: {
    marginBottom: SPACING.xl,
  },
  primaryAction: {
    backgroundColor: COLORS.primary[500],
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    marginBottom: SPACING.md,
    shadowColor: COLORS.primary[500],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  actionIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  actionEmoji: {
    fontSize: 40,
  },
  actionTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: SPACING.xs,
  },
  actionSubtitle: {
    fontSize: FONT_SIZES.base,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
  secondaryAction: {
    backgroundColor: 'white',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: COLORS.gray[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  actionIconSmall: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  actionEmojiSmall: {
    fontSize: 24,
  },
  actionTitleSmall: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    color: COLORS.gray[900],
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: SPACING['2xl'],
  },
  emptyText: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.gray[700],
    marginBottom: SPACING.sm,
  },
  emptySubtext: {
    fontSize: FONT_SIZES.base,
    color: COLORS.gray[500],
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: SPACING.xl,
    maxWidth: 280,
  },
  emptyActions: {
    width: '100%',
    alignItems: 'center',
  },
  getStartedButton: {
    minWidth: 200,
  },
  receiptsList: {
    marginTop: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.gray[900],
    marginBottom: SPACING.md,
  },
  receiptItem: {
    backgroundColor: 'white',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: COLORS.gray[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  receiptLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  receiptThumbnail: {
    width: 60,
    height: 60,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.gray[200],
    marginRight: SPACING.md,
  },
  receiptInfo: {
    flex: 1,
  },
  merchantName: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    color: COLORS.gray[900],
    marginBottom: SPACING.xs,
  },
  receiptDate: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[600],
    marginBottom: SPACING.xs,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: SPACING.xs,
  },
  statusText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.gray[600],
    fontWeight: '500',
  },
  receiptRight: {
    alignItems: 'flex-end',
  },
  receiptAmount: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.gray[900],
    marginBottom: SPACING.xs,
  },
  verifiedBadge: {
    backgroundColor: COLORS.success[100],
    paddingHorizontal: SPACING.xs,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
  },
  verifiedText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.success[700],
    fontWeight: '600',
  },
  separator: {
    height: SPACING.sm,
  },
});

export default ReceiptsScreen;
