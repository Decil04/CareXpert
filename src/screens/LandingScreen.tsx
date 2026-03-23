import React, { useRef, useEffect, useState } from 'react';
import { 
  View, 
  StyleSheet, 
  Animated, 
  Platform, 
  TouchableOpacity, 
  TextInput,
  Easing,
  Image
} from 'react-native';
import { Layout } from '../components/common/Layout';
import { Text } from '../components/common/Text';
import { ShieldCheck, Lock, CheckCircle, FileUp, Shield, BarChart2, FileText, User } from 'lucide-react-native';
import { DocumentUpload } from '../components/common/DocumentUpload';
import { useResponsive } from '../utils/responsive';

// Exact colors from the design
const COLORS = {
  bgLight: '#FAFBFC', // Main page background
  bgSection: '#F4F6F8', // Bottom section background
  primaryDark: '#0A2540', // Headings, buttons
  primaryGreen: '#006B5E', // "Seconds.", icons
  mintLight: '#A3E4D7', // HIPAA badge bg, upload icon bg
  textGrey: '#4A5568', // Body text
  borderLight: '#EDF2F7', 
  white: '#FFFFFF',
};

// --- Custom Animated Button Component for Press Effects ---
const AnimatedTouchable = ({ children, onPress, style }: any) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
      speed: 20,
      bounciness: 10,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 10,
    }).start();
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
    >
      <Animated.View style={[style, { transform: [{ scale: scaleAnim }] }]}>
        {children}
      </Animated.View>
    </TouchableOpacity>
  );
};

