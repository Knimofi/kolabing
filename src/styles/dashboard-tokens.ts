// Dashboard Design Tokens
export const DashboardTokens = {
  colors: {
    pageBg: '#F7F8FA',
    cardBg: '#fff',
    primary: '#FFD861',
    textDark: '#232323',
    textMuted: '#606060',
    border: '#EBEBEB',
    inputBg: '#F5F6F8',
  },
  fonts: {
    base: "'Open Sans', Arial, sans-serif",
  },
  fontWeights: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 900,
  },
  spacing: {
    pagePadding: '32px 0',
    cardPadding: '1.5rem',
  },
  borderRadius: {
    button: '8px',
    card: '14px',
    input: '8px',
    badge: '12px',
  },
  shadows: {
    card: '0 1.5px 8px 0 rgba(55, 73, 87, 0.10), 0.5px 0.5px 1.5px rgba(55, 73, 87, 0.13)',
    button: '0 1.5px 4px 0 rgba(55, 73, 87, 0.11)',
    buttonSecondary: '0 1.5px 3px 0 rgba(55, 73, 87, 0.08)',
  },
};

// Convenient style objects for inline use
export const dashboardStyles = {
  page: {
    minHeight: '100vh',
    background: DashboardTokens.colors.pageBg,
    padding: DashboardTokens.spacing.pagePadding,
  },
  card: {
    background: DashboardTokens.colors.cardBg,
    boxShadow: DashboardTokens.shadows.card,
    borderRadius: DashboardTokens.borderRadius.card,
    border: `1px solid ${DashboardTokens.colors.border}`,
  },
  buttonPrimary: {
    background: DashboardTokens.colors.primary,
    color: '#fff',
    fontWeight: DashboardTokens.fontWeights.bold,
    borderRadius: DashboardTokens.borderRadius.button,
    boxShadow: DashboardTokens.shadows.button,
    border: 'none',
  },
  buttonSecondary: {
    background: '#fff',
    color: DashboardTokens.colors.textDark,
    fontWeight: DashboardTokens.fontWeights.medium,
    borderRadius: DashboardTokens.borderRadius.button,
    boxShadow: DashboardTokens.shadows.buttonSecondary,
    border: `1px solid ${DashboardTokens.colors.border}`,
  },
  input: {
    background: DashboardTokens.colors.inputBg,
    color: DashboardTokens.colors.textDark,
    border: 'none',
    borderRadius: DashboardTokens.borderRadius.input,
    fontFamily: DashboardTokens.fonts.base,
  },
};
