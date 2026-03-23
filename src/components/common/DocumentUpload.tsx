import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Text } from './Text';
import { theme } from '../../theme';
import { FileUp } from 'lucide-react-native';
import * as DocumentPicker from 'expo-document-picker';
import { useAnalysis } from '../../context/AnalysisContext';
import { analyseDocument } from '../../services/api';
import { useNavigation } from '@react-navigation/native';

interface DocumentUploadProps {
  compact?: boolean;
  metadata?: {
    age?: string | number;
    language?: string;
  };
  customButton?: React.ReactNode;
}

export const DocumentUpload: React.FC<DocumentUploadProps> = ({ 
  compact = false, 
  metadata = {},
  customButton 
}) => {
  const [loading, setLoading] = useState(false);
  const { setResult, setLoading: setGlobalLoading, setError } = useAnalysis();
  const navigation = useNavigation<any>();

  const handleDocumentScan = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      setLoading(true);
      setGlobalLoading(true);
      setError(null);
      
      const file = result.assets[0];
      const analysis = await analyseDocument(
        file.uri, 
        file.name, 
        file.mimeType || 'application/pdf',
        metadata?.age?.toString(),
        metadata?.language
      );
      
      setResult(analysis);
      navigation.navigate('Result');
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to analyze document.");
    } finally {
      setLoading(false);
      setGlobalLoading(false);
    }
  };

  if (compact && customButton) {
    return (
      <TouchableOpacity 
        onPress={handleDocumentScan}
        disabled={loading}
        activeOpacity={0.8}
        style={styles.compactButtonContainer}
      >
        {loading ? (
          <View style={styles.loadingWrapper}>
            <ActivityIndicator color={theme.colors.secondary} />
            <Text variant="labelMd" color="secondary" style={styles.loadingText}>Analyzing...</Text>
          </View>
        ) : (
          customButton
        )}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity 
      style={styles.uploadBox} 
      onPress={handleDocumentScan}
      disabled={loading}
      activeOpacity={0.7}
    >
      <View style={styles.uploadIconContainer}>
        <FileUp size={48} color={theme.colors.primary} />
      </View>
      <View style={styles.uploadInfo}>
        <Text variant="title" color="primary">Click or drag to upload document</Text>
        <Text variant="labelMd" color="onSurfaceVariant" style={styles.uploadSubtitle}>
          Supports PDF, JPG, PNG (Max 10MB)
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  uploadBox: {
    padding: theme.spacing.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.lg,
    backgroundColor: theme.colors.surfaceContainerLowest,
    borderStyle: 'dashed',
    borderWidth: 1.5,
    borderColor: theme.colors.outlineVariant,
    borderRadius: theme.roundness.xl,
    minHeight: 280,
    width: '100%',
  },
  uploadIconContainer: {
    marginBottom: theme.spacing.xs,
  },
  uploadInfo: {
    alignItems: 'center',
    gap: 8,
  },
  uploadSubtitle: {
    marginTop: theme.spacing.sm,
    opacity: 0.7,
  },
  compactButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: theme.colors.secondaryContainer,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 6,
  },
  loadingText: {
    fontWeight: '600',
  }
});
