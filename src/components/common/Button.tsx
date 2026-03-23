import React, { useRef } from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle, ActivityIndicator, View, Animated, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../../theme';
import { Text } from './Text';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
  icon,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const isPrimary = variant === 'primary';

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        style={[
          styles.base,
          isPrimary && styles.primaryShadow,
          disabled && styles.disabled,
          style,
        ]}
      >
        {isPrimary ? (
          <LinearGradient
            colors={theme.colors.primaryGradient as any}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
          >
            {loading ? (
              <ActivityIndicator color={theme.colors.onPrimary} />
            ) : (
              <View style={styles.contentRow}>
                {icon && <View style={styles.iconContainer}>{icon}</View>}
                <Text variant="labelMd" color="onPrimary" align="center">
                  {title}
                </Text>
              </View>
            )}
          </LinearGradient>
        ) : (
          <React.Fragment>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color={theme.colors.primary} size="small" />
              </View>
            ) : (
              <View style={styles.contentRow}>
                {icon && <View style={styles.iconContainer}>{icon}</View>}
                {title ? (
                  <Text
                    variant="labelMd"
                    color={variant === 'ghost' ? 'primary' : 'onSurface'}
                    align="center"
                  >
                    {title}
                  </Text>
                ) : null}
              </View>
            )}
          </React.Fragment>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: theme.roundness.lg,
    overflow: 'hidden',
    minWidth: 120,
    justifyContent: 'center',
    paddingVertical: theme.spacing.sm,
  },
  gradient: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.roundness.lg,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
  },
  iconContainer: {},
  loadingContainer: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    alignItems: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
  primaryShadow: {
    ...Platform.select({
      web: {
        boxShadow: `0 4px 14px ${theme.colors.shadowMedium}`,
      } as any,
      default: {
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
      },
    }),
  },
});
