import React from 'react';
import { View, ViewStyle, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { theme } from '../../theme';

interface LayoutProps {
  children: React.ReactNode;
  style?: ViewStyle;
  safe?: boolean;
  scrollable?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  style, 
  safe = true,
  scrollable = false 
}) => {
  const Container = safe ? SafeAreaView : View;
  const ContentContainer = scrollable ? ScrollView : View;

  return (
    <Container style={[styles.container, style]}>
      <ContentContainer 
        style={scrollable ? styles.scrollContent : styles.container}
        contentContainerStyle={scrollable ? styles.scrollContentContainer : undefined}
      >
        {children}
      </ContentContainer>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  scrollContent: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingBottom: theme.spacing.xl,
  },
});
