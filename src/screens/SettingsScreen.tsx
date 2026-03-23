import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Layout } from '../components/common/Layout';
import { Text } from '../components/common/Text';
import { ChevronLeft, User, Lock, FileText, Bell, LogOut, ChevronRight } from 'lucide-react-native';

const COLORS = {
  bgLight: '#FAFBFC',
  primaryDark: '#0A2540',
  primaryGreen: '#006B5E',
  textGrey: '#4A5568',
  borderLight: '#EDF2F7',
  white: '#FFFFFF',
};

export const SettingsScreen: React.FC<any> = ({ navigation }) => {
  return (
    <Layout scrollable style={{ backgroundColor: COLORS.bgLight }}>
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <ChevronLeft size={24} color={COLORS.primaryDark} />
        </TouchableOpacity>
        <Text variant="headlineMd" style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 40 }} /> {/* Spacer */}
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Account Section */}
        <Text variant="labelMd" style={styles.sectionTitle}>ACCOUNT</Text>
        <View style={styles.sectionCard}>
          <TouchableOpacity style={styles.row}>
            <View style={styles.rowLeft}>
              <View style={styles.iconBox}>
                <User size={18} color={COLORS.primaryDark} />
              </View>
              <Text variant="bodyMd" style={styles.rowText}>Personal Information</Text>
            </View>
            <ChevronRight size={18} color="#CBD5E1" />
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.row}>
            <View style={styles.rowLeft}>
              <View style={styles.iconBox}>
                <Bell size={18} color={COLORS.primaryDark} />
              </View>
              <Text variant="bodyMd" style={styles.rowText}>Notifications</Text>
            </View>
            <ChevronRight size={18} color="#CBD5E1" />
          </TouchableOpacity>
        </View>

        {/* Security Section (Moved from Landing) */}
        <Text variant="labelMd" style={styles.sectionTitle}>SECURITY & PRIVACY</Text>
        <View style={styles.sectionCard}>
          <TouchableOpacity style={styles.row}>
            <View style={styles.rowLeft}>
              <View style={styles.iconBox}>
                <Lock size={18} color={COLORS.primaryDark} />
              </View>
              <Text variant="bodyMd" style={styles.rowText}>Change Password</Text>
            </View>
            <ChevronRight size={18} color="#CBD5E1" />
          </TouchableOpacity>
          <View style={styles.divider} />
          
          {/* Security details moved from Landing Screen */}
          <View style={styles.securityBox}>
            <View style={styles.hipaaFooterLine}>
              <Lock size={14} color={COLORS.primaryGreen} />
              <Text style={styles.hipaaFooterText}>HIPAA COMPLIANT</Text>
            </View>
            <Text style={styles.copyrightText}>
              © 2024 Clinical Sanctuary. This tool provides{'\n'}
              informational insights and is not a substitute for{'\n'}
              professional medical advice.
            </Text>
            <View style={styles.legalLinks}>
              <Text style={styles.legalLink}>Privacy Policy</Text>
              <Text style={styles.legalLink}>Terms of Service</Text>
              <Text style={styles.legalLink}>Medical Disclaimer</Text>
            </View>
          </View>
        </View>

        {/* Support Section */}
        <Text variant="labelMd" style={styles.sectionTitle}>SUPPORT</Text>
        <View style={styles.sectionCard}>
          <TouchableOpacity style={styles.row}>
            <View style={styles.rowLeft}>
              <View style={styles.iconBox}>
                <FileText size={18} color={COLORS.primaryDark} />
              </View>
              <Text variant="bodyMd" style={styles.rowText}>Help Center & FAQ</Text>
            </View>
            <ChevronRight size={18} color="#CBD5E1" />
          </TouchableOpacity>
        </View>

        {/* Logout */}
        <TouchableOpacity 
          style={styles.logoutBtn}
          onPress={() => navigation.navigate('Login')}
        >
          <LogOut size={18} color="#E53E3E" />
          <Text variant="labelMd" style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

      </ScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
  backBtn: {
    padding: 8,
    marginLeft: -8,
  },
  content: {
    padding: 24,
    paddingBottom: 80,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#718096',
    marginBottom: 12,
    marginTop: 24,
    marginLeft: 8,
    letterSpacing: 0.5,
  },
  sectionCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#EDF2F7',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#F7FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowText: {
    fontWeight: '600',
    color: COLORS.primaryDark,
  },
  divider: {
    height: 1,
    backgroundColor: '#EDF2F7',
    marginLeft: 68,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: '#FFF5F5',
    paddingVertical: 16,
    borderRadius: 16,
    marginTop: 40,
    borderWidth: 1,
    borderColor: '#FED7D7',
  },
  logoutText: {
    color: '#E53E3E',
    fontWeight: '700',
    fontSize: 15,
  },
  securityBox: {
    backgroundColor: '#F7FAFC',
    padding: 24,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    alignItems: 'center',
  },
  hipaaFooterLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  hipaaFooterText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.primaryGreen,
    letterSpacing: 0.5,
  },
  copyrightText: {
    fontSize: 9,
    lineHeight: 14,
    textAlign: 'center',
    color: '#A0AEC0',
    marginBottom: 16,
  },
  legalLinks: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    alignItems: 'center',
  },
  legalLink: {
    fontSize: 9,
    fontWeight: '600',
    color: '#718096',
  },
});
