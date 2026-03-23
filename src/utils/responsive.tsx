import React from 'react';
import { Dimensions, Platform } from 'react-native';

const { width } = Dimensions.get('window');

interface ResponsiveContainerProps {
  mobile: React.ReactNode;
  desktop?: React.ReactNode;
}

export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({ mobile, desktop }) => {
  const { isDesktop } = useResponsive();
  
  if (isDesktop && desktop) {
    return <>{desktop}</>;
  }
  return <>{mobile}</>;
};

export const useResponsive = () => {
  const [isDesktop, setIsDesktop] = React.useState(width > 768);

  React.useEffect(() => {
    const handler = ({ window }: any) => {
      setIsDesktop(window.width > 768);
    };

    const subscription = Dimensions.addEventListener('change', handler);
    return () => subscription.remove();
  }, []);

  return { isDesktop: Platform.OS === 'web' && isDesktop };
};
