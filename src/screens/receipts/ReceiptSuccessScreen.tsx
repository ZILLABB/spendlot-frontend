import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
// import * as Haptics from 'expo-haptics';
import { Button, Card } from '../../components/ui';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../../constants';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface ReceiptSuccessScreenProps {
  navigation: any;
  route: {
    params: {
      receiptId: string;
    };
  };
}

export const ReceiptSuccessScreen: React.FC<ReceiptSuccessScreenProps> = ({
  navigation,
  route,
}) => {
  const { receiptId } = route.params;
  
  // Animations
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const checkmarkAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entrance animations
    Animated.sequence([
      // Scale in the success icon
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
      // Fade in content
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
      ]),
      // Animate checkmark
      Animated.timing(checkmarkAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleViewReceipt = async () => {
    // navigation.navigate('ReceiptDetail', { receiptId });
    Alert.alert('Coming Soon', 'Receipt detail view will be available soon!');
  };

  const handleAddAnother = async () => {
    navigation.navigate('ReceiptCamera');
  };

  const handleGoHome = async () => {
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Success Icon */}
        <Animated.View 
          style={[
            styles.iconContainer,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View style={styles.successIcon}>
            <Animated.Text 
              style={[
                styles.checkmark,
                {
                  opacity: checkmarkAnim,
                  transform: [{
                    scale: checkmarkAnim.interpolate({
                      inputRange: [0, 0.5, 1],
                      outputRange: [0, 1.2, 1],
                    }),
                  }],
                },
              ]}
            >
              ✓
            </Animated.Text>
          </View>
        </Animated.View>

        {/* Success Message */}
        <Animated.View 
          style={[
            styles.messageContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.title}>Receipt Saved!</Text>
          <Text style={styles.subtitle}>
            Your receipt has been successfully processed and saved to your account.
          </Text>
        </Animated.View>

        {/* Stats Card */}
        <Animated.View 
          style={[
            styles.statsContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Card style={styles.statsCard}>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>📄</Text>
                <Text style={styles.statLabel}>Receipt</Text>
                <Text style={styles.statSubLabel}>Processed</Text>
              </View>
              
              <View style={styles.statDivider} />
              
              <View style={styles.statItem}>
                <Text style={styles.statValue}>🔍</Text>
                <Text style={styles.statLabel}>Text</Text>
                <Text style={styles.statSubLabel}>Extracted</Text>
              </View>
              
              <View style={styles.statDivider} />
              
              <View style={styles.statItem}>
                <Text style={styles.statValue}>💾</Text>
                <Text style={styles.statLabel}>Data</Text>
                <Text style={styles.statSubLabel}>Saved</Text>
              </View>
            </View>
          </Card>
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View 
          style={[
            styles.quickActions,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.quickActionsTitle}>What's next?</Text>
          
          <TouchableOpacity style={styles.quickActionItem} onPress={handleViewReceipt}>
            <View style={styles.quickActionIcon}>
              <Text style={styles.quickActionEmoji}>👁️</Text>
            </View>
            <View style={styles.quickActionContent}>
              <Text style={styles.quickActionTitle}>View Receipt</Text>
              <Text style={styles.quickActionSubtitle}>See details and edit if needed</Text>
            </View>
            <Text style={styles.quickActionArrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.quickActionItem} onPress={handleAddAnother}>
            <View style={styles.quickActionIcon}>
              <Text style={styles.quickActionEmoji}>📷</Text>
            </View>
            <View style={styles.quickActionContent}>
              <Text style={styles.quickActionTitle}>Add Another</Text>
              <Text style={styles.quickActionSubtitle}>Scan another receipt</Text>
            </View>
            <Text style={styles.quickActionArrow}>→</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* Action Buttons */}
      <Animated.View 
        style={[
          styles.actionButtons,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Button
          title="View Receipt"
          onPress={handleViewReceipt}
          variant="outline"
          style={styles.actionButton}
        />
        <Button
          title="Done"
          onPress={handleGoHome}
          style={styles.actionButton}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray[50],
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.lg,
  },
  iconContainer: {
    marginBottom: SPACING.xl,
  },
  successIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.success[500],
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.success[500],
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  checkmark: {
    fontSize: 60,
    color: 'white',
    fontWeight: 'bold',
  },
  messageContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: FONT_SIZES['3xl'],
    fontWeight: 'bold',
    color: COLORS.gray[900],
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FONT_SIZES.base,
    color: COLORS.gray[600],
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: SCREEN_WIDTH * 0.8,
  },
  statsContainer: {
    width: '100%',
    marginBottom: SPACING.xl,
  },
  statsCard: {
    paddingVertical: SPACING.lg,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 32,
    marginBottom: SPACING.xs,
  },
  statLabel: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.gray[900],
    marginBottom: 2,
  },
  statSubLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.gray[500],
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: COLORS.gray[200],
  },
  quickActions: {
    width: '100%',
    marginBottom: SPACING.xl,
  },
  quickActionsTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.gray[900],
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  quickActionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.sm,
    shadowColor: COLORS.gray[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  quickActionEmoji: {
    fontSize: 24,
  },
  quickActionContent: {
    flex: 1,
  },
  quickActionTitle: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    color: COLORS.gray[900],
    marginBottom: 2,
  },
  quickActionSubtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[600],
  },
  quickActionArrow: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.gray[400],
    fontWeight: 'bold',
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

export default ReceiptSuccessScreen;
