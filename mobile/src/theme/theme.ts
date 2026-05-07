export const theme = {
  colors: {
    background: '#0D0D0D', // Deep, OLED-friendly black
    surface: '#1A1A1A',
    surfaceLight: '#262626',
    primary: '#A0D8FF', // Soft blue accent
    primaryMuted: '#A0D8FF30',
    lightAccent: '#C799FF', // Soft purple accent
    successAccent: '#81C784', // Standard User green
    textPrimary: '#FFFFFF',
    textSecondary: '#8A8D98',
    border: '#2D3039',
  },
  typography: {
    fontFamily: {
      heading: 'SpaceGrotesk-Bold',
      headingMedium: 'SpaceGrotesk-Medium',
      body: 'DMSans-Regular',
      bodyMedium: 'DMSans-Medium',
      bodyBold: 'DMSans-Bold',
      mono: 'DMMono-Regular',
    },
    size: {
      h1: 58,
      h2: 40,
      h3: 32,
      h4: 24,
      bodyLarge: 16,
      body: 14,
      caption: 12,
    },
    weight: {
      regular: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    }
  },
  spacing: { xs: 4, s: 8, m: 16, l: 24, xl: 32, xxl: 48 },
  layout: { borderRadius: 20 } // Slightly softer radius for the premium feel
};