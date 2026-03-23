import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Share, Animated, Platform } from 'react-native';
import { Layout } from '../components/common/Layout';
import { Text } from '../components/common/Text';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { theme } from '../theme';
import { useAnalysis } from '../context/AnalysisContext';
import { ScreenHeader } from '../components/common/ScreenHeader';
import { 
  FileText, 
  Pill, 
  AlertCircle, 
  Calendar, 
  Users, 
  Share2
} from 'lucide-react-native';

export const ResultScreen: React.FC<any> = ({ navigation }) => {
  const { result } = useAnalysis();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  if (!result) {
    return (
      <Layout>
        <ScreenHeader showBack />
        <View style={styles.emptyState}>
          <Text variant="headlineMd">No results found</Text>
          <Button title="Go Back" onPress={() => navigation.goBack()} />
        </View>
      </Layout>
    );
  }

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Medical Summary: ${result.familySummary}\n\nDiagnosis: ${result.diagnosis}`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Layout scrollable>
      <ScreenHeader showBack />
      
      {/* Header Badge */}
      <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
        <View style={styles.statusBadge}>
          <View style={styles.statusDot} />
          <Text variant="labelMd" color="secondary">Analysis Complete</Text>
        </View>
        <Text variant="headlineMd" color="primary" style={styles.headerTitle}>Your Results</Text>
      </Animated.View>

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Simplified Diagnosis */}
        <Card level={2} style={styles.mainCard}>
          <View style={styles.sectionHeader}>
            <View style={styles.iconBadge}>
              <FileText size={16} color={theme.colors.onPrimary} />
            </View>
            <Text variant="title" color="onPrimary" style={styles.sectionLabel}>Simplified Diagnosis</Text>
          </View>
          <Text variant="bodyLg" style={styles.diagnosisText} color="onPrimary">
            {result.diagnosis}
          </Text>
        </Card>

        {/* Medications */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.iconBadge, { backgroundColor: theme.colors.secondary }]}>
              <Pill size={16} color={theme.colors.onPrimary} />
            </View>
            <Text variant="title">Prescribed Medications</Text>
          </View>
          {result.medications.map((med: any, index: number) => (
            <Card key={index} level={1} style={styles.medCard}>
              <View style={styles.medHeader}>
                <Text variant="title" color="primary" style={styles.flexText}>{med.name}</Text>
                <View style={styles.dosageBadge}>
                  <Text variant="labelMd" color="secondary" style={styles.dosageText}>{med.dosage}</Text>
                </View>
              </View>
              <View style={styles.medDetail}>
                <Text variant="bodyMd" color="onSurfaceVariant" style={styles.flexText}>{med.timing}</Text>
                <View style={styles.durationChip}>
                  <Text variant="labelMd" color="outline">{med.duration}</Text>
                </View>
              </View>
            </Card>
          ))}
        </View>

        {/* Side Effects */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.iconBadge, { backgroundColor: theme.colors.error }]}>
              <AlertCircle size={16} color={theme.colors.onPrimary} />
            </View>
            <Text variant="title">Important Warnings</Text>
          </View>
          {result.sideEffects.map((side: any, index: number) => (
            <Card key={index} level={1} style={styles.warningCard}>
              <Text variant="bodyMd" color="error" style={styles.boldText}>
                ⚠️ {side.effect}
              </Text>
              <Text variant="bodyMd" color="onSurfaceVariant">
                {side.action}
              </Text>
            </Card>
          ))}
        </View>

        {/* Follow Up */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.iconBadge, { backgroundColor: theme.colors.info }]}>
              <Calendar size={16} color={theme.colors.onPrimary} />
            </View>
            <Text variant="title">Next Steps</Text>
          </View>
          <Card level={1} style={styles.listCard}>
            {result.followUp.map((step: string, index: number) => (
              <View key={index} style={styles.listItem}>
                <View style={styles.stepCircle}>
                  <Text variant="labelMd" color="primary" style={styles.stepNum}>{index + 1}</Text>
                </View>
                <Text variant="bodyMd" style={styles.stepText}>{step}</Text>
              </View>
            ))}
          </Card>
        </View>

        {/* Family Summary */}
        <Card level={2} style={styles.summaryCard}>
          <View style={styles.sectionHeader}>
            <View style={[styles.iconBadge, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
              <Users size={16} color={theme.colors.onPrimary} />
            </View>
            <Text variant="title" color="onPrimary">Caregiver Summary</Text>
          </View>
          <Text variant="bodyMd" color="onPrimary" style={styles.summaryText}>
            {result.familySummary}
          </Text>
        </Card>

        <Button 
          title="Share Analysis" 
          icon={<Share2 size={18} color="white" />}
          onPress={handleShare}
          style={styles.shareButton}
        />
      </Animated.View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: theme.colors.secondaryContainer,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.secondary,
  },
  headerTitle: {
    fontWeight: '700',
    marginTop: 4,
  },
  content: {
    padding: theme.spacing.lg,
    gap: theme.spacing.lg,
  },
  mainCard: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.roundness.xl,
  },
  section: {
    gap: theme.spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  sectionLabel: {
    fontWeight: '600',
  },
  iconBadge: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: theme.colors.primaryContainer,
    justifyContent: 'center',
    alignItems: 'center',
  },
  diagnosisText: {
    lineHeight: 26,
    marginTop: theme.spacing.sm,
    opacity: 0.95,
  },
  medCard: {
    gap: theme.spacing.sm,
  },
  medHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dosageBadge: {
    backgroundColor: theme.colors.secondaryContainer,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  dosageText: {
    fontWeight: '700',
    fontSize: 12,
  },
  flexText: {
    flex: 1,
    marginRight: 8,
    flexWrap: 'wrap',
  },
  medDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  durationChip: {
    backgroundColor: theme.colors.surfaceContainerHigh,
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  warningCard: {
    gap: 6,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.error,
  },
  boldText: {
    fontWeight: '700',
  },
  listCard: {
    padding: theme.spacing.md,
    gap: theme.spacing.md,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.md,
  },
  stepCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.surfaceContainerHigh,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNum: {
    fontSize: 11,
    fontWeight: '700',
  },
  stepText: {
    flex: 1,
    lineHeight: 22,
  },
  summaryCard: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.xl,
    borderRadius: theme.roundness.xl,
  },
  summaryText: {
    opacity: 0.9,
    lineHeight: 24,
    marginTop: theme.spacing.sm,
  },
  shareButton: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
});
