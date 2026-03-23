import { colors } from './colors';
import { typography } from './typography';
import { spacing, roundness } from './spacing';

export const theme = {
  colors,
  typography,
  spacing,
  roundness,
};

export type Theme = typeof theme;
