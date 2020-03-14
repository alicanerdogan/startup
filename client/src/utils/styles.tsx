import styled, { css } from "styled-components";
import { extendStyled, extendCss } from "tailwind-in-js";

export const twStyled = extendStyled(styled);
export const twCss = extendCss(css);

type CSSArgs = Parameters<typeof css>;

export const media = {
  sm: (...args: CSSArgs) => css`
    @media (max-width: 576px) {
      ${css(...args)};
    }
  `,
  md: (...args: CSSArgs) => css`
    @media (max-width: 768px) {
      ${css(...args)};
    }
  `,
  lg: (...args: CSSArgs) => css`
    @media (max-width: 992px) {
      ${css(...args)};
    }
  `,
  xl: (...args: CSSArgs) => css`
    @media (max-width: 1200px) {
      ${css(...args)};
    }
  `
};

export const whereHoverAvailable = (...args: CSSArgs) => css`
  @media (hover: none) {
    ${css(...args)};
  }
`;
