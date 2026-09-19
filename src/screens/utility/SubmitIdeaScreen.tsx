import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Colors, Typography, BorderRadius, Shadows, Spacing } from '../../constants/colors';
import { Header } from '../../components/common/Header';
import { CustomButton } from '../../components/common/CustomButton';
import { AppIcon } from '../../components/common/AppIcon';
import { mockUser } from '../../mocks/userData';

interface SubmitIdeaScreenProps {
  navigation: any;
}

export const SubmitIdeaScreen: React.FC<SubmitIdeaScreenProps> = ({
  navigation,
}) => {
  const [ideaText, setIdeaText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = () => {
    if (!ideaText.trim()) {
      Alert.alert('Empty Idea', 'Please type your suggestion or feedback before submitting.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIdeaText('');
      Alert.alert(
        'Thank You!',
        'Your suggestion has been submitted to the Matka Bro team.',
        [
          {
            text: 'Done',
            onPress: () => navigation.goBack(),
          },
        ],
      );
    }, 700);
  };

  return (
    <View style={styles.container}>
      <Header
        title="Submit Your Idea"
        showBack={true}
        walletBalance={mockUser.walletBalance}
        onBackPress={() => navigation.goBack()}
        onWalletPress={() => navigation.navigate('AddFund')}
        onNotificationPress={() => navigation.navigate('Notifications')}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <View style={[styles.card, Shadows.sm]}>
            <View style={styles.iconCircle}>
              <AppIcon name="idea" size={32} color={Colors.accent} />
            </View>
            <Text style={styles.cardTitle}>Have an Idea or Suggestion?</Text>
            <Text style={styles.cardSubtitle}>
              Tell us how we can improve Matka Bro for you. We value your feedback!
            </Text>

            <TextInput
              style={styles.textArea}
              placeholder="Type your ideas, new feature requests, or feedback here..."
              placeholderTextColor={Colors.textMuted}
              value={ideaText}
              onChangeText={setIdeaText}
              multiline={true}
              numberOfLines={6}
              textAlignVertical="top"
            />

            <CustomButton
              title="SUBMIT YOUR IDEA"
              onPress={handleSubmit}
              loading={loading}
              variant="primary"
              size="large"
              style={styles.submitBtn}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  card: {
    backgroundColor: Colors.cardBg,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primaryMuted,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  cardTitle: {
    fontSize: Typography.fontSizes.md,
    fontWeight: Typography.fontWeights.heavy,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  cardSubtitle: {
    fontSize: Typography.fontSizes.xs,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: Spacing.lg,
    lineHeight: 18,
  },
  textArea: {
    width: '100%',
    minHeight: 140,
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    padding: Spacing.md,
    fontSize: Typography.fontSizes.sm,
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
  },
  submitBtn: {
    width: '100%',
  },
});
