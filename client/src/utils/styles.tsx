import { css } from "styled-components";

type CSSArgs = Parameters<typeof css>;
type CSSReturnType = ReturnType<typeof css>;

const breakpoints = {
  mobile_sm: 400,
  mobile: 576,
  tablet_sm: 768,
  tablet: 992,
  desktop: 1440,
};

function mediaFn<T extends Record<string, number>>(breakpoints: T) {
  const breakpointKeyValuePairs = Object.entries(breakpoints).sort(
    ([, value1], [, value2]) => value1 - value2
  );

  const media: Record<string, (...args: CSSArgs) => CSSReturnType> = {};

  for (let i = 0; i < breakpointKeyValuePairs.length; i++) {
    const [key, value] = breakpointKeyValuePairs[i];
    media[key] = (...args: CSSArgs) => css`
      @media (min-width: ${value}px) {
        ${css(...args)};
      }
    `;
  }

  return media as Record<keyof T, (...args: CSSArgs) => CSSReturnType>;
}

export const media = mediaFn(breakpoints);

export const whereHoverAvailable = (...args: CSSArgs) => css`
  @media (hover: none) {
    ${css(...args)};
  }
`;

export const colors = {
  transparent: "transparent",
  current: "currentColor",
  black: "#000",
  white: "#fff",
  gray: {
    _100: "#f7fafc",
    _200: "#edf2f7",
    _300: "#e2e8f0",
    _400: "#cbd5e0",
    _500: "#a0aec0",
    _600: "#718096",
    _700: "#4a5568",
    _800: "#2d3748",
    _900: "#1a202c",
  },
  red: {
    _100: "#fff5f5",
    _200: "#fed7d7",
    _300: "#feb2b2",
    _400: "#fc8181",
    _500: "#f56565",
    _600: "#e53e3e",
    _700: "#c53030",
    _800: "#9b2c2c",
    _900: "#742a2a",
  },
  orange: {
    _100: "#fffaf0",
    _200: "#feebc8",
    _300: "#fbd38d",
    _400: "#f6ad55",
    _500: "#ed8936",
    _600: "#dd6b20",
    _700: "#c05621",
    _800: "#9c4221",
    _900: "#7b341e",
  },
  yellow: {
    _100: "#fffff0",
    _200: "#fefcbf",
    _300: "#faf089",
    _400: "#f6e05e",
    _500: "#ecc94b",
    _600: "#d69e2e",
    _700: "#b7791f",
    _800: "#975a16",
    _900: "#744210",
  },
  green: {
    _100: "#f0fff4",
    _200: "#c6f6d5",
    _300: "#9ae6b4",
    _400: "#68d391",
    _500: "#48bb78",
    _600: "#38a169",
    _700: "#2f855a",
    _800: "#276749",
    _900: "#22543d",
  },
  teal: {
    _100: "#e6fffa",
    _200: "#b2f5ea",
    _300: "#81e6d9",
    _400: "#4fd1c5",
    _500: "#38b2ac",
    _600: "#319795",
    _700: "#2c7a7b",
    _800: "#285e61",
    _900: "#234e52",
  },
  blue: {
    _100: "#ebf8ff",
    _200: "#bee3f8",
    _300: "#90cdf4",
    _400: "#63b3ed",
    _500: "#4299e1",
    _600: "#3182ce",
    _700: "#2b6cb0",
    _800: "#2c5282",
    _900: "#2a4365",
  },
  indigo: {
    _100: "#ebf4ff",
    _200: "#c3dafe",
    _300: "#a3bffa",
    _400: "#7f9cf5",
    _500: "#667eea",
    _600: "#5a67d8",
    _700: "#4c51bf",
    _800: "#434190",
    _900: "#3c366b",
  },
  purple: {
    _100: "#faf5ff",
    _200: "#e9d8fd",
    _300: "#d6bcfa",
    _400: "#b794f4",
    _500: "#9f7aea",
    _600: "#805ad5",
    _700: "#6b46c1",
    _800: "#553c9a",
    _900: "#44337a",
  },
  pink: {
    _100: "#fff5f7",
    _200: "#fed7e2",
    _300: "#fbb6ce",
    _400: "#f687b3",
    _500: "#ed64a6",
    _600: "#d53f8c",
    _700: "#b83280",
    _800: "#97266d",
    _900: "#702459",
  },
};

export const boxShadow = {
  xs: "box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.05);",
  sm: "box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);",
  default:
    "box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);",
  md:
    "box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);",
  lg:
    "box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);",
  xl:
    "box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);",
  xl_2: "box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);",
  inner: "box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);",
  outline: "box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.5);",
  none: "box-shadow: none;",
};

export const spacing = {
  px: "1px",
  _0: "0",
  _1: "0.25rem",
  _2: "0.5rem",
  _3: "0.75rem",
  _4: "1rem",
  _5: "1.25rem",
  _6: "1.5rem",
  _8: "2rem",
  _10: "2.5rem",
  _12: "3rem",
  _16: "4rem",
  _20: "5rem",
  _24: "6rem",
  _32: "8rem",
  _40: "10rem",
  _48: "12rem",
  _56: "14rem",
  _64: "16rem",
};

export const fontSize = {
  xs: "font-size: 0.75rem;",
  sm: "font-size: 0.875rem;",
  base: "font-size: 1rem;",
  lg: "font-size: 1.125rem;",
  xl: "font-size: 1.25rem;",
  xl_2: "font-size: 1.5rem;",
  xl_3: "font-size: 1.875rem;",
  xl_4: "font-size: 2.25rem;",
  xl_5: "font-size: 3rem;",
  xl_6: "font-size: 4rem;",
};

export function compose(
  ...args: (ReturnType<typeof css> | false | undefined)[]
) {
  return css`
    ${args
      .map((c) => {
        if (!c) {
          return "";
        }
        return c.join("");
      })
      .join("\n")}
  `;
}
