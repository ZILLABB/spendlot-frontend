import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Animated,
  TextInput,
  Modal,
} from 'react-native';
import { Card, Button, Loading, Input } from '../../components/ui';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, DEFAULT_CATEGORIES } from '../../constants';
import { Transaction } from '../../types';
import { transactionService } from '../../services/transactionService';

interface TransactionsScreenProps {
  navigation: any;
}

interface FilterState {
  category: string;
  dateRange: 'all' | 'week' | 'month' | 'year';
  minAmount: string;
  maxAmount: string;
}

export const TransactionsScreen: React.FC<TransactionsScreenProps> = ({ navigation }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    category: 'all',
    dateRange: 'all',
    minAmount: '',
    maxAmount: '',
  });

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    loadTransactions();

    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [transactions, searchQuery, filters]);

  const loadTransactions = async () => {
    try {
      setIsLoading(true);

      // Use mock data for now
      const mockTransactions = await transactionService.getMockTransactions();
      setTransactions(mockTransactions);
    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadTransactions();
    setIsRefreshing(false);
  };

  const applyFilters = () => {
    let filtered = [...transactions];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(transaction =>
        transaction.merchantName.toLowerCase().includes(query) ||
        transaction.description?.toLowerCase().includes(query) ||
        transaction.category.name.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (filters.category !== 'all') {
      filtered = filtered.filter(transaction =>
        transaction.category.id === filters.category
      );
    }

    // Date range filter
    if (filters.dateRange !== 'all') {
      const now = new Date();
      const filterDate = new Date();

      switch (filters.dateRange) {
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
        case 'year':
          filterDate.setFullYear(now.getFullYear() - 1);
          break;
      }

      filtered = filtered.filter(transaction =>
        new Date(transaction.date) >= filterDate
      );
    }

    // Amount filters
    if (filters.minAmount) {
      const min = parseFloat(filters.minAmount);
      filtered = filtered.filter(transaction => transaction.amount >= min);
    }

    if (filters.maxAmount) {
      const max = parseFloat(filters.maxAmount);
      filtered = filtered.filter(transaction => transaction.amount <= max);
    }

    setFilteredTransactions(filtered);
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'receipt': return '📄';
      case 'bank': return '🏦';
      case 'manual': return '✏️';
      default: return '💳';
    }
  };

  const handleTransactionPress = (transaction: Transaction) => {
    // TODO: Navigate to transaction detail
    console.log('Transaction pressed:', transaction.id);
  };

  const handleAddTransaction = () => {
    setShowAddModal(true);
  };

  const clearFilters = () => {
    setFilters({
      category: 'all',
      dateRange: 'all',
      minAmount: '',
      maxAmount: '',
    });
    setSearchQuery('');
  };

  const renderTransactionItem = ({ item, index }: { item: Transaction; index: number }) => {
    const animatedStyle = {
      opacity: fadeAnim,
      transform: [{
        translateY: slideAnim.interpolate({
          inputRange: [0, 50],
          outputRange: [0, 50],
        }),
      }],
    };

    return (
      <Animated.View style={[animatedStyle, { marginBottom: SPACING.sm }]}>
        <TouchableOpacity
          style={styles.transactionItem}
          onPress={() => handleTransactionPress(item)}
          activeOpacity={0.7}
        >
          <View style={styles.transactionLeft}>
            <View style={[styles.categoryIcon, { backgroundColor: item.category.color + '20' }]}>
              <Text style={styles.categoryEmoji}>{item.category.icon}</Text>
            </View>

            <View style={styles.transactionInfo}>
              <Text style={styles.merchantName}>{item.merchantName}</Text>
              <Text style={styles.categoryName}>{item.category.name}</Text>
              <Text style={styles.transactionDate}>{formatDate(item.date)}</Text>
            </View>
          </View>

          <View style={styles.transactionRight}>
            <Text style={styles.transactionAmount}>
              {formatAmount(item.amount, item.currency)}
            </Text>
            <View style={styles.sourceContainer}>
              <Text style={styles.sourceIcon}>{getSourceIcon(item.source)}</Text>
              <Text style={styles.sourceText}>{item.source}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Loading text="Loading transactions..." />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Transactions</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddTransaction}
        >
          <Text style={styles.addButtonText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      {/* Search and Filters */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search transactions..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={COLORS.gray[400]}
          />
          <Text style={styles.searchIcon}>🔍</Text>
        </View>

        <TouchableOpacity
          style={[styles.filterButton, showFilters && styles.filterButtonActive]}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Text style={styles.filterIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Panel */}
      {showFilters && (
        <Card style={styles.filterPanel}>
          <View style={styles.filterRow}>
            <Text style={styles.filterLabel}>Category:</Text>
            <View style={styles.filterOptions}>
              <TouchableOpacity
                style={[
                  styles.filterOption,
                  filters.category === 'all' && styles.filterOptionActive
                ]}
                onPress={() => setFilters(prev => ({ ...prev, category: 'all' }))}
              >
                <Text style={styles.filterOptionText}>All</Text>
              </TouchableOpacity>
              {DEFAULT_CATEGORIES.slice(0, 3).map(category => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.filterOption,
                    filters.category === category.id && styles.filterOptionActive
                  ]}
                  onPress={() => setFilters(prev => ({ ...prev, category: category.id }))}
                >
                  <Text style={styles.filterOptionText}>{category.icon}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.filterActions}>
            <Button
              title="Clear"
              onPress={clearFilters}
              variant="outline"
              size="small"
              style={styles.filterActionButton}
            />
            <Button
              title="Apply"
              onPress={() => setShowFilters(false)}
              size="small"
              style={styles.filterActionButton}
            />
          </View>
        </Card>
      )}

      {/* Transaction List */}
      {filteredTransactions.length === 0 ? (
        <Card style={styles.emptyCard}>
          <Text style={styles.emptyText}>
            {searchQuery || filters.category !== 'all' ? '🔍 No matching transactions' : '💳 No transactions yet'}
          </Text>
          <Text style={styles.emptySubtext}>
            {searchQuery || filters.category !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Start by scanning a receipt or adding a transaction manually'
            }
          </Text>

          {!searchQuery && filters.category === 'all' && (
            <Button
              title="Add Transaction"
              onPress={handleAddTransaction}
              style={styles.emptyActionButton}
            />
          )}
        </Card>
      ) : (
        <FlatList
          data={filteredTransactions}
          renderItem={renderTransactionItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
          }
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Summary Footer */}
      {filteredTransactions.length > 0 && (
        <View style={styles.summaryFooter}>
          <Text style={styles.summaryText}>
            {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''}
          </Text>
          <Text style={styles.summaryAmount}>
            Total: {formatAmount(
              filteredTransactions.reduce((sum, t) => sum + t.amount, 0),
              'USD'
            )}
          </Text>
        </View>
      )}

      {/* Add Transaction Modal - Placeholder */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowAddModal(false)}>
              <Text style={styles.modalCloseButton}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Add Transaction</Text>
            <TouchableOpacity>
              <Text style={styles.modalSaveButton}>Save</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <Text style={styles.modalPlaceholder}>
              Transaction form will be implemented here
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray[50],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  title: {
    fontSize: FONT_SIZES['2xl'],
    fontWeight: 'bold',
    color: COLORS.gray[900],
  },
  addButton: {
    backgroundColor: COLORS.primary[500],
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
  },
  addButtonText: {
    color: 'white',
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
    gap: SPACING.sm,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.gray[100],
    borderRadius: BORDER_RADIUS.lg,
    paddingHorizontal: SPACING.md,
  },
  searchInput: {
    flex: 1,
    fontSize: FONT_SIZES.base,
    color: COLORS.gray[900],
    paddingVertical: SPACING.sm,
  },
  searchIcon: {
    fontSize: 16,
    marginLeft: SPACING.xs,
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: COLORS.primary[100],
  },
  filterIcon: {
    fontSize: 18,
  },
  filterPanel: {
    margin: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  filterRow: {
    marginBottom: SPACING.md,
  },
  filterLabel: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.gray[700],
    marginBottom: SPACING.xs,
  },
  filterOptions: {
    flexDirection: 'row',
    gap: SPACING.xs,
  },
  filterOption: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.gray[100],
    minWidth: 40,
    alignItems: 'center',
  },
  filterOptionActive: {
    backgroundColor: COLORS.primary[500],
  },
  filterOptionText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[700],
  },
  filterActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: SPACING.sm,
  },
  filterActionButton: {
    minWidth: 80,
  },
  listContainer: {
    padding: SPACING.lg,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    shadowColor: COLORS.gray[900],
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  categoryEmoji: {
    fontSize: 24,
  },
  transactionInfo: {
    flex: 1,
  },
  merchantName: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    color: COLORS.gray[900],
    marginBottom: 2,
  },
  categoryName: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[600],
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.gray[500],
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.gray[900],
    marginBottom: 2,
  },
  sourceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sourceIcon: {
    fontSize: 12,
  },
  sourceText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.gray[500],
    textTransform: 'capitalize',
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: SPACING['2xl'],
    margin: SPACING.lg,
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
  emptyActionButton: {
    minWidth: 200,
  },
  summaryFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[200],
  },
  summaryText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[600],
  },
  summaryAmount: {
    fontSize: FONT_SIZES.base,
    fontWeight: 'bold',
    color: COLORS.gray[900],
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  modalCloseButton: {
    fontSize: FONT_SIZES.base,
    color: COLORS.gray[600],
  },
  modalTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.gray[900],
  },
  modalSaveButton: {
    fontSize: FONT_SIZES.base,
    color: COLORS.primary[600],
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  modalPlaceholder: {
    fontSize: FONT_SIZES.base,
    color: COLORS.gray[500],
    textAlign: 'center',
  },
});

export default TransactionsScreen;
