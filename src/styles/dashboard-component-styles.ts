// Dashboard Component Style Constants
// Centralized styling for consistent dashboard UI elements

export const DashboardComponentStyles = {
  // Page Headers
  pageTitle: {
    fontFamily: "'Rubik', Arial, sans-serif",
    fontWeight: 700,
    fontSize: '30px',
    textTransform: 'uppercase' as const,
    color: '#232323',
    letterSpacing: '-0.02em',
    marginBottom: '8px',
  },
  
  pageSubtitle: {
    fontFamily: "'Open Sans', Arial, sans-serif",
    fontWeight: 400,
    fontSize: '15px',
    color: '#999',
    marginBottom: '24px',
  },

  // Search Inputs
  searchInput: {
    background: '#F5F5F5',
    color: '#222',
    border: 'none',
    borderRadius: '8px',
    padding: '0.625rem 0.75rem 0.625rem 2.5rem',
    fontFamily: "'Open Sans', Arial, sans-serif",
    fontSize: '14px',
    width: '100%',
    outline: 'none',
  },

  searchInputFocus: {
    border: '1px solid #E8D7A0',
    boxShadow: '0 0 0 3px rgba(255, 246, 216, 0.4)',
  },

  searchIcon: {
    position: 'absolute' as const,
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#606060',
    pointerEvents: 'none' as const,
  },

  searchContainer: {
    position: 'relative' as const,
    width: '100%',
    maxWidth: '400px',
  },

  // Dropdown Triggers
  dropdownTrigger: {
    background: '#F5F5F5',
    color: '#222',
    border: 'none',
    borderRadius: '8px',
    padding: '0.625rem 0.75rem',
    fontFamily: "'Open Sans', Arial, sans-serif",
    fontSize: '14px',
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
  },

  dropdownTriggerHover: {
    background: '#ECECEC',
  },

  // Empty State Cards
  emptyStateCard: {
    background: '#fff',
    border: '1px solid #EBEBEB',
    borderRadius: '14px',
    boxShadow: '0 1.5px 8px 0 rgba(55, 73, 87, 0.10), 0.5px 0.5px 1.5px rgba(55, 73, 87, 0.13)',
    padding: '3rem 2rem',
    textAlign: 'center' as const,
    color: '#606060',
  },

  emptyStateIcon: {
    fontSize: '48px',
    marginBottom: '16px',
    opacity: 0.5,
  },

  emptyStateTitle: {
    fontFamily: "'Open Sans', Arial, sans-serif",
    fontWeight: 700,
    fontSize: '18px',
    color: '#232323',
    marginBottom: '8px',
  },

  emptyStateDescription: {
    fontFamily: "'Open Sans', Arial, sans-serif",
    fontWeight: 400,
    fontSize: '14px',
    color: '#606060',
  },

  // Standard Card
  card: {
    background: '#fff',
    boxShadow: '0 1.5px 8px 0 rgba(55, 73, 87, 0.10), 0.5px 0.5px 1.5px rgba(55, 73, 87, 0.13)',
    borderRadius: '14px',
    border: '1px solid #EBEBEB',
    padding: '1.5rem',
  },

  // Filter Buttons Container
  filterContainer: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap' as const,
    marginBottom: '24px',
  },
};

// CSS Class Names for Tailwind
export const DashboardClassNames = {
  pageTitle: "font-[700] text-[30px] uppercase text-[#232323] tracking-tight mb-2",
  pageSubtitle: "text-[15px] text-[#999] mb-6",
  searchInput: "w-full bg-[#F5F5F5] text-[#222] border-none rounded-lg px-3 py-2.5 pl-10 focus:outline-none focus:border focus:border-[#E8D7A0] focus:shadow-[0_0_0_3px_rgba(255,246,216,0.4)]",
  searchContainer: "relative w-full max-w-md",
  searchIcon: "absolute left-3 top-1/2 -translate-y-1/2 text-[#606060] pointer-events-none",
  dropdownTrigger: "bg-[#F5F5F5] text-[#222] border-none rounded-lg px-3 py-2.5 font-medium flex items-center gap-2 hover:bg-[#ECECEC]",
  emptyStateCard: "bg-white border border-[#EBEBEB] rounded-[14px] shadow-[0_1.5px_8px_0_rgba(55,73,87,0.10),0.5px_0.5px_1.5px_rgba(55,73,87,0.13)] p-12 text-center text-[#606060]",
  card: "bg-white shadow-[0_1.5px_8px_0_rgba(55,73,87,0.10),0.5px_0.5px_1.5px_rgba(55,73,87,0.13)] rounded-[14px] border border-[#EBEBEB] p-6",
};
