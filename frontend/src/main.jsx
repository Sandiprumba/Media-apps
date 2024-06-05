import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import { ColorModeScript } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";
import { extendTheme } from "@chakra-ui/theme-utils";
import { RecoilRoot } from "recoil";

//to change the color of the ui .. depending on the dark mode and light mode

//DEFINE THE GLIBAL STYLES FOR CHAKRA UI THEME.. STYLES OBJECT CONTAINING STYLE CONFIGURATION FOR CHAKRA UI THEME
// GLOBAL REPRESENTS GLOBAL STYLES THAT WILL BE APPLIED TO ALL COMPONENTS IN APPICATIONS..
//AND ARROW FUNCTION TAKES PROPS AS AN ARGUMENT AND RETURNS AN OBJECT CONTAINING THE STYLES TO BE APPLIED
//BODY SELECTOR TARGETS THE <BODY> ELEMENT OF HTML DOCUMENT
const styles = {
  global: (props) => ({
    body: {
      color: mode("gray.800", "whiteAlpha.900")(props), //light mode
      bg: mode("gray.100", "#101010")(props), //dark mode
    },
  }),
};

//INITIAL COLOR MODE SETTING FOR CHAKRA UI THEME .. INITIALLY IT WILL BE DARK WHEN APP LOAD BY DEFAULT ..
//USESYSTEMCOLORMODE ENABLES THE COLOR MODE BASED ON USERS PREFERENCES...
const config = {
  initialColorMode: "dark",
  useSystemColorMode: true,
};

//DEFINED CUSTOM COLORS FOR CHAKRA UI THEME
const colors = {
  gray: {
    light: "#616161",
    dark: "#1e1e1e",
  },
};

//ITS A FUNCTION USED TO CUSTOMIZE THE DEFAULT CHAKRA UI THEME ...
const theme = extendTheme({ config, styles, colors });

//BROWSER ROUTER ENABLES TO USE ALL THE ROUTING FUNCTIONALITIES PROVIDED BY REACT ROUTER DOM ...
//COMPONENT CAN RESPOND TO CHANGES IN URL WITHOUT A FULL PAGE RELOAD ..

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RecoilRoot>
      <BrowserRouter>
        <ChakraProvider theme={theme}>
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />
          <App />
        </ChakraProvider>
      </BrowserRouter>
    </RecoilRoot>
  </React.StrictMode>
);
