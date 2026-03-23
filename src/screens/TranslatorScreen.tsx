import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TextInput, ScrollView, Animated, TouchableOpacity, Platform } from 'react-native';
import { ScreenHeader } from '../components/common/ScreenHeader';
import { Layout } from '../components/common/Layout';
import { Text } from '../components/common/Text';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { theme } from '../theme';
import { useAnalysis } from '../context/AnalysisContext';
import { analyseRawText } from '../services/api';
import { DocumentUpload } from '../components/common/DocumentUpload';
import { Languages, Sparkles } from 'lucide-react-native';

export const TranslatorScreen: React.FC<any> = ({ navigation }) => {
  const { setResult, setLoading: setGlobalLoading, setError } = useAnalysis();
  const [text, setText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    if (isTranslating) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.05, duration: 800, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isTranslating]);

  const handleTranslate = async () => {
    if (!text.trim()) return;
    setIsTranslating(true);
    setGlobalLoading(true);
    try {
      const analysis = await analyseRawText(text);
      setResult(analysis);
      navigation.navigate('Result');
    } catch (err: any) {
      setError(err.message || 'Analysis failed');
    } finally {
      setIsTranslating(false);
      setGlobalLoading(false);
    }
  };

  return (
    <Layout scrollable>
      <ScreenHeader showBack />
      
      <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
        <View style={styles.titleRow}>
          <View style={styles.titleIcon}>
            <Sparkles size={20} color={theme.colors.secondary} />
          </View>
          <View>
            <Text variant="headlineMd" color="primary" style={styles.title}>
              Medicine made simple
            </Text>
            <Text variant="bodyMd" color="onSurfaceVariant">
              Paste medical text or upload a document below
            </Text>
          </View>
        </View>
      </Animated.View>

      {/* Text Input Card */}
      <Animated.View style={[styles.inputSection, { opacity: fadeAnim }]}>
        <Card level={1} style={styles.inputCard}>
          <View style={styles.inputHeader}>
            <Languages size={16} color={theme.colors.outline} />
            <Text variant="labelMd" color="outline" style={styles.inputLabel}>MEDICAL TEXT</Text>
          </View>
          <TextInput
            style={styles.textInput}
            placeholder="Paste your medical report, prescription, or lab results here..."
            placeholderTextColor={theme.colors.outlineVariant}
            multiline
            numberOfLines={6}
            value={text}
            onChangeText={setText}
            textAlignVertical="top"
          />
          {text.length > 0 && (
            <Text variant="labelMd" color="outline" style={styles.charCount}>
              {text.length} characters
            </Text>
          )}
        </Card>

        {isTranslating ? (
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <Card level={2} style={styles.loadingCard}>
              <Text variant="bodyLg" color="primary" align="center" style={styles.loadingText}>
                🔬 Analyzing your document...
              </Text>
              <Text variant="bodyMd" color="onSurfaceVariant" align="center">
                Our AI is translating medical jargon into simple language
              </Text>
            </Card>
          </Animated.View>
        ) : (
          <Button
            title="Translate Medical Text"
            onPress={handleTranslate}
            disabled={!text.trim()}
            loading={isTranslating}
            style={styles.translateBtn}
          />
        )}
      </Animated.View>

      {/* Divider */}
      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <Text variant="labelMd" color="outline" style={styles.dividerText}>OR UPLOAD A FILE</Text>
        <View style={styles.dividerLine} />
      </View>

      {/* Document Upload */}
      <View style={styles.uploadSection}>
        <DocumentUpload />
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  titleIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: theme.colors.secondaryContainer,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontWeight: '700',
  },
  inputSection: {
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  inputCard: {
    gap: theme.spacing.sm,
  },
  inputHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
  textInput: {
    fontSize: 16,
    lineHeight: 24,
    color: theme.colors.onSurface,
    minHeight: 140,
    padding: 0,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  charCount: {
    textAlign: 'right',
    marginTop: 4,
  },
  translateBtn: {
    marginTop: theme.spacing.xs,
  },
  loadingCard: {
    padding: theme.spacing.xl,
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.surfaceContainerLow,
  },
  loadingText: {
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
    gap: theme.spacing.md,
    marginVertical: theme.spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.outlineVariant,
  },
  dividerText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
  uploadSection: {
    padding: theme.spacing.lg,
    paddingTop: 0,
  },
});
