// Single source of truth for the mobile/desktop cutoff in pixels.
// Mirrors `theme.breakpoint.mobile` (47.5em) for use in JavaScript matchMedia queries.
export const MOBILE_BREAKPOINT_PX = 760;

export interface Theme {
  color: {
    // Surfaces - backgrounds for pages, cards, modals
    surface: {
      base: string    // #ffffff   primary surface (cards, main content)
      subtle: string  // #fbfbfc   secondary surface (modals)
      muted: string   // #f2f4f8   tertiary surface (section bgs, card headers, dividers)
      footer: string  // #f4f6f9   footer surface
      border: string  // explicit border colour - more visible than muted
    }
    // Text - readable content
    text: {
      primary: string        // #4c566a   body text, headings
      secondary: string      // #7b88a1   supporting text, labels
      tertiary: string       // #d8dee9   placeholder text, dividers
      inverse: string        // #eceff4   text on dark backgrounds (badges over images)
      primaryHover: string   // rgba(236,239,244,0.4)    hover state bg for primary actions
      secondaryHover: string // rgba(229,233,240,0.75)   hover state bg for secondary actions
    }
    // Nord Frost - cool blues & teals used as card/section accent backgrounds
    frost: {
      teal: string  // #8fbcbb
      sky: string   // #88c0d0
      blue: string  // #81a1c1
      deep: string  // #5e81ac
    }
    // Nord Aurora - warm accent palette for highlights & visual interest
    aurora: {
      red: string    // #bf616a
      orange: string // #d08770
      yellow: string // #ebcb8b
      green: string  // #a3be8c
      purple: string // #b48ead
      // Lighter variants used for high-contrast accent text on dark badge backgrounds
      greenLight: string   // #c8e6a0
      orangeLight: string  // #ffd89a
      yellowLight: string  // #ffd266
    }
  }

  // Spacing - 4px base unit, scale follows Tailwind conventions
  space: {
    1: string   // 0.25rem  (4px)
    2: string   // 0.5rem   (8px)
    3: string   // 0.75rem  (12px)
    4: string   // 1rem     (16px)
    5: string   // 1.25rem  (20px)
    6: string   // 1.5rem   (24px)
    8: string   // 2rem     (32px)
    10: string  // 2.5rem   (40px)
    12: string  // 3rem     (48px)
    16: string  // 4rem     (64px)
    20: string  // 5rem     (80px)
  }

  // Border radius
  radius: {
    none: string  // 0
    sm: string    // 0.25rem  (4px)
    md: string    // 0.5rem   (8px)   inputs, small elements
    lg: string    // 1rem     (16px)  cards, modals
    xl: string    // 1.5rem   (24px)  containers, sections
    full: string  // 9999px           circles, pills
  }

  // Box shadows - use for cards and elevated surfaces
  shadow: {
    none: string
    sm: string   // soft ambient glow (cards)
    md: string   // elevated surface (studio cards, dropdowns)
    lg: string   // prominent surface (hero cards, modals)
  }

  // Drop shadows - use in CSS filter property for images/icons
  dropShadow: {
    sm: string   // subtle image lift
    md: string   // strong image lift
  }

  // Typography
  typography: {
    family: {
      primary: string  // SF Pro Rounded
    }
    size: {
      xxs: string  // 0.65rem  (10px) micro labels (badges, eyebrows)
      xs: string   // 0.75rem  (12px)
      sm: string   // 0.875rem (14px)
      md: string   // 1rem     (16px) base
      lg: string   // 1.2rem   (19px) card names
      xl: string   // 1.5rem   (24px) logo, labels
      xxl: string  // 2rem     (32px) mobile headings
      xxxl: string // 2.5rem   (40px) desktop headings
    }
    weight: {
      light: number    // 300
      regular: number  // 400
      medium: number   // 500
      semibold: number // 600
      bold: number     // 700
      heavy: number    // 900
    }
    lineHeight: {
      tight: number    // 1.2
      normal: number   // 1.5
      relaxed: number  // 1.75
    }
    letterSpacing: {
      tight: string    // -0.05em
      normal: string   // 0
      wide: string     // 0.05em
    }
  }

  // Z-index - explicit layer stack
  zIndex: {
    base: number      // 0
    raised: number    // 1   inline card overlays
    dropdown: number  // 3   nav, dropdowns
    sticky: number    // 5   nav bar, badges
    modal: number     // 10  modals
    overlay: number   // 20  full-screen overlays
  }

  // Transitions
  transition: {
    fast: string    // 150ms ease-in-out
    normal: string  // 300ms ease-in-out  (most common)
    slow: string    // 1s ease-in-out
    spring: string  // 300ms cubic-bezier spring
  }

  // Responsive breakpoints (em-based for zoom consistency)
  breakpoint: {
    mobile: string  // 47.5em (760px)  phone vs tablet — drives bottom nav, drawer filters
    sm: string  // 36em   (576px)
    md: string  // 56.25em (900px)  two-column layouts
    lg: string  // 75em   (1200px)  max-width containers
  }
}

