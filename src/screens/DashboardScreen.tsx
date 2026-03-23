import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, Animated, Platform } from 'react-native';
import { Layout } from '../components/common/Layout';
import { Text } from '../components/common/Text';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { theme } from '../theme';
import { Activity, Heart, Thermometer, ChevronRight, Scan, TrendingUp, Clock } from 'lucide-react-native';
import { useAnalysis } from '../context/AnalysisContext';
import { ScreenHeader } from '../components/common/ScreenHeader';
import { getHistory } from '../services/api';

export const DashboardScreen: React.FC<any> = ({ navigation }) => {
  const { result, history, setHistory, setResult, setLoading, setError } = useAnalysis();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  React.useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const data = await getHistory();
        setHistory(data);
      } catch (err) {
        console.error('Failed to fetch history:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Layout scrollable>
      <ScreenHeader />
      
      {/* Welcome Section */}
      <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.greetingRow}>
          <View>
            <Text variant="bodyMd" color="onSurfaceVariant">Good {getGreeting()}</Text>
            <Text variant="headlineMd" color="primary" style={styles.welcomeName}>Welcome back 👋</Text>
          </View>
          <View style={styles.dateChip}>
            <Clock size={12} color={theme.colors.outline} />
            <Text variant="labelMd" color="outline">{getFormattedDate()}</Text>
          </View>
        </View>
      </Animated.View>

      {/* Stat Cards */}
      <Animated.View style={[styles.statsContainer, { opacity: fadeAnim }]}>
        <Card level={1} style={styles.statCard}>
          <View style={styles.statIconCircle}>
            <Heart color={theme.colors.error} size={18} />
          </View>
          <Text variant="labelMd" color="onSurfaceVariant" style={styles.statLabel}>Heart Rate</Text>
          <Text variant="headlineMd" color="primary" style={styles.statValue}>72</Text>
          <Text variant="labelMd" color="secondary">bpm • Normal</Text>
        </Card>
        <Card level={1} style={styles.statCard}>
          <View style={[styles.statIconCircle, { backgroundColor: theme.colors.secondaryContainer }]}>
            <Activity color={theme.colors.secondary} size={18} />
          </View>
          <Text variant="labelMd" color="onSurfaceVariant" style={styles.statLabel}>Activity</Text>
          <Text variant="headlineMd" color="primary" style={styles.statValue}>8.4k</Text>
          <View style={styles.trendRow}>
            <TrendingUp size={12} color={theme.colors.success} />
            <Text variant="labelMd" color="success">+12% steps</Text>
          </View>
        </Card>
      </Animated.View>

      {/* Recent Results */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text variant="title" style={styles.sectionLabel}>Recent Results</Text>
          <Button 
            title="View All" 
            variant="ghost" 
            onPress={() => navigation.navigate('Admin')} 
          />
        </View>
        
        {history.length > 0 ? (
          history.slice(0, 5).map((item: any, index: number) => (
            <Card 
              key={item._id || index}
              level={1} 
              style={styles.resultCard}
              onPress={() => {
                setResult(item);
                navigation.navigate('Result');
              }}
            >
              <View style={styles.resultLeft}>
                <View style={styles.resultDot} />
                <View style={styles.resultInfo}>
                  <Text variant="bodyLg" color="primary" numberOfLines={1}>{item.diagnosis}</Text>
                  <Text variant="labelMd" color="onSurfaceVariant">
                    {item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-US', { 
                      month: 'short', day: 'numeric', year: 'numeric' 
                    }) : 'Recent'}
                  </Text>
                </View>
              </View>
              <ChevronRight color={theme.colors.outlineVariant} size={18} />
            </Card>
          ))
        ) : (
          <Card level={1} style={styles.emptyCard}>
            <Text variant="bodyLg" color="onSurfaceVariant" align="center">
              No scans yet. Upload a report to get started!
            </Text>
          </Card>
        )}
      </View>

      {/* CTA Card */}
      <Card level={2} style={styles.ctaCard}>
        <Text variant="headlineMd" color="onPrimary" style={styles.ctaTitle}>
          {result ? 'Scan Another Report' : 'Confused by your results?'}
        </Text>
        <Text variant="bodyMd" color="onPrimary" style={styles.ctaSub}>
          {result 
            ? 'Get instant clarity on your other medical documents.'
            : 'Our AI Jargon Translator can help you understand your medical reports in simple terms.'}
        </Text>
        <Button 
          title="Scan Now" 
          variant="secondary" 
          icon={<Scan size={18} color={theme.colors.primary} />}
          onPress={() => navigation.navigate('Translator')} 
          style={styles.ctaButton}
        />
      </Card>
    </Layout>
  );
};

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
}

function getFormattedDate(): string {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

const styles = StyleSheet.create({
  header: {
    padding: theme.spacing.lg,
    paddingTop: theme.spacing.md,
  },
  greetingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  welcomeName: {
    fontWeight: '700',
    marginTop: 4,
  },
  dateChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: theme.colors.surfaceContainerLow,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: theme.roundness.xl,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  statCard: {
    flex: 1,
    gap: 6,
    alignItems: 'flex-start',
  },
  statIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.errorContainer,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  statLabel: {
    textTransform: 'uppercase' as any,
    letterSpacing: 0.5,
    fontSize: 10,
    fontWeight: '600',
  },
  statValue: {
    fontSize: 32,
    fontWeight: '800',
    lineHeight: 36,
  },
  trendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  section: {
    padding: theme.spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionLabel: {
    fontWeight: '700',
  },
  resultCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  resultLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    flex: 1,
  },
  resultDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.secondary,
  },
  resultInfo: {
    gap: 2,
    flex: 1,
  },
  emptyCard: {
    paddingVertical: theme.spacing.xxl,
  },
  ctaCard: {
    margin: theme.spacing.lg,
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.xl,
    borderRadius: theme.roundness.xl,
  },
  ctaTitle: {
    marginBottom: theme.spacing.sm,
    color: '#FFF',
    fontWeight: '700',
  },
  ctaSub: {
    marginBottom: theme.spacing.lg,
    opacity: 0.85,
    color: '#FFF',
  },
  ctaButton: {
    backgroundColor: theme.colors.secondaryContainer,
    alignSelf: 'flex-start',
  },
});