export const LandingScreen: React.FC<any> = ({ navigation, route }) => {
  const { isDesktop } = useResponsive();
  
  const isLoggedIn = route.params?.isLoggedIn;
  const userName = route.params?.userName;
  
  const [age, setAge] = useState('');
  const [language, setLanguage] = useState<'English' | 'Hindi'>('English');

  // ANIMATION VALUES
  // Staggered Entrance
  const staggerValues = useRef([...Array(8)].map(() => new Animated.Value(0))).current;
  
  // Floating & Pulsing effects
  const floatAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  
  // New Complex Animations
  const blobRotation = useRef(new Animated.Value(0)).current;
  const blobScale = useRef(new Animated.Value(1)).current;
  const iconBounce = useRef(new Animated.Value(0)).current;
  const cardFloat1 = useRef(new Animated.Value(0)).current;
  const cardFloat2 = useRef(new Animated.Value(0)).current;
  const cardFloat3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 1. Staggered Entrance
    const animations = staggerValues.map((anim, index) => 
      Animated.timing(anim, {
        toValue: 1,
        duration: 800,
        delay: index * 100, // 100ms stagger
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      })
    );
    Animated.stagger(100, animations).start();

    // 2. Floating Animation (Upload Box)
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: -8, duration: 2000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue: 0, duration: 2000, easing: Easing.inOut(Easing.ease), useNativeDriver: true })
      ])
    ).start();

    // 3. Pulse Animation (HIPAA Badge)
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.05, duration: 1500, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1500, easing: Easing.inOut(Easing.ease), useNativeDriver: true })
      ])
    ).start();

    // 4. Background Blob Morphing Effect
    Animated.loop(
      Animated.parallel([
        Animated.timing(blobRotation, {
          toValue: 1,
          duration: 30000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(blobScale, { toValue: 1.3, duration: 8000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
          Animated.timing(blobScale, { toValue: 1, duration: 8000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        ])
      ])
    ).start();

    // 5. Upload Icon Gentle Bounce
    Animated.loop(
      Animated.sequence([
        Animated.timing(iconBounce, { toValue: -6, duration: 1200, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(iconBounce, { toValue: 0, duration: 1200, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    ).start();

    // 6. Standards Cards Wave Effect (Staggered floating)
    const animateCard = (animVal: Animated.Value, delay: number) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(animVal, { toValue: -12, duration: 2500, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
          Animated.timing(animVal, { toValue: 0, duration: 2500, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        ])
      ).start();
    };
    animateCard(cardFloat1, 0);
    animateCard(cardFloat2, 800);
    animateCard(cardFloat3, 1600);
  }, []);

  // Helper to get animated styles for staggered elements
  const getEntranceStyle = (index: number) => ({
    opacity: staggerValues[index],
    transform: [
      {
        translateY: staggerValues[index].interpolate({
          inputRange: [0, 1],
          outputRange: [30, 0], // slide up 30px
        }),
      },
    ],
  });

  const blobRotateInterpolate = blobRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  return (
    <Layout scrollable style={{ backgroundColor: COLORS.bgLight }}>
      {/* Decorative Background Element (Animated Blob) */}
      {isDesktop && (
        <Animated.View 
          style={[
            styles.blurBlob, 
            { 
              transform: [
                { rotate: blobRotateInterpolate },
                { scale: blobScale }
              ] 
            }
          ]} 
          pointerEvents="none" 
        />
      )}

      {/* Navigation Header */}
      <Animated.View style={[styles.navHeader, !isDesktop && styles.navHeaderMobile, getEntranceStyle(0)]}>
        <Image source={require('../../assets/images/logo_medical.jpg')} style={styles.brandLogo} resizeMode="contain" />
        <View style={[styles.navRight, !isDesktop && styles.navRightMobile]}>
          {isDesktop && (
            <View style={styles.navLinks}>
              <AnimatedTouchable onPress={() => navigation.navigate('Doctors')}>
                <Text variant="labelMd" style={styles.navLink}>DOCTORS</Text>
              </AnimatedTouchable>
              <AnimatedTouchable>
                <Text variant="labelMd" style={styles.navLink}>HOW IT WORKS</Text>
              </AnimatedTouchable>
              <AnimatedTouchable>
                <Text variant="labelMd" style={styles.navLink}>FAQ</Text>
              </AnimatedTouchable>
              <AnimatedTouchable>
                <Text variant="labelMd" style={styles.navLink}>ABOUT</Text>
              </AnimatedTouchable>
            </View>
          )}
          {!isDesktop && (
            <AnimatedTouchable onPress={() => navigation.navigate('Doctors')}>
              <Text variant="labelMd" style={styles.mobileNavLink}>DOCTORS</Text>
            </AnimatedTouchable>
          )}
          {isLoggedIn ? (
            <AnimatedTouchable style={styles.userBadge}>
              <Text variant="labelMd" style={styles.userNameText}>{userName}</Text>
            </AnimatedTouchable>
          ) : (
            <AnimatedTouchable 
              style={styles.loginBtn}
              onPress={() => navigation.navigate('Login')}
            >
              <Text variant="labelMd" style={styles.loginText}>LOGIN</Text>
            </AnimatedTouchable>
          )}
        </View>
      </Animated.View>

      <View style={styles.mainContent}>
        
        {/* Split Hero Section */}
        <View style={[styles.heroSection, !isDesktop && styles.heroMobile]}>
          
          {/* Left Hero Content */}
          <View style={styles.heroLeft}>
            <Animated.View style={[getEntranceStyle(1), { transform: [{ scale: pulseAnim }], alignSelf: 'flex-start' }]}>
              <View style={styles.hipaaBadge}>
                <ShieldCheck size={12} color={COLORS.primaryDark} />
                <Text variant="labelMd" style={styles.hipaaText}>HIPAA COMPLIANT SECURITY</Text>
              </View>
            </Animated.View>

            <Animated.View style={getEntranceStyle(2)}>
              <Text variant="displayLg" style={styles.headline}>
                Clinical Clarity in{'\n'}
                <Text variant="displayLg" style={styles.headlineHighlight}>Seconds.</Text>
              </Text>
            </Animated.View>

            <Animated.View style={getEntranceStyle(3)}>
              <Text variant="bodyLg" style={styles.subheadline}>
                Upload your medical documents for an instant, secure summary. Designed to help you understand your health journey with editorial precision.
              </Text>
            </Animated.View>

            {/* Config Form */}
            <Animated.View style={[styles.configContainer, getEntranceStyle(4)]}>
              <View style={styles.configField}>
                <Text variant="labelMd" style={styles.configLabel}>PATIENT AGE</Text>
                <TextInput 
                  style={styles.ageInput}
                  placeholder="e.g. 45"
                  placeholderTextColor="#A0AEC0"
                  value={age}
                  onChangeText={setAge}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.configField}>
                <Text variant="labelMd" style={styles.configLabel}>LANGUAGE PREFERENCE</Text>
                <View style={styles.toggleGroup}>
                  <TouchableOpacity 
                    style={[styles.toggleBtn, language === 'English' && styles.toggleActive]}
                    onPress={() => setLanguage('English')}
                    activeOpacity={0.8}
                  >
                    <Text variant="labelMd" style={language === 'English' ? { ...styles.toggleText as any, ...styles.toggleTextActive as any } : styles.toggleText}>English</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.toggleBtn, language === 'Hindi' && styles.toggleActive]}
                    onPress={() => setLanguage('Hindi')}
                    activeOpacity={0.8}
                  >
                    <Text variant="labelMd" style={language === 'Hindi' ? { ...styles.toggleText as any, ...styles.toggleTextActive as any } : styles.toggleText}>Hindi</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Animated.View>
          </View>

          {/* Right Hero / Upload Card */}
          <Animated.View style={[styles.heroRight, getEntranceStyle(5)]}>
            {/* Wrapper has the floating animation */}
            <Animated.View style={[styles.uploadCardWrapper, !isDesktop && styles.uploadCardWrapperMobile, { transform: [{ translateY: floatAnim }] }]}>
              
              <View style={[styles.uploadBoxInner, !isDesktop && styles.uploadBoxInnerMobile]}>
                <View style={[styles.uploadIconWrap, !isDesktop && styles.uploadIconWrapMobile]}>
                  {/* Bouncing Icon */}
                  <Animated.View style={{ transform: [{ translateY: iconBounce }] }}>
                    <FileUp size={22} color="#0A2540" />
                  </Animated.View>
                </View>
                <Text variant="headlineMd" style={Object.assign({}, styles.uploadTitle, !isDesktop ? styles.uploadTitleMobile : {}) as any}>
                  Drop medical files here
                </Text>
                <Text variant="bodyMd" style={Object.assign({}, styles.uploadSub, !isDesktop ? styles.uploadSubMobile : {}) as any}>
                  Support for PDF, JPG, and PNG files up to 20MB.
                </Text>
                
                <View style={styles.documentUploadWrapper}>
                  {/* Reuse DocumentUpload but visually styled via container */}
                  <DocumentUpload 
                    compact 
                    metadata={{ age, language }}
                    customButton={
                      <View pointerEvents="none" style={styles.deviceBtn}>
                        <Text variant="labelMd" style={styles.deviceBtnText}>
                          SELECT FROM DEVICE
                        </Text>
                      </View>
                    }
                  />
                </View>
              </View>

              <View style={[styles.trustBadgesRow, !isDesktop && styles.trustBadgesRowMobile]}>
                <View style={styles.smallTrust}>
                  <Lock size={12} color={COLORS.primaryGreen} />
                  <Text variant="labelMd" style={styles.smallTrustText}>END-TO-END ENCRYPTED</Text>
                </View>
                <View style={styles.smallTrust}>
                  <ShieldCheck size={12} color={COLORS.primaryGreen} />
                  <Text variant="labelMd" style={styles.smallTrustText}>NO DATA RETENTION</Text>
                </View>
                <View style={styles.smallTrust}>
                  <CheckCircle size={12} color={COLORS.primaryGreen} />
                  <Text variant="labelMd" style={styles.smallTrustText}>CLINICAL PRECISION</Text>
                </View>
              </View>
            </Animated.View>
          </Animated.View>

        </View>

        {/* Sanctuary Standards Section */}
        <Animated.View style={[styles.standardsArea, !isDesktop && styles.standardsAreaMobile, getEntranceStyle(6)]}>
          <Text variant="headlineMd" style={Object.assign({}, styles.standardsTitle, !isDesktop ? styles.standardsTitleMobile : {}) as any}>
            The Sanctuary Standards
          </Text>

          <View style={[styles.standardsGrid, !isDesktop && styles.standardsGridMobile]}>
            {/* Card 1 */}
            <Animated.View style={[styles.standardCard, { transform: [{ translateY: cardFloat1 }] }]}>
              <View style={styles.standardIconWrap}>
                <ShieldCheck size={20} color={COLORS.primaryGreen} />
              </View>
              <Text variant="title" style={styles.standardCardTitle}>Patient First</Text>
              <Text variant="bodyMd" style={styles.standardCardBody}>
                Complexity simplified. We translate medical jargon into actionable insights.
              </Text>
            </Animated.View>

            {/* Card 2 */}
            <Animated.View style={[styles.standardCard, { transform: [{ translateY: cardFloat2 }] }]}>
              <View style={styles.standardIconWrap}>
                <BarChart2 size={20} color={COLORS.primaryGreen} />
              </View>
              <Text variant="title" style={styles.standardCardTitle}>Visual Mapping</Text>
              <Text variant="bodyMd" style={styles.standardCardBody}>
                See trends in your health data through intuitive charts and summaries.
              </Text>
            </Animated.View>

            {/* Card 3 */}
            <Animated.View style={[styles.standardCard, { transform: [{ translateY: cardFloat3 }] }]}>
              <View style={styles.standardIconWrap}>
                <Shield size={20} color={COLORS.primaryGreen} />
              </View>
              <Text variant="title" style={styles.standardCardTitle}>Bank-Grade</Text>
              <Text variant="bodyMd" style={styles.standardCardBody}>
                Your data never leaves your session. Private, secure, and clinical.
              </Text>
            </Animated.View>
          </View>
        </Animated.View>

        {/* --- Mobile App-like Static Footer Section --- */}
        {!isDesktop && (
          <View style={styles.mobileFooterContainer}>
            {/* Tab Bar */}
            {isLoggedIn && (
              <View style={styles.mobileTabBar}>
                <TouchableOpacity 
                  style={[styles.tabItem, styles.tabItemActive]}
                  onPress={() => navigation.navigate('Landing')}
                >
                  <FileUp size={20} color={COLORS.primaryGreen} />
                  <Text style={Object.assign({}, styles.tabText, styles.tabTextActive) as any}>UPLOAD</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.tabItem}
                  onPress={() => navigation.navigate('Dashboard')}
                >
                  <BarChart2 size={20} color={COLORS.textGrey} />
                  <Text style={styles.tabText}>INSIGHTS</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.tabItem}
                  onPress={() => navigation.navigate('Settings')}
                >
                  <User size={20} color={COLORS.textGrey} />
                  <Text style={styles.tabText}>PROFILE</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Legal / Copyright string removed (Moved to Settings Screen) */}
          </View>
        )}

      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  blurBlob: {
    position: 'absolute',
    top: -150,
    right: -100,
    width: 600,
    height: 600,
    backgroundColor: 'rgba(163, 228, 215, 0.15)', // Mint light color with low opacity
    borderRadius: 300,
    ...Platform.select({
      web: { filter: 'blur(80px)' } as any,
    }),
  },
  navHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 60,
    paddingVertical: 24,
    zIndex: 10,
  },
  brandLogo: {
    height: 32,
    width: 200,
  },
  navHeaderMobile: {
    paddingHorizontal: 24,
  },
  navLogo: {
    fontWeight: '800',
    fontSize: 22,
    color: '#1A365D',
    letterSpacing: -0.5,
  },
  navRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  navRightMobile: {
    gap: 12,
  },
  navLinks: {
    flexDirection: 'row',
    gap: 40,
  },
  navLink: {
    fontWeight: '700',
    fontSize: 14,
    color: '#475569',
    letterSpacing: 0.5,
    ...Platform.select({ web: { transition: 'color 0.2s ease' } as any }),
  },
  mobileNavLink: {
    fontWeight: '700',
    fontSize: 10,
    color: '#475569',
    letterSpacing: 0.5,
  },
  loginBtn: {
    backgroundColor: '#1E3A5F',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 4,
    ...Platform.select({
      web: { transition: 'background-color 0.2s ease, transform 0.2s ease' } as any,
    }),
  },
  loginText: {
    fontWeight: '700',
    color: COLORS.white,
    fontSize: 14,
    letterSpacing: 0.5,
  },
  userBadge: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    backgroundColor: '#E2E8F0',
  },
  userNameText: {
    fontWeight: '700',
    color: COLORS.primaryDark,
    fontSize: 13,
    letterSpacing: 0.5,
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 60,
    maxWidth: 1400,
    alignSelf: 'center',
    width: '100%',
    zIndex: 2,
  },
  heroSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 60,
    marginTop: 60,
    marginBottom: 80,
  },
  heroMobile: {
    flexDirection: 'column',
    gap: 40,
    marginTop: 20,
  },
  heroLeft: {
    flex: 1,
    paddingRight: 40,
  },
  hipaaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.mintLight,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    gap: 6,
    marginBottom: 24,
  },
  hipaaText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.primaryDark,
    letterSpacing: 1,
  },
  headline: {
    fontSize: 56,
    lineHeight: 64,
    fontWeight: '800',
    color: COLORS.primaryDark,
    letterSpacing: -1.5,
    marginBottom: 20,
  },
  headlineHighlight: {
    fontSize: 56,
    lineHeight: 64,
    fontWeight: '800',
    color: COLORS.primaryGreen,
    letterSpacing: -1.5,
  },
  subheadline: {
    fontSize: 18,
    lineHeight: 28,
    color: COLORS.textGrey,
    marginBottom: 40,
    maxWidth: 500,
  },
  configContainer: {
    flexDirection: 'row',
    gap: 20,
    backgroundColor: '#F5F5F5', 
    padding: 16,
    borderRadius: 12,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  configField: {
    gap: 8,
  },
  configLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#718096',
    letterSpacing: 0.5,
  },
  ageInput: {
    backgroundColor: COLORS.white,
    borderRadius: 6,
    width: 80,
    height: 36,
    paddingHorizontal: 12,
    fontSize: 14,
    color: COLORS.primaryDark,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...Platform.select({ web: { transition: 'border-color 0.2s ease' } as any }),
  },
  toggleGroup: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    borderRadius: 6,
    padding: 2,
    height: 36,
  },
  toggleBtn: {
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    ...Platform.select({ web: { transition: 'background-color 0.2s ease' } as any }),
  },
  toggleActive: {
    backgroundColor: COLORS.white,
    ...Platform.select({
      web: { boxShadow: '0 1px 2px rgba(0,0,0,0.1)' } as any,
      default: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 1 }
    })
  },
  toggleText: {
    fontWeight: '600',
    fontSize: 13,
    color: '#718096',
  },
  toggleTextActive: {
    color: COLORS.primaryDark,
  },
  heroRight: {
    flex: 1,
  },
  uploadCardWrapper: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 40,
    ...Platform.select({
      web: { boxShadow: `0 20px 40px rgba(10, 37, 64, 0.08)` } as any,
      default: { shadowColor: '#0A2540', shadowOffset: { width: 0, height: 20 }, shadowOpacity: 0.08, shadowRadius: 40, elevation: 10 }
    })
  },
  uploadCardWrapperMobile: {
    backgroundColor: 'transparent',
    padding: 0,
    borderWidth: 0,
    shadowColor: 'transparent',
    elevation: 0,
  },
  uploadBoxInner: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    borderRadius: 16,
    paddingVertical: 56,
    paddingHorizontal: 32,
    alignItems: 'center',
    marginBottom: 32,
    ...Platform.select({ web: { transition: 'border-color 0.3s ease, background-color 0.3s ease' } as any }),
  },
  uploadBoxInnerMobile: {
    paddingVertical: 32,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  uploadIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: '#A3E4D7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 28,
  },
  uploadIconWrapMobile: {
    width: 48,
    height: 48,
    marginBottom: 16,
  },
  uploadTitle: {
    fontWeight: '800',
    color: '#0A2540',
    fontSize: 28,
    marginBottom: 12,
  },
  uploadTitleMobile: {
    fontSize: 22,
    textAlign: 'center',
  },
  uploadSub: {
    color: COLORS.textGrey,
    fontSize: 16,
    marginBottom: 32,
  },
  uploadSubMobile: {
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  documentUploadWrapper: {
    width: '100%',
    alignItems: 'center',
  },
  deviceBtn: {
    backgroundColor: '#1C3553', 
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 6,
  },
  deviceBtnText: {
    fontWeight: '800',
    fontSize: 14,
    color: COLORS.white,
    letterSpacing: 0.5,
  },
  trustBadgesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  trustBadgesRowMobile: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 8,
  },
  smallTrust: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  smallTrustText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#4A5568',
    letterSpacing: 0.5,
  },
  standardsArea: {
    backgroundColor: COLORS.bgSection,
    borderRadius: 32,
    padding: 80,
    marginBottom: 80,
  },
  standardsAreaMobile: {
    padding: 24,
    marginBottom: 40,
    borderRadius: 16,
  },
  standardsTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.primaryDark,
    marginBottom: 60,
    textAlign: 'center',
  },
  standardsTitleMobile: {
    fontSize: 24,
    marginBottom: 40,
  },
  standardsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 40,
  },
  standardsGridMobile: {
    flexDirection: 'column',
  },
  standardCard: {
    flex: 1,
    alignItems: 'center',
    gap: 16,
  },
  standardIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    ...Platform.select({
      web: { boxShadow: '0 4px 12px rgba(0,0,0,0.04)' } as any,
      default: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 12, elevation: 2 }
    })
  },
  standardCardTitle: {
    fontWeight: '700',
    color: COLORS.primaryDark,
  },
  standardCardBody: {
    lineHeight: 24,
    color: COLORS.textGrey,
    textAlign: 'center',
    maxWidth: 280,
  },
  mobileFooterContainer: {
    marginTop: 20,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    paddingTop: 16,
  },
  mobileTabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EDF2F7',
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  tabItemActive: {
    backgroundColor: '#E6F4F1', // very light mint green bg
  },
  tabText: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.textGrey,
  },
  tabTextActive: {
    color: COLORS.primaryGreen,
  },
});
