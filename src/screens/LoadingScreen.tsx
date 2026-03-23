import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Animated, Easing, Image, Platform } from 'react-native';
import { Layout } from '../components/common/Layout';
import { Text } from '../components/common/Text';
import { theme } from '../theme';

const TIPS = [
  "💡 Always complete your full course of antibiotics",
  "💡 Keep medical records in one secure place",
  "💡 Ask your pharmacist about drug interactions",
  "💡 Regular check-ups can catch issues early",
  "💡 Hydration helps your body recover faster",
];

export const LoadingScreen: React.FC<any> = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const tipFadeAnim = useRef(new Animated.Value(0)).current;
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    // Logo entrance
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // Progress bar
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 2500,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    }).start();

    // Tip fade in
    Animated.timing(tipFadeAnim, {
      toValue: 1,
      duration: 600,
      delay: 400,
      useNativeDriver: true,
    }).start();

    // Navigate after loading
    const timer = setTimeout(() => {
      navigation.replace('Dashboard');
    }, 2800);

    return () => clearTimeout(timer);
  }, []);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <Layout style={styles.center}>
      <Animated.View style={[
        styles.logoContainer,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        }
      ]}>
        <View style={styles.logoGlow}>
          <Image
            source={require('../../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
      </Animated.View>

      <Animated.View style={{ opacity: fadeAnim }}>
        <Text variant="headlineMd" color="primary" style={styles.text}>
          Preparing your sanctuary...
        </Text>
      </Animated.View>

      {/* Progress Bar */}
      <View style={styles.progressTrack}>
        <Animated.View style={[styles.progressFill, { width: progressWidth as any }]} />
      </View>

      {/* Tip */}
      <Animated.View style={[styles.tipContainer, { opacity: tipFadeAnim }]}>
        <Text variant="bodyMd" color="onSurfaceVariant" align="center">
          {TIPS[tipIndex]}
        </Text>
      </Animated.View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
  },
  logo: {
    width: 220,
    height: 110,
  },
  logoContainer: {
    marginBottom: theme.spacing.xl,
  },
  logoGlow: {
    padding: theme.spacing.xl,
    borderRadius: theme.roundness.xxl,
    backgroundColor: theme.colors.surfaceContainerLowest,
    ...Platform.select({
      web: {
        boxShadow: `0 8px 32px ${theme.colors.shadow}`,
      } as any,
      default: {
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 24,
        elevation: 8,
      },
    }),
  },
  text: {
    marginBottom: theme.spacing.xl,
  },
  progressTrack: {
    width: 240,
    height: 4,
    backgroundColor: theme.colors.surfaceContainerHigh,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: theme.spacing.xxl,
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.secondary,
    borderRadius: 2,
  },
  tipContainer: {
    maxWidth: 320,
    paddingHorizontal: theme.spacing.lg,
  },
});
