import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Colors, Typography, BorderRadius, Shadows, Spacing } from '../../constants/colors';
import { Header } from '../../components/common/Header';
import { AppIcon } from '../../components/common/AppIcon';
import { mockUser } from '../../mocks/userData';

interface SettingsScreenProps {
  navigation: any;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  navigation,
}) => {
  const [pushEnabled, setPushEnabled] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [biometricsEnabled, setBiometricsEnabled] = useState<boolean>(false);

  const handleChangePin = () => {
    Alert.prompt
      ? Alert.prompt(
          'Change M-Pin',
          'Enter new 4-digit M-Pin:',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Save',
              onPress: (pin) => {
                if (pin && pin.length === 4) {
                  Alert.alert('Success', 'M-Pin updated successfully!');
                } else {
                  Alert.alert('Error', 'PIN must be 4 digits.');
                }
              },
            },
          ],
          'plain-text',
          '',
          'number-pad',
        )
      : Alert.alert('Change M-Pin', 'M-Pin update prompt is ready for integration.');
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to log out of Matka Bro?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Header
        title="Settings"
        showBack={true}
        walletBalance={mockUser.walletBalance}
        onBackPress={() => navigation.goBack()}
        onWalletPress={() => navigation.navigate('AddFund')}
        onNotificationPress={() => navigation.navigate('Notifications')}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* User Card */}
        <View style={[styles.userCard, Shadows.sm]}>
          <View style={styles.userAvatar}>
            <AppIcon name="user" size={26} color={Colors.primary} />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{mockUser.name}</Text>
            <Text style={styles.userMobile}>{mockUser.mobile}</Text>
          </View>
        </View>

        {/* Security Settings */}
        <View style={[styles.sectionCard, Shadows.sm]}>
          <Text style={styles.sectionTitle}>SECURITY & ACCESS</Text>

          <TouchableOpacity
            style={styles.settingRow}
            onPress={handleChangePin}
            activeOpacity={0.7}>
            <View style={styles.iconCircle}>
              <AppIcon name="lock" size={16} color={Colors.primary} />
            </View>
            <Text style={styles.settingLabel}>Change 4-Digit M-Pin</Text>
            <AppIcon name="play" size={11} color={Colors.textMuted} />
          </TouchableOpacity>

          <View style={styles.settingRow}>
            <View style={styles.iconCircle}>
              <AppIcon name="lock" size={16} color={Colors.primary} />
            </View>
            <Text style={styles.settingLabel}>Biometric / Fingerprint Unlock</Text>
            <Switch
              value={biometricsEnabled}
              onValueChange={setBiometricsEnabled}
              trackColor={{ false: Colors.border, true: Colors.primaryLight }}
              thumbColor={biometricsEnabled ? Colors.primary : '#f4f3f4'}
            />
          </View>

          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => navigation.navigate('AdminDashboard')}
            activeOpacity={0.7}>
            <View
              style={[
                styles.iconCircle,
                { backgroundColor: 'rgba(255, 179, 0, 0.2)' },
              ]}>
              <AppIcon name="shield" size={16} color={Colors.accentDark} />
            </View>
            <Text style={[styles.settingLabel, { color: Colors.textPrimary, fontWeight: Typography.fontWeights.bold }]}>
              Admin Control Panel
            </Text>
            <AppIcon name="play" size={11} color={Colors.accentDark} />
          </TouchableOpacity>
        </View>

        {/* Notification Preferences */}
        <View style={[styles.sectionCard, Shadows.sm]}>
          <Text style={styles.sectionTitle}>PREFERENCES</Text>

          <View style={styles.settingRow}>
            <View style={styles.iconCircle}>
              <AppIcon name="bell" size={16} color={Colors.primary} />
            </View>
            <Text style={styles.settingLabel}>Game Result Alerts</Text>
            <Switch
              value={pushEnabled}
              onValueChange={setPushEnabled}
              trackColor={{ false: Colors.border, true: Colors.primaryLight }}
              thumbColor={pushEnabled ? Colors.primary : '#f4f3f4'}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.iconCircle}>
              <AppIcon name="bell" size={16} color={Colors.primary} />
            </View>
            <Text style={styles.settingLabel}>Sound Effects & Vibration</Text>
            <Switch
              value={soundEnabled}
              onValueChange={setSoundEnabled}
              trackColor={{ false: Colors.border, true: Colors.primaryLight }}
              thumbColor={soundEnabled ? Colors.primary : '#f4f3f4'}
            />
          </View>
        </View>

        {/* Support & Legal */}
        <View style={[styles.sectionCard, Shadows.sm]}>
          <Text style={styles.sectionTitle}>ABOUT & SUPPORT</Text>

          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => navigation.navigate('HowToPlay')}
            activeOpacity={0.7}>
            <View style={styles.iconCircle}>
              <AppIcon name="info" size={16} color={Colors.primary} />
            </View>
            <Text style={styles.settingLabel}>Rules & How To Play</Text>
            <AppIcon name="play" size={11} color={Colors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => navigation.navigate('SubmitIdea')}
            activeOpacity={0.7}>
            <View style={styles.iconCircle}>
              <AppIcon name="idea" size={16} color={Colors.primary} />
            </View>
            <Text style={styles.settingLabel}>Feedback & Suggestions</Text>
            <AppIcon name="play" size={11} color={Colors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingRow}
            onPress={handleLogout}
            activeOpacity={0.7}>
            <View
              style={[
                styles.iconCircle,
                { backgroundColor: Colors.errorLight },
              ]}>
              <AppIcon name="logout" size={16} color={Colors.error} />
            </View>
            <Text style={[styles.settingLabel, { color: Colors.error, fontWeight: Typography.fontWeights.bold }]}>
              Log Out
            </Text>
            <AppIcon name="play" size={11} color={Colors.error} />
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.appVersion}>Matka Bro Official Version 1.0.0 (Build 100)</Text>
          <Text style={styles.appCopyright}>© 2026 Matka Bro. All rights reserved.</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxxl,
  },
  userCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primaryMuted,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.heavy,
    color: Colors.textPrimary,
  },
  userMobile: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.textSecondary,
    marginTop: 2,
    fontWeight: Typography.fontWeights.medium,
  },
  sectionCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: Typography.fontSizes.xxs,
    fontWeight: Typography.fontWeights.heavy,
    color: Colors.textSecondary,
    paddingHorizontal: Spacing.md,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: Colors.surfaceSubtle,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    letterSpacing: 0.8,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primaryMuted,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  settingLabel: {
    fontSize: Typography.fontSizes.sm,
    color: Colors.textPrimary,
    flex: 1,
    fontWeight: Typography.fontWeights.semibold,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
  },
  appVersion: {
    fontSize: Typography.fontSizes.xs,
    fontWeight: Typography.fontWeights.semibold,
    color: Colors.textSecondary,
  },
  appCopyright: {
    fontSize: Typography.fontSizes.xxs,
    color: Colors.textMuted,
    marginTop: 2,
  },
});
