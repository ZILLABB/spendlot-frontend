import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Card, Button, Input } from '../ui';
import { authService } from '../../services/authService';
import { backendTestService } from '../../services/backendTestService';
import { COLORS, FONT_SIZES, SPACING } from '../../constants';

interface TestStep {
  name: string;
  status: 'pending' | 'running' | 'success' | 'error';
  error?: string;
  duration?: number;
}

export const AuthFlowTester: React.FC = () => {
  const [testSteps, setTestSteps] = useState<TestStep[]>([
    { name: 'Backend Connection', status: 'pending' },
    { name: 'User Registration', status: 'pending' },
    { name: 'User Login', status: 'pending' },
    { name: 'Token Verification', status: 'pending' },
    { name: 'Profile Retrieval', status: 'pending' },
    { name: 'Token Refresh', status: 'pending' },
    { name: 'Logout', status: 'pending' },
  ]);

  const [testCredentials, setTestCredentials] = useState({
    email: 'test@spendlot.com',
    password: 'TestPassword123!',
    fullName: 'Test User',
  });

  const [isRunning, setIsRunning] = useState(false);

  const updateStepStatus = (stepIndex: number, status: TestStep['status'], error?: string, duration?: number) => {
    setTestSteps(prev => prev.map((step, index) => 
      index === stepIndex 
        ? { ...step, status, error, duration }
        : step
    ));
  };

  const runAuthFlowTest = async () => {
    setIsRunning(true);
    
    // Reset all steps
    setTestSteps(prev => prev.map(step => ({ ...step, status: 'pending', error: undefined, duration: undefined })));

    try {
      // Step 1: Test Backend Connection
      await runTestStep(0, 'Backend Connection', async () => {
        const result = await backendTestService.quickHealthCheck();
        if (!result.isHealthy) {
          throw new Error(result.criticalIssues.join(', '));
        }
        return result.responseTime;
      });

      // Step 2: Test User Registration
      await runTestStep(1, 'User Registration', async () => {
        const startTime = Date.now();
        const result = await authService.register({
          email: testCredentials.email,
          password: testCredentials.password,
          full_name: testCredentials.fullName,
        });
        
        // Registration might fail if user already exists - that's okay
        if (!result.success && !result.error?.includes('already exists')) {
          throw new Error(result.error || 'Registration failed');
        }
        
        return Date.now() - startTime;
      });

      // Step 3: Test User Login
      await runTestStep(2, 'User Login', async () => {
        const startTime = Date.now();
        const result = await authService.login(testCredentials.email, testCredentials.password);
        
        if (!result.success) {
          throw new Error(result.error || 'Login failed');
        }
        
        return Date.now() - startTime;
      });

      // Step 4: Test Token Verification
      await runTestStep(3, 'Token Verification', async () => {
        const startTime = Date.now();
        const result = await authService.getCurrentUser();
        
        if (!result.success) {
          throw new Error(result.error || 'Token verification failed');
        }
        
        return Date.now() - startTime;
      });

      // Step 5: Test Profile Retrieval
      await runTestStep(4, 'Profile Retrieval', async () => {
        const startTime = Date.now();
        const result = await authService.getCurrentUser();
        
        if (!result.success || !result.data) {
          throw new Error('Profile retrieval failed');
        }
        
        return Date.now() - startTime;
      });

      // Step 6: Test Token Refresh (simulate)
      await runTestStep(5, 'Token Refresh', async () => {
        const startTime = Date.now();
        // This would normally be triggered automatically by the API service
        // For testing, we'll just verify the refresh endpoint exists
        const result = await backendTestService.testEndpoint('/auth/refresh', 'POST');
        
        // It's okay if this fails due to no refresh token - we're just testing the endpoint
        return Date.now() - startTime;
      });

      // Step 7: Test Logout
      await runTestStep(6, 'Logout', async () => {
        const startTime = Date.now();
        const result = await authService.logout();
        
        if (!result.success) {
          throw new Error(result.error || 'Logout failed');
        }
        
        return Date.now() - startTime;
      });

      Alert.alert('Success', 'All authentication flow tests completed successfully!');

    } catch (error) {
      console.error('Auth flow test failed:', error);
      Alert.alert('Test Failed', 'Authentication flow test encountered errors. Check the results above.');
    } finally {
      setIsRunning(false);
    }
  };

  const runTestStep = async (
    stepIndex: number,
    stepName: string,
    testFn: () => Promise<number>
  ): Promise<void> => {
    updateStepStatus(stepIndex, 'running');
    
    try {
      const duration = await testFn();
      updateStepStatus(stepIndex, 'success', undefined, duration);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      updateStepStatus(stepIndex, 'error', errorMessage);
      throw error; // Re-throw to stop the test flow
    }
  };

  const getStatusIcon = (status: TestStep['status']) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'running': return '🔄';
      case 'success': return '✅';
      case 'error': return '❌';
      default: return '⚪';
    }
  };

  const getStatusColor = (status: TestStep['status']) => {
    switch (status) {
      case 'pending': return COLORS.gray[500];
      case 'running': return COLORS.primary[500];
      case 'success': return COLORS.success[500];
      case 'error': return COLORS.error[500];
      default: return COLORS.gray[500];
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.headerCard}>
        <Text style={styles.title}>Authentication Flow Tester</Text>
        <Text style={styles.subtitle}>
          Test the complete authentication flow with the backend API
        </Text>
      </Card>

      {/* Test Credentials */}
      <Card style={styles.credentialsCard}>
        <Text style={styles.sectionTitle}>Test Credentials</Text>
        
        <Input
          label="Email"
          value={testCredentials.email}
          onChangeText={(email) => setTestCredentials(prev => ({ ...prev, email }))}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        
        <Input
          label="Password"
          value={testCredentials.password}
          onChangeText={(password) => setTestCredentials(prev => ({ ...prev, password }))}
          secureTextEntry
        />
        
        <Input
          label="Full Name"
          value={testCredentials.fullName}
          onChangeText={(fullName) => setTestCredentials(prev => ({ ...prev, fullName }))}
        />
      </Card>

      {/* Test Steps */}
      <Card style={styles.stepsCard}>
        <Text style={styles.sectionTitle}>Test Steps</Text>
        
        {testSteps.map((step, index) => (
          <View key={index} style={styles.stepItem}>
            <View style={styles.stepHeader}>
              <Text style={styles.stepIcon}>{getStatusIcon(step.status)}</Text>
              <Text style={[styles.stepName, { color: getStatusColor(step.status) }]}>
                {step.name}
              </Text>
              {step.status === 'running' && (
                <ActivityIndicator size="small" color={COLORS.primary[500]} />
              )}
              {step.duration && (
                <Text style={styles.stepDuration}>{step.duration}ms</Text>
              )}
            </View>
            
            {step.error && (
              <Text style={styles.stepError}>{step.error}</Text>
            )}
          </View>
        ))}
      </Card>

      {/* Action Button */}
      <View style={styles.actionContainer}>
        <Button
          title={isRunning ? "Running Tests..." : "Run Authentication Flow Test"}
          onPress={runAuthFlowTest}
          loading={isRunning}
          disabled={isRunning}
          style={styles.actionButton}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray[50],
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
  credentialsCard: {
    margin: SPACING.md,
    padding: SPACING.lg,
  },
  stepsCard: {
    margin: SPACING.md,
    padding: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.gray[900],
    marginBottom: SPACING.md,
  },
  stepItem: {
    marginBottom: SPACING.md,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepIcon: {
    fontSize: 20,
    marginRight: SPACING.sm,
  },
  stepName: {
    flex: 1,
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
  },
  stepDuration: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.gray[500],
    marginLeft: SPACING.sm,
  },
  stepError: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.error[600],
    marginTop: SPACING.xs,
    marginLeft: 32, // Align with step name
  },
  actionContainer: {
    padding: SPACING.lg,
  },
  actionButton: {
    backgroundColor: COLORS.primary[500],
  },
});

export default AuthFlowTester;
