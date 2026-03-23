import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, TextInput, Animated, Platform } from 'react-native';
import { Layout } from '../components/common/Layout';
import { Text } from '../components/common/Text';
import { Card } from '../components/common/Card';
import { theme } from '../theme';
import { useAnalysis } from '../context/AnalysisContext';
import { getHistory } from '../services/api';
import { ChevronRight, Database, FileText, Search, Calendar } from 'lucide-react-native';
import { ScreenHeader } from '../components/common/ScreenHeader';

export const AdminScreen: React.FC<any> = ({ navigation }) => {
  const [history, setHistory] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const { setResult } = useAnalysis();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const fetchData = async () => {
    try {
      const data = await getHistory();
      setHistory(data);
      setFiltered(data);
    } catch (err) {
      console.error('Failed to fetch:', err);
    }
  };

  useEffect(() => {
    fetchData();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFiltered(history);
    } else {
      const q = searchQuery.toLowerCase();
      setFiltered(history.filter((item: any) =>
        item.diagnosis?.toLowerCase().includes(q) ||
        item.familySummary?.toLowerCase().includes(q)
      ));
    }
  }, [searchQuery, history]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  return (
    <Layout>
      <ScreenHeader showBack />
      
      <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
        <View style={styles.headerTop}>
          <View style={styles.headerIcon}>
            <Database size={20} color={theme.colors.secondary} />
          </View>
          <View>
            <Text variant="headlineMd" color="primary" style={styles.headerTitle}>
              All Records
            </Text>
            <Text variant="bodyMd" color="onSurfaceVariant">
              {history.length} analysis {history.length === 1 ? 'record' : 'records'}
            </Text>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Search size={16} color={theme.colors.outline} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by diagnosis..."
            placeholderTextColor={theme.colors.outlineVariant}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </Animated.View>

      <FlatList
        data={filtered}
        keyExtractor={(item, index) => item._id || index.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[theme.colors.secondary]}
          />
        }
        ListEmptyComponent={
          <Card level={1} style={styles.emptyCard}>
            <FileText size={32} color={theme.colors.outlineVariant} />
            <Text variant="bodyLg" color="onSurfaceVariant" align="center" style={styles.emptyText}>
              {searchQuery ? 'No matching records found' : 'No records yet'}
            </Text>
          </Card>
        }
        renderItem={({ item, index }) => (
          <Card
            level={1}
            style={[
              styles.recordCard,
              index % 2 === 0 && styles.recordCardAlt,
            ]}
            onPress={() => {
              setResult(item);
              navigation.navigate('Result');
            }}
          >
            <View style={styles.recordLeft}>
              <View style={[
                styles.statusIndicator,
                { backgroundColor: theme.colors.success }
              ]} />
              <View style={styles.recordInfo}>
                <Text variant="bodyLg" color="primary" numberOfLines={1} style={styles.recordTitle}>
                  {item.diagnosis}
                </Text>
                <View style={styles.recordMeta}>
                  <Calendar size={12} color={theme.colors.outline} />
                  <Text variant="labelMd" color="outline">
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
                        })
                      : 'Unknown date'}
                  </Text>
                </View>
                {item.medications?.length > 0 && (
                  <View style={styles.medBadgeRow}>
                    <View style={styles.medBadge}>
                      <Text variant="labelMd" color="secondary" style={styles.badgeText}>
                        {item.medications.length} medication{item.medications.length > 1 ? 's' : ''}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            </View>
            <ChevronRight color={theme.colors.outlineVariant} size={16} />
          </Card>
        )}
      />
    </Layout>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: theme.spacing.lg,
    gap: theme.spacing.lg,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  headerIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: theme.colors.secondaryContainer,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontWeight: '700',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.surfaceContainerLow,
    borderRadius: theme.roundness.xl,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: Platform.OS === 'web' ? 10 : 0,
    ...Platform.select({
      web: {
        boxShadow: `0 1px 3px ${theme.colors.shadow}`,
      } as any,
      default: {
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 1,
      },
    }),
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: theme.colors.onSurface,
    paddingVertical: 10,
  },
  listContainer: {
    padding: theme.spacing.lg,
    paddingTop: 0,
    gap: theme.spacing.sm,
  },
  recordCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  recordCardAlt: {
    backgroundColor: theme.colors.surfaceContainerLowest,
  },
  recordLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    flex: 1,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  recordInfo: {
    flex: 1,
    gap: 4,
  },
  recordTitle: {
    fontWeight: '600',
  },
  recordMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  medBadgeRow: {
    flexDirection: 'row',
    marginTop: 4,
  },
  medBadge: {
    backgroundColor: theme.colors.secondaryContainer,
    paddingVertical: 2,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  emptyCard: {
    padding: theme.spacing.xxl,
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  emptyText: {
    marginTop: theme.spacing.sm,
  },
});
