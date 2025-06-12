import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Button } from '../../components/ui';
import { AuthFlowTester } from '../../components/testing/AuthFlowTester';
import { backendTestService } from '../../services/backendTestService';
import { API_CONFIG } from '../../constants';
import { COLORS, FONT_SIZES, SPACING } from '../../constants';

interface QuickHealthResult {
  isHealthy: boolean;
  criticalIssues: string[];
  responseTime: number;
}

export const BackendTestScreen: React.FC = () => {
  const [healthStatus, setHealthStatus] = useState<QuickHealthResult | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showAuthTester, setShowAuthTester] = useState(false);
  const [fullTestResults, setFullTestResults] = useState<any>(null);
  const [isRunningFullTest, setIsRunningFullTest] = useState(false);

  useEffect(() => {
    checkHealth();
  }, []);

  const checkHealth = async () => {
    try {
      const result = await backendTestService.quickHealthCheck();
      setHealthStatus(result);
    } catch (error) {
      console.error('Health check failed:', error);
      setHealthStatus({
        isHealthy: false,
        criticalIssues: ['Health check failed'],
        responseTime: 0,
      });
    }
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    await checkHealth();
    setIsRefreshing(false);
  };

  const runFullTestSuite = async () => {
    setIsRunningFullTest(true);
    try {
      const results = await backendTestService.runFullTestSuite();
      setFullTestResults(results);
      
      Alert.alert(
        'Test Suite Complete',
        `${results.summary.passed}/${results.summary.totalTests} tests passed\nOverall Health: ${results.summary.overallHealth}`
      );
    } catch (error) {
      console.error('Full test suite failed:', error);
      Alert.alert('Error', 'Failed to run full test suite');
    } finally {
      setIsRunningFullTest(false);
    }
  };

  const getHealthColor = (isHealthy: boolean) => {
    return isHealthy ? COLORS.success[500] : COLORS.error[500];
  };

  const getHealthIcon = (isHealthy: boolean) => {
    return isHealthy ? '🟢' : '🔴';
  };

  const formatResponseTime = (time: number) => {
    if (time < 1000) return `${time}ms`;
    return `${(time / 1000).toFixed(1)}s`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <Card style={styles.headerCard}>
          <Text style={styles.title}>Backend Integration Testing</Text>
          <Text style={styles.subtitle}>
            Test connectivity and functionality with the SpendLot backend API
          </Text>
        </Card>

        {/* API Configuration */}
        <Card style={styles.configCard}>
          <Text style={styles.sectionTitle}>API Configuration</Text>
          <View style={styles.configItem}>
            <Text style={styles.configLabel}>Base URL:</Text>
            <Text style={styles.configValue}>{API_CONFIG.BASE_URL}</Text>
          </View>
          <View style={styles.configItem}>
            <Text style={styles.configLabel}>Timeout:</Text>
            <Text style={styles.configValue}>{API_CONFIG.TIMEOUT}ms</Text>
          </View>
          <View style={styles.configItem}>
            <Text style={styles.configLabel}>Retry Attempts:</Text>
            <Text style={styles.configValue}>{API_CONFIG.RETRY_ATTEMPTS}</Text>
          </View>
        </Card>

        {/* Health Status */}
        <Card style={styles.healthCard}>
          <View style={styles.healthHeader}>
            <Text style={styles.sectionTitle}>Backend Health</Text>
            <TouchableOpacity onPress={checkHealth} style={styles.refreshButton}>
              <Text style={styles.refreshIcon}>🔄</Text>
            </TouchableOpacity>
          </View>

          {healthStatus ? (
            <View style={styles.healthContent}>
              <View style={styles.healthStatus}>
                <Text style={styles.healthIcon}>
                  {getHealthIcon(healthStatus.isHealthy)}
                </Text>
                <Text style={[
                  styles.healthText,
                  { color: getHealthColor(healthStatus.isHealthy) }
                ]}>
                  {healthStatus.isHealthy ? 'Healthy' : 'Unhealthy'}
                </Text>
                <Text style={styles.responseTime}>
                  {formatResponseTime(healthStatus.responseTime)}
                </Text>
              </View>

              {healthStatus.criticalIssues.length > 0 && (
                <View style={styles.issuesContainer}>
                  <Text style={styles.issuesTitle}>Critical Issues:</Text>
                  {healthStatus.criticalIssues.map((issue, index) => (
                    <Text key={index} style={styles.issueText}>
                      • {issue}
                    </Text>
                  ))}
                </View>
              )}
            </View>
          ) : (
            <Text style={styles.loadingText}>Checking health...</Text>
          )}
        </Card>

        {/* Quick Actions */}
        <Card style={styles.actionsCard}>
          <Text style={styles.sectionTitle}>Quick Tests</Text>
          
          <Button
            title="Run Full Test Suite"
            onPress={runFullTestSuite}
            loading={isRunningFullTest}
            style={styles.actionButton}
          />

          <Button
            title={showAuthTester ? "Hide Auth Tester" : "Show Auth Flow Tester"}
            onPress={() => setShowAuthTester(!showAuthTester)}
            variant="outline"
            style={styles.actionButton}
          />
        </Card>

        {/* Full Test Results */}
        {fullTestResults && (
          <Card style={styles.resultsCard}>
            <Text style={styles.sectionTitle}>Last Test Results</Text>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Tests:</Text>
              <Text style={styles.summaryValue}>{fullTestResults.summary.totalTests}</Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Passed:</Text>
              <Text style={[styles.summaryValue, { color: COLORS.success[600] }]}>
                {fullTestResults.summary.passed}
              </Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Failed:</Text>
              <Text style={[styles.summaryValue, { color: COLORS.error[600] }]}>
                {fullTestResults.summary.failed}
              </Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Success Rate:</Text>
              <Text style={styles.summaryValue}>
                {((fullTestResults.summary.passed / fullTestResults.summary.totalTests) * 100).toFixed(1)}%
              </Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Avg Response:</Text>
              <Text style={styles.summaryValue}>
                {formatResponseTime(fullTestResults.summary.averageResponseTime)}
              </Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Overall Health:</Text>
              <Text style={[
                styles.summaryValue,
                { color: getHealthColor(fullTestResults.summary.overallHealth === 'healthy') }
              ]}>
                {fullTestResults.summary.overallHealth.toUpperCase()}
              </Text>
            </View>
          </Card>
        )}

        {/* Auth Flow Tester */}
        {showAuthTester && <AuthFlowTester />}

        {/* Instructions */}
        <Card style={styles.instructionsCard}>
          <Text style={styles.sectionTitle}>Testing Instructions</Text>
          <Text style={styles.instructionText}>
            1. <Text style={styles.bold}>Health Check</Text>: Verify basic backend connectivity
          </Text>
          <Text style={styles.instructionText}>
            2. <Text style={styles.bold}>Full Test Suite</Text>: Test all API endpoints and services
          </Text>
          <Text style={styles.instructionText}>
            3. <Text style={styles.bold}>Auth Flow Tester</Text>: Test complete authentication flow
          </Text>
          <Text style={styles.instructionText}>
            4. <Text style={styles.bold}>Check Console</Text>: View detailed logs in development console
          </Text>
        </Card>
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
  headerCard: {
    margin: SPACING.md,
    padding: SPACING.lg,
    alignItems: 'center',
  },
  title: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.gray[900],
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[600],
    textAlign: 'center',
  },
  configCard: {
    margin: SPACING.md,
    padding: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.gray[900],
    marginBottom: SPACING.md,
  },
  configItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  configLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[600],
  },
  configValue: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[900],
    fontWeight: '600',
  },
  healthCard: {
    margin: SPACING.md,
    padding: SPACING.lg,
  },
  healthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  refreshButton: {
    padding: SPACING.xs,
  },
  refreshIcon: {
    fontSize: 20,
  },
  healthContent: {
    // No additional styles needed
  },
  healthStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  healthIcon: {
    fontSize: 24,
    marginRight: SPACING.sm,
  },
  healthText: {
    flex: 1,
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
  },
  responseTime: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[600],
  },
  issuesContainer: {
    marginTop: SPACING.sm,
    padding: SPACING.sm,
    backgroundColor: COLORS.error[50],
    borderRadius: 8,
  },
  issuesTitle: {
    fontSize: FONT_SIZES.sm,
    fontWeight: 'bold',
    color: COLORS.error[700],
    marginBottom: SPACING.xs,
  },
  issueText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.error[600],
    marginBottom: SPACING.xs,
  },
  loadingText: {
    fontSize: FONT_SIZES.base,
    color: COLORS.gray[600],
    textAlign: 'center',
  },
  actionsCard: {
    margin: SPACING.md,
    padding: SPACING.lg,
  },
  actionButton: {
    marginBottom: SPACING.md,
  },
  resultsCard: {
    margin: SPACING.md,
    padding: SPACING.lg,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  summaryLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[600],
  },
  summaryValue: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[900],
    fontWeight: '600',
  },
  instructionsCard: {
    margin: SPACING.md,
    padding: SPACING.lg,
  },
  instructionText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray[700],
    marginBottom: SPACING.sm,
    lineHeight: 20,
  },
  bold: {
    fontWeight: 'bold',
  },
});

export default BackendTestScreen;
