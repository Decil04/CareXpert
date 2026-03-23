import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  Platform, 
  KeyboardAvoidingView,
  ScrollView,
  Animated,
  Easing
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Text } from '../components/common/Text';
import { Button } from '../components/common/Button';
import { theme } from '../theme';
import { useResponsive } from '../utils/responsive';
import { ShieldCheck, Lock, Heart, Eye, EyeOff, Mail, ArrowRight } from 'lucide-react-native';

export const LoginScreen: React.FC<any> = ({ navigation }) => {
  const { isDesktop } = useResponsive();
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('demo@carexpert.com');
  const [password, setPassword] = useState('demo1234');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleAuth = async () => {
    if (!email.trim() || !password.trim()) return;
    if (activeTab === 'signup' && !name.trim()) return;

    setLoading(true);
    try {
      const endpoint = activeTab === 'signin' ? '/api/auth/login' : '/api/auth/register';
      const body = activeTab === 'signin' 
        ? { email, password } 
        : { email, password, name };

      // For now, simulate a successful auth and navigate
      // In production, this would call the actual API
      setTimeout(() => {
        setLoading(false);
        navigation.replace('Landing', { isLoggedIn: true, userName: name || 'Demo User' });
      }, 1000);
    } catch (err: any) {
      setLoading(false);
      console.error('Auth error:', err);
    }
  };

  const LeftPanel = () => (
    <LinearGradient
      colors={['#011627', '#0B3D5B', '#0A6C5C']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={[styles.leftPanel, !isDesktop && styles.leftPanelMobile]}
    >
      {/* Logo */}
      <View style={styles.brandRow}>
        <View style={styles.logoMark}>
          <Text variant="labelMd" color="onPrimary" style={styles.logoText}>CX</Text>
        </View>
        <Text variant="title" color="onPrimary" style={styles.brandName}>CareXpert</Text>
      </View>

      {/* Headline */}
      <View style={styles.headlineSection}>
        <Text variant="displayLg" color="onPrimary" style={styles.headline}>
          Clinical Clarity{'\n'}in Seconds.
        </Text>
        <Text variant="bodyLg" color="onPrimary" style={styles.subline}>
          Upload your medical reports and prescriptions. We translate complex jargon into clear, 
          actionable health insights for you and your family.
        </Text>
      </View>

      {/* Trust Indicators */}
      <View style={styles.trustSection}>
        <TrustBadge 
          icon={<ShieldCheck size={16} color="#4ADE80" />} 
          label="HIPAA Compliant" 
        />
        <TrustBadge 
          icon={<Lock size={16} color="#4ADE80" />} 
          label="256-bit Encryption" 
        />
        <TrustBadge 
          icon={<Heart size={16} color="#F472B6" />} 
          label="Trusted by 10K+ Families" 
        />
      </View>

      {/* Footer */}
      {isDesktop && (
        <View style={styles.leftFooter}>
          <Text variant="labelMd" color="onPrimary" style={styles.footerText}>
            © 2024 CareXpert • Privacy Policy • Terms
          </Text>
        </View>
      )}
    </LinearGradient>
  );

  const RightPanel = () => (
    <ScrollView 
      style={styles.rightPanel} 
      contentContainerStyle={styles.rightContent}
      keyboardShouldPersistTaps="handled"
    >
      {/* Tabs */}
      <View style={styles.tabRow}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'signin' && styles.tabActive]}
          onPress={() => setActiveTab('signin')}
        >
          <Text 
            variant="labelMd" 
            color={activeTab === 'signin' ? 'primary' : 'outline'}
            style={styles.tabText}
          >
            Sign In
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'signup' && styles.tabActive]}
          onPress={() => setActiveTab('signup')}
        >
          <Text 
            variant="labelMd" 
            color={activeTab === 'signup' ? 'primary' : 'outline'}
            style={styles.tabText}
          >
            Create Account
          </Text>
        </TouchableOpacity>
      </View>

      {/* Welcome Text */}
      <View style={styles.welcomeSection}>
        <Text variant="headlineMd" color="primary" style={styles.welcomeTitle}>
          {activeTab === 'signin' ? 'Welcome back' : 'Get started'}
        </Text>
        <Text variant="bodyMd" color="onSurfaceVariant">
          {activeTab === 'signin' 
            ? 'Sign in to access your medical insights dashboard.'
            : 'Create your account to start analyzing reports.'}
        </Text>
      </View>

      {/* Google Button */}
      <TouchableOpacity style={styles.googleBtn}>
        <Text variant="bodyMd" color="onSurface" style={styles.googleText}>
          G  Continue with Google
        </Text>
      </TouchableOpacity>

      {/* OR Divider */}
      <View style={styles.orDivider}>
        <View style={styles.orLine} />
        <Text variant="labelMd" color="outline" style={styles.orText}>OR</Text>
        <View style={styles.orLine} />
      </View>

      {/* Name Field (signup only) */}
      {activeTab === 'signup' && (
        <View style={styles.fieldGroup}>
          <Text variant="labelMd" color="onSurface" style={styles.fieldLabel}>Full Name</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="John Doe"
              placeholderTextColor={theme.colors.outlineVariant}
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
          </View>
        </View>
      )}

      {/* Email Field */}
      <View style={styles.fieldGroup}>
        <Text variant="labelMd" color="onSurface" style={styles.fieldLabel}>Email Address</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="you@example.com"
            placeholderTextColor={theme.colors.outlineVariant}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Mail size={18} color={theme.colors.outlineVariant} />
        </View>
      </View>

      {/* Password Field */}
      <View style={styles.fieldGroup}>
        <View style={styles.passwordHeader}>
          <Text variant="labelMd" color="onSurface" style={styles.fieldLabel}>Password</Text>
          {activeTab === 'signin' && (
            <TouchableOpacity>
              <Text variant="labelMd" color="secondary" style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor={theme.colors.outlineVariant}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            {showPassword 
              ? <EyeOff size={18} color={theme.colors.outlineVariant} />
              : <Eye size={18} color={theme.colors.outlineVariant} />
            }
          </TouchableOpacity>
        </View>
      </View>

      {/* Submit Button */}
      <TouchableOpacity 
        style={[styles.submitBtn, loading && styles.submitBtnLoading]}
        onPress={handleAuth}
        disabled={loading}
      >
        <LinearGradient
          colors={['#006B5E', '#00897B']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.submitGradient}
        >
          <Text variant="labelMd" color="onPrimary" style={styles.submitText}>
            {loading ? 'Please wait...' : (activeTab === 'signin' ? 'Sign In' : 'Create Account')}
          </Text>
          {!loading && <ArrowRight size={18} color="white" />}
        </LinearGradient>
      </TouchableOpacity>

      {/* Switch Auth Mode */}
      <View style={styles.switchRow}>
        <Text variant="bodyMd" color="onSurfaceVariant">
          {activeTab === 'signin' ? "Don't have an account?" : "Already have an account?"}
        </Text>
        <TouchableOpacity onPress={() => setActiveTab(activeTab === 'signin' ? 'signup' : 'signin')}>
          <Text variant="bodyMd" color="primary" style={styles.switchLink}>
            {activeTab === 'signin' ? ' Sign up free' : ' Sign in'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {isDesktop ? (
        <View style={styles.splitLayout}>
          <LeftPanel />
          <RightPanel />
        </View>
      ) : (
        <KeyboardAvoidingView 
          style={styles.mobileLayout}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <LeftPanel />
          <RightPanel />
        </KeyboardAvoidingView>
      )}
    </Animated.View>
  );
};

const TrustBadge = ({ icon, label }: any) => (
  <View style={styles.trustBadge}>
    {icon}
    <Text variant="bodyMd" color="onPrimary" style={styles.trustLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#011627',
  },
  splitLayout: {
    flex: 1,
    flexDirection: 'row',
  },
  mobileLayout: {
    flex: 1,
  },
  // Left Panel
  leftPanel: {
    flex: 1,
    padding: 48,
    justifyContent: 'space-between',
  },
  leftPanelMobile: {
    paddingVertical: 32,
    paddingHorizontal: 24,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 48,
  },
  logoMark: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontWeight: '800',
    fontSize: 14,
  },
  brandName: {
    fontWeight: '700',
    fontSize: 18,
  },
  headlineSection: {
    gap: 20,
    marginBottom: 48,
  },
  headline: {
    fontSize: 44,
    lineHeight: 52,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subline: {
    opacity: 0.8,
    lineHeight: 26,
    maxWidth: 420,
  },
  trustSection: {
    gap: 16,
  },
  trustBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  trustLabel: {
    opacity: 0.9,
    fontWeight: '500',
  },
  leftFooter: {
    marginTop: 48,
  },
  footerText: {
    opacity: 0.5,
  },
  // Right Panel
  rightPanel: {
    flex: 1,
    backgroundColor: theme.colors.surfaceContainerLowest,
  },
  rightContent: {
    padding: 48,
    paddingTop: 40,
    maxWidth: 480,
    alignSelf: 'center',
    width: '100%',
  },
  // Tabs
  tabRow: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surfaceContainerLow,
    borderRadius: theme.roundness.xl,
    padding: 4,
    marginBottom: 32,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: theme.roundness.xl - 2,
  },
  tabActive: {
    backgroundColor: theme.colors.surfaceContainerLowest,
    ...Platform.select({
      web: {
        boxShadow: `0 1px 3px ${theme.colors.shadow}`,
      } as any,
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 3,
        elevation: 2,
      },
    }),
  },
  tabText: {
    fontWeight: '600',
    fontSize: 14,
  },
  // Welcome
  welcomeSection: {
    gap: 8,
    marginBottom: 28,
  },
  welcomeTitle: {
    fontWeight: '800',
    fontSize: 28,
  },
  // Google
  googleBtn: {
    borderWidth: 1,
    borderColor: theme.colors.outlineVariant,
    borderRadius: theme.roundness.lg,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 20,
  },
  googleText: {
    fontWeight: '500',
  },
  // OR Divider
  orDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 12,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.outlineVariant,
  },
  orText: {
    fontWeight: '600',
    fontSize: 11,
    letterSpacing: 1,
  },
  // Fields
  fieldGroup: {
    marginBottom: 20,
    gap: 8,
  },
  fieldLabel: {
    fontWeight: '600',
    fontSize: 13,
  },
  passwordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  forgotText: {
    fontWeight: '600',
    fontSize: 13,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.outlineVariant,
    borderRadius: theme.roundness.lg,
    paddingHorizontal: 16,
    backgroundColor: theme.colors.surfaceContainerLowest,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 15,
    color: theme.colors.onSurface,
  },
  // Submit
  submitBtn: {
    borderRadius: theme.roundness.lg,
    overflow: 'hidden',
    marginTop: 8,
    marginBottom: 24,
  },
  submitBtnLoading: {
    opacity: 0.7,
  },
  submitGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  submitText: {
    fontWeight: '700',
    fontSize: 15,
  },
  // Switch
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  switchLink: {
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});
