import React from 'react';
import { Text as RNText, TextStyle, StyleSheet } from 'react-native';
import { theme } from '../../theme';

interface TextProps {
  children: React.ReactNode;
  variant?: 'displayLg' | 'headlineMd' | 'title' | 'bodyLg' | 'bodyMd' | 'labelMd';
  color?: keyof typeof theme.colors;
  style?: TextStyle;
  align?: 'left' | 'center' | 'right';
  numberOfLines?: number;
}

export const Text: React.FC<TextProps> = ({ 
  children, 
  variant = 'bodyMd', 
  color = 'onSurface', 
  style,
  align = 'left',
  numberOfLines
}) => {
  const getVariantStyle = () => {
    switch (variant) {
      case 'displayLg':
        return {
          fontFamily: theme.typography.fonts.display,
          fontSize: theme.typography.sizes.displayLg,
          lineHeight: theme.typography.sizes.displayLg * 1.2,
        };
      case 'headlineMd':
        return {
          fontFamily: theme.typography.fonts.headline,
          fontSize: theme.typography.sizes.headlineMd,
          lineHeight: theme.typography.sizes.headlineMd * 1.3,
        };
      case 'title':
        return {
          fontFamily: theme.typography.fonts.title,
          fontSize: 20,
          lineHeight: 28,
        };
      case 'bodyLg':
        return {
          fontFamily: theme.typography.fonts.body,
          fontSize: theme.typography.sizes.bodyLg,
          lineHeight: theme.typography.sizes.bodyLg * 1.5,
        };
      case 'bodyMd':
        return {
          fontFamily: theme.typography.fonts.body,
          fontSize: theme.typography.sizes.bodyMd,
          lineHeight: theme.typography.sizes.bodyMd * 1.5,
        };
      case 'labelMd':
        return {
          fontFamily: theme.typography.fonts.label,
          fontSize: theme.typography.sizes.labelMd,
          letterSpacing: 0.5,
          textTransform: 'uppercase' as const,
        };
      default:
        return {};
    }
  };

  return (
    <RNText 
      numberOfLines={numberOfLines}
      style={[
        getVariantStyle(),
        { 
          color: (typeof theme.colors[color] === 'string' ? theme.colors[color] : theme.colors.primary) as any, 
          textAlign: align 
        },
        style
      ]}
    >
      {children}
    </RNText>
  );
};
