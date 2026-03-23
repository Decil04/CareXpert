import React from 'react';
import { View, ViewStyle, StyleSheet, TouchableOpacity, StyleProp, Platform, Animated } from 'react-native';
import { theme } from '../../theme';

interface CardProps {
  children: React.ReactNode;
  level?: 1 | 2 | 3;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  elevated?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, level = 1, style, onPress, elevated = true }) => {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const getBackgroundColor = () => {
    switch (level) {
      case 1: return theme.colors.surfaceContainerLow;
      case 2: return theme.colors.surfaceContainer;
      case 3: return theme.colors.surfaceContainerHighest;
      default: return theme.colors.surfaceContainer;
    }
  };

  const getShadow = () => {
    if (!elevated) return {};
    switch (level) {
      case 1: return styles.shadowSm;
      case 2: return styles.shadowMd;
      case 3: return styles.shadowLg;
      default: return styles.shadowSm;
    }
  };

  const handlePressIn = () => {
    if (onPress) {
      Animated.spring(scaleAnim, {
        toValue: 0.97,
        useNativeDriver: true,
        speed: 50,
        bounciness: 4,
      }).start();
    }
  };

  const handlePressOut = () => {
    if (onPress) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        speed: 50,
        bounciness: 4,
      }).start();
    }
  };

  if (onPress) {
    return (
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={0.9}
          style={[
            styles.card,
            getShadow(),
            { backgroundColor: getBackgroundColor() },
            style
          ]}
        >
          {children}
        </TouchableOpacity>
      </Animated.View>
    );
  }

  return (
    <View
      style={[
        styles.card,
        getShadow(),
        { backgroundColor: getBackgroundColor() },
        style
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: theme.roundness.xl,
    padding: theme.spacing.lg,
  },
  shadowSm: {
    ...Platform.select({
      web: {
        boxShadow: `0 1px 3px ${theme.colors.shadow}, 0 1px 2px ${theme.colors.shadow}`,
      } as any,
      default: {
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 3,
        elevation: 2,
      },
    }),
  },
  shadowMd: {
    ...Platform.select({
      web: {
        boxShadow: `0 4px 12px ${theme.colors.shadowMedium}`,
      } as any,
      default: {
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
      },
    }),
  },
  shadowLg: {
    ...Platform.select({
      web: {
        boxShadow: `0 8px 24px ${theme.colors.shadowHeavy}`,
      } as any,
      default: {
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
        elevation: 8,
      },
    }),
  },
});
