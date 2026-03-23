import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { theme } from '../../theme';
import { Settings, ChevronLeft } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

interface ScreenHeaderProps {
  showBack?: boolean;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({ showBack }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.topHeader}>
      <View style={styles.left}>
        {showBack ? (
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <ChevronLeft size={24} color={theme.colors.onSurface} />
          </TouchableOpacity>
        ) : (
          <Image 
            source={require('../../../assets/logo.png')} 
            style={styles.siteLogo}
            resizeMode="contain"
          />
        )}
      </View>
      <TouchableOpacity 
        style={styles.settingsCircle}
        onPress={() => navigation.navigate('Settings' as never)}
      >
        <Settings size={20} color={theme.colors.onSurfaceVariant} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  topHeader: {
    padding: theme.spacing.xl,
    paddingTop: theme.spacing.xl,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  siteLogo: {
    width: 120,
    height: 40,
  },
  backButton: {
    padding: theme.spacing.xs,
  },
  settingsCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.surfaceContainerHighest,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