export const lightTheme: Theme = {
  color: {
    surface: {
      base: '#ffffff',
      subtle: '#fbfbfc',
      muted: '#f2f4f8',
      footer: '#f4f6f9',
      border: '#dde2ea',
    },
    text: {
      primary: '#4c566a',
      secondary: 'rgb(123, 136, 161)',
      tertiary: '#d8dee9',
      inverse: '#eceff4',
      primaryHover: 'rgba(236, 239, 244, 0.4)',
      secondaryHover: 'rgba(229, 233, 240, 0.75)',
    },
    frost: {
      teal: '#8fbcbb',
      sky: '#88c0d0',
      blue: '#81a1c1',
      deep: '#5e81ac',
    },
    aurora: {
      red: '#bf616a',
      orange: '#d08770',
      yellow: '#ebcb8b',
      green: '#a3be8c',
      purple: '#b48ead',
      greenLight: '#c8e6a0',
      orangeLight: '#ffd89a',
      yellowLight: '#ffd266',
    },
  },

  space: {
    1: '0.25rem',
    2: '0.5rem',
    3: '0.75rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    8: '2rem',
    10: '2.5rem',
    12: '3rem',
    16: '4rem',
    20: '5rem',
  },

  radius: {
    none: '0',
    sm: '0.25rem',
    md: '0.5rem',
    lg: '1rem',
    xl: '1.5rem',
    full: '9999px',
  },

  shadow: {
    none: 'none',
    sm: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
    md: 'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px',
    lg: 'rgba(0, 0, 0, 0.16) 0px 10px 36px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px',
  },

  dropShadow: {
    sm: 'drop-shadow(0 1px 1px hsl(210deg 40% 6% / 0.2)) drop-shadow(0 1px 1px hsl(210deg 40% 6% / 0.2))',
    md: 'drop-shadow(0 1px 1px hsl(210deg 40% 6% / 0.4)) drop-shadow(0 1px 1px hsl(210deg 40% 6% / 0.4))',
  },

  typography: {
    family: {
      primary: "'SF Pro Rounded', system-ui, -apple-system, sans-serif",
    },
    size: {
      xxs: '0.65rem',
      xs: '0.75rem',
      sm: '0.875rem',
      md: '1rem',
      lg: '1.2rem',
      xl: '1.5rem',
      xxl: '2rem',
      xxxl: '2.5rem',
    },
    weight: {
      light: 300,
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      heavy: 900,
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.75,
    },
    letterSpacing: {
      tight: '-0.05em',
      normal: '0',
      wide: '0.05em',
    },
  },

  zIndex: {
    base: 0,
    raised: 1,
    dropdown: 3,
    sticky: 5,
    modal: 10,
    overlay: 20,
  },

  // Softer, more natural easing curves. Defaults:
  //  - fast   → quick interactions (button hover color/bg)
  //  - normal → general movement (panel opens, modal fades)
  //  - slow   → deliberate, heavy changes (page transitions)
  //  - spring → bouncy playfulness (tap feedback)
  // Curve (0.22, 1, 0.36, 1) is "easeOutQuint" — decelerates smoothly from a fast start.
  transition: {
    fast: 'all 180ms cubic-bezier(0.22, 1, 0.36, 1)',
    normal: 'all 320ms cubic-bezier(0.22, 1, 0.36, 1)',
    slow: 'all 800ms cubic-bezier(0.22, 1, 0.36, 1)',
    spring: 'all 360ms cubic-bezier(0.34, 1.56, 0.64, 1)',
  },

  breakpoint: {
    mobile: '47.5em',
    sm: '36em',
    md: '56.25em',
    lg: '75em',
  },
};

export const darkTheme: Theme = {
  ...lightTheme,
  color: {
    surface: {
      base: '#2e3440',
      subtle: '#3b4252',
      muted: '#434c5e',
      footer: '#242831',
      border: '#3d4659',
    },
    text: {
      primary: '#eceff4',
      secondary: '#d8dee9',
      tertiary: '#4c566a',
      // In dark mode the inverse is the same near-white as primary — text "on dark"
      // is just the regular foreground.
      inverse: '#eceff4',
      primaryHover: 'rgba(76, 86, 106, 0.5)',
      secondaryHover: 'rgba(76, 86, 106, 0.8)',
    },
    frost: lightTheme.color.frost,
    aurora: lightTheme.color.aurora,
  },
  shadow: {
    none: 'none',
    sm: 'rgba(0, 0, 0, 0.4) 0px 8px 24px',
    md: 'rgba(0, 0, 0, 0.5) 0px 1px 2px 0px, rgba(0, 0, 0, 0.3) 0px 2px 6px 2px',
    lg: 'rgba(0, 0, 0, 0.5) 0px 10px 36px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px',
  },
};

export const theme = lightTheme; // backward compat
