// Landing Page Design Tokens
export const LandingTokens = {
  colors: {
    yellow: '#FFD861',
    black: '#000',
    white: '#fff',
    grey: '#222',
    muted: '#F9F7E8',
  },
  fonts: {
    heading: "'Rubik', Arial, sans-serif",
    body: "'Darker Grotesque', Arial, sans-serif",
  },
  fontWeights: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  },
  spacing: {
    sectionPadding: '5rem 1rem',
    cardPadding: '2rem',
  },
  borderRadius: {
    button: '0.6em',
    card: '1rem',
    cardLarge: '2rem',
  },
};

// Convenient style objects for inline use
export const landingStyles = {
  heading: {
    fontFamily: LandingTokens.fonts.heading,
    fontWeight: LandingTokens.fontWeights.extrabold,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.04em',
    color: LandingTokens.colors.black,
  },
  subheading: {
    fontFamily: LandingTokens.fonts.heading,
    fontWeight: LandingTokens.fontWeights.bold,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.04em',
  },
  body: {
    fontFamily: LandingTokens.fonts.body,
    fontWeight: LandingTokens.fontWeights.regular,
    color: LandingTokens.colors.grey,
  },
  bodyBold: {
    fontFamily: LandingTokens.fonts.body,
    fontWeight: LandingTokens.fontWeights.bold,
  },
};
