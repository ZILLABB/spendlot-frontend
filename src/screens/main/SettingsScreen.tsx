import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../hooks/useTheme';
import { Card, Button } from '../../components/ui';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../../constants';

interface SettingsScreenProps {
  navigation: any;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const { user, logout } = useAuth();
  const { notifications, updateNotificationSettings } = useApp();
  const { theme, effectiveTheme, colors, setTheme } = useTheme();
  const [showThemeModal, setShowThemeModal] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: logout
        },
      ]
    );
  };

  const getThemeDisplayName = (themeValue: 'light' | 'dark' | 'system') => {
    switch (themeValue) {
      case 'light': return 'Light';
      case 'dark': return 'Dark';
      case 'system': return 'System';
      default: return 'System';
    }
  };

  const getThemeIcon = (themeValue: 'light' | 'dark' | 'system') => {
    switch (themeValue) {
      case 'light': return '☀️';
      case 'dark': return '🌙';
      case 'system': return '📱';
      default: return '📱';
    }
  };

  const handleThemeChange = async (newTheme: 'light' | 'dark' | 'system') => {
    await setTheme(newTheme);
    setShowThemeModal(false);
  };

  const handleNotificationToggle = async (key: keyof typeof notifications, value: boolean) => {
    await updateNotificationSettings({ [key]: value });
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background.secondary }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text.primary }]}>Settings</Text>

        {/* Profile Section */}
        <Card style={[styles.profileCard, { backgroundColor: colors.surface.primary }]}>
          <Text style={[styles.profileName, { color: colors.text.primary }]}>
            {user?.firstName} {user?.lastName}
          </Text>
          <Text style={[styles.profileEmail, { color: colors.text.secondary }]}>
            {user?.email}
          </Text>
        </Card>

        {/* Appearance Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Appearance</Text>

          <Card style={[styles.optionCard, { backgroundColor: colors.surface.primary }]}>
            <TouchableOpacity
              style={styles.optionRow}
              onPress={() => setShowThemeModal(true)}
            >
              <View style={styles.optionLeft}>
                <Text style={styles.optionIcon}>{getThemeIcon(theme)}</Text>
                <View style={styles.optionInfo}>
                  <Text style={[styles.optionTitle, { color: colors.text.primary }]}>Theme</Text>
                  <Text style={[styles.optionSubtitle, { color: colors.text.secondary }]}>
                    {getThemeDisplayName(theme)}
                  </Text>
                </View>
              </View>
              <Text style={[styles.optionArrow, { color: colors.text.tertiary }]}>›</Text>
            </TouchableOpacity>
          </Card>
        </View>

        {/* Notifications Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Notifications</Text>

          <Card style={[styles.optionCard, { backgroundColor: colors.surface.primary }]}>
            <View style={styles.notificationOption}>
              <View style={styles.optionLeft}>
                <Text style={styles.optionIcon}>🔔</Text>
                <View style={styles.optionInfo}>
                  <Text style={[styles.optionTitle, { color: colors.text.primary }]}>Push Notifications</Text>
                  <Text style={[styles.optionSubtitle, { color: colors.text.secondary }]}>
                    Receive app notifications
                  </Text>
                </View>
              </View>
              <Switch
                value={notifications.enabled}
                onValueChange={(value) => handleNotificationToggle('enabled', value)}
                trackColor={{ false: colors.gray[300], true: colors.primary[200] }}
                thumbColor={notifications.enabled ? colors.primary[500] : colors.gray[400]}
              />
            </View>
          </Card>

          <Card style={[styles.optionCard, { backgroundColor: colors.surface.primary }]}>
            <View style={styles.notificationOption}>
              <View style={styles.optionLeft}>
                <Text style={styles.optionIcon}>📄</Text>
                <View style={styles.optionInfo}>
                  <Text style={[styles.optionTitle, { color: colors.text.primary }]}>Receipt Processing</Text>
                  <Text style={[styles.optionSubtitle, { color: colors.text.secondary }]}>
                    OCR completion alerts
                  </Text>
                </View>
              </View>
              <Switch
                value={notifications.receiptProcessing}
                onValueChange={(value) => handleNotificationToggle('receiptProcessing', value)}
                trackColor={{ false: colors.gray[300], true: colors.primary[200] }}
                thumbColor={notifications.receiptProcessing ? colors.primary[500] : colors.gray[400]}
              />
            </View>
          </Card>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Account</Text>

          <Card style={[styles.optionCard, { backgroundColor: colors.surface.primary }]}>
            <TouchableOpacity style={styles.optionRow}>
              <View style={styles.optionLeft}>
                <Text style={styles.optionIcon}>👤</Text>
                <Text style={[styles.optionTitle, { color: colors.text.primary }]}>Edit Profile</Text>
              </View>
              <Text style={[styles.optionArrow, { color: colors.text.tertiary }]}>›</Text>
            </TouchableOpacity>
          </Card>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Data</Text>

          <Card style={[styles.optionCard, { backgroundColor: colors.surface.primary }]}>
            <TouchableOpacity style={styles.optionRow}>
              <View style={styles.optionLeft}>
                <Text style={styles.optionIcon}>📤</Text>
                <Text style={[styles.optionTitle, { color: colors.text.primary }]}>Export Data</Text>
              </View>
              <Text style={[styles.optionArrow, { color: colors.text.tertiary }]}>›</Text>
            </TouchableOpacity>
          </Card>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Integrations</Text>

          <Card style={[styles.optionCard, { backgroundColor: colors.surface.primary }]}>
            <TouchableOpacity style={styles.optionRow}>
              <View style={styles.optionLeft}>
                <Text style={styles.optionIcon}>📧</Text>
                <Text style={[styles.optionTitle, { color: colors.text.primary }]}>Connect Gmail</Text>
              </View>
              <Text style={[styles.optionArrow, { color: colors.text.tertiary }]}>›</Text>
            </TouchableOpacity>
          </Card>

          <Card style={[styles.optionCard, { backgroundColor: colors.surface.primary }]}>
            <TouchableOpacity
              style={styles.optionRow}
              onPress={() => navigation.navigate('BankAccounts')}
            >
              <View style={styles.optionLeft}>
                <Text style={styles.optionIcon}>🏦</Text>
                <Text style={[styles.optionTitle, { color: colors.text.primary }]}>Bank Accounts</Text>
              </View>
              <Text style={[styles.optionArrow, { color: colors.text.tertiary }]}>›</Text>
            </TouchableOpacity>
          </Card>

          {/* Development/Testing Section */}
          {__DEV__ && (
            <>
              <Text style={[styles.sectionHeader, { color: colors.text.secondary }]}>
                Development
              </Text>

              <Card style={[styles.optionCard, { backgroundColor: colors.surface.primary }]}>
                <TouchableOpacity
                  style={styles.optionRow}
                  onPress={() => navigation.navigate('BackendTest')}
                >
                  <View style={styles.optionLeft}>
                    <Text style={styles.optionIcon}>🧪</Text>
                    <Text style={[styles.optionTitle, { color: colors.text.primary }]}>Backend Testing</Text>
                  </View>
                  <Text style={[styles.optionArrow, { color: colors.text.tertiary }]}>›</Text>
                </TouchableOpacity>
              </Card>
            </>
          )}
        </View>

        {/* Logout Button */}
        <Button
          title="Sign Out"
          onPress={handleLogout}
          variant="outline"
          style={[styles.logoutButton, { borderColor: colors.error[500] }]}
        />
      </View>

      {/* Theme Selection Modal */}
      {showThemeModal && (
        <View style={styles.modalOverlay}>
          <View style={[styles.themeModal, { backgroundColor: colors.surface.elevated }]}>
            <Text style={[styles.modalTitle, { color: colors.text.primary }]}>Choose Theme</Text>

            {(['light', 'dark', 'system'] as const).map((themeOption) => (
              <TouchableOpacity
                key={themeOption}
                style={[
                  styles.themeOption,
                  theme === themeOption && { backgroundColor: colors.primary[100] },
                  { borderColor: colors.border.primary }
                ]}
                onPress={() => handleThemeChange(themeOption)}
              >
                <Text style={styles.themeOptionIcon}>{getThemeIcon(themeOption)}</Text>
                <View style={styles.themeOptionInfo}>
                  <Text style={[
                    styles.themeOptionTitle,
                    { color: colors.text.primary },
                    theme === themeOption && { color: colors.primary[700] }
                  ]}>
                    {getThemeDisplayName(themeOption)}
                  </Text>
                  <Text style={[styles.themeOptionSubtitle, { color: colors.text.secondary }]}>
                    {themeOption === 'system'
                      ? 'Follow system settings'
                      : `Always use ${themeOption} mode`
                    }
                  </Text>
                </View>
                {theme === themeOption && (
                  <Text style={[styles.checkmark, { color: colors.primary[600] }]}>✓</Text>
                )}
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={[styles.modalCloseButton, { backgroundColor: colors.gray[200] }]}
              onPress={() => setShowThemeModal(false)}
            >
              <Text style={[styles.modalCloseButtonText, { color: colors.text.primary }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: SPACING.lg,
  },
  title: {
    fontSize: FONT_SIZES['2xl'],
    fontWeight: 'bold',
    marginBottom: SPACING.xl,
  },
  profileCard: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
    marginBottom: SPACING.xl,
  },
  profileName: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    marginBottom: SPACING.xs,
  },
  profileEmail: {
    fontSize: FONT_SIZES.base,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    marginBottom: SPACING.md,
  },
  optionCard: {
    marginBottom: SPACING.sm,
    paddingVertical: 0,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionIcon: {
    fontSize: 20,
    marginRight: SPACING.md,
    width: 24,
    textAlign: 'center',
  },
  optionInfo: {
    flex: 1,
  },
  optionTitle: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    marginBottom: 2,
  },
  optionSubtitle: {
    fontSize: FONT_SIZES.sm,
  },
  optionArrow: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  notificationOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
  },
  logoutButton: {
    marginTop: SPACING.xl,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  themeModal: {
    margin: SPACING.lg,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    minWidth: 280,
  },
  modalTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.sm,
    borderWidth: 1,
  },
  themeOptionIcon: {
    fontSize: 24,
    marginRight: SPACING.md,
    width: 32,
    textAlign: 'center',
  },
  themeOptionInfo: {
    flex: 1,
  },
  themeOptionTitle: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    marginBottom: 2,
  },
  themeOptionSubtitle: {
    fontSize: FONT_SIZES.sm,
  },
  checkmark: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalCloseButton: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  modalCloseButtonText: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
  },
});

export default SettingsScreen;
