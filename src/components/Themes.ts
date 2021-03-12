import { createGlobalStyle,DefaultTheme } from "styled-components"

declare module "styled-components" {
  export interface DefaultTheme {
  background: string
  textColor: string
  textSecondary: string
  buttonPrimary: string
  buttonGhost: string
  cardBackground: string
  }
}

export const lightTheme: DefaultTheme = {
  background: "#ffffff",
  textColor: "#000",
  textSecondary: "#37364d",
  buttonPrimary: "#5a4fff",
  buttonGhost: "transparent",
  cardBackground: "#ffffff",
}
export const darkTheme: DefaultTheme = {
  background: "#2C3A47",
  textColor: "#fff",
  textSecondary: "#37364d",
  buttonPrimary: "#fff",
  buttonGhost: "transparent",
  cardBackground: "#403C5B",
}

export const GlobalStyle = createGlobalStyle`

* {
    box-sizing: border-box;
    margin:0;
    padding: 0;
    font-family: 'Arial', sans-serif;
  }

html {
    scroll-behavior: smooth;
  }
body {
  min-height: 100vh;
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.textColor};
  scrollbar-width: thin;
  scrollbar-color: #e76f51 #1d3557;
  &::-webkit-scrollbar {
    width: 15px;
  }
  &::-webkit-scrollbar-track {
    background: #1d3557;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #e76f51;
    border-radius: 14px;
    border: 3px solid #1d3557;
  }
}
`