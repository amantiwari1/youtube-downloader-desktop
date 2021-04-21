import React from 'react'
import { createGlobalStyle } from 'styled-components'
import tw, { theme, GlobalStyles as BaseStyles } from 'twin.macro'


const CustomStyles  = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family: "Source Sans Pro", sans-serif;
  }
  body {
    ${tw`bg-lightmode dark:(bg-darkmode text-white) transition-all`}
    scroll-behavior: smooth;

    min-width: 200px !important; 
  }
`;

const GlobalStyles = () => (
  <>
    <BaseStyles />
    <CustomStyles  />
  </>
);

export default GlobalStyles;
